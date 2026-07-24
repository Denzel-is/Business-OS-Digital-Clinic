package com.denzelis.businessos.project.application;

import com.denzelis.businessos.configuration.media.MediaStorageProperties;
import com.denzelis.businessos.project.api.MediaUploadResponse;
import com.denzelis.businessos.project.infrastructure.persistence.ProjectEntity;
import com.denzelis.businessos.project.infrastructure.persistence.ProjectMediaEntity;
import com.denzelis.businessos.project.infrastructure.persistence.ProjectMediaRepository;
import com.denzelis.businessos.project.infrastructure.persistence.ProjectRepository;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.web.multipart.MultipartFile;

@Service
public class SafeMediaUploadService {

    private static final int SIGNATURE_BYTES = 16;

    private final MediaStorageProperties properties;
    private final ProjectMediaRepository projectMediaRepository;
    private final ProjectRepository projectRepository;

    public SafeMediaUploadService(
            MediaStorageProperties properties,
            ProjectMediaRepository projectMediaRepository,
            ProjectRepository projectRepository) {
        this.properties = properties;
        this.projectMediaRepository = projectMediaRepository;
        this.projectRepository = projectRepository;
    }

    @Transactional
    public MediaUploadResponse upload(
            UUID projectId, String altText, int sortOrder, MultipartFile multipartFile) {
        if (multipartFile.isEmpty()) {
            throw new UnsafeMediaUploadException("The uploaded file is empty");
        }
        if (altText == null || altText.isBlank() || altText.length() > 300) {
            throw new UnsafeMediaUploadException(
                    "Alt text is required and must be at most 300 characters");
        }
        if (sortOrder < 0) {
            throw new UnsafeMediaUploadException("Sort order must be non-negative");
        }

        DetectedMedia detectedMedia = detect(multipartFile);
        ProjectEntity project =
                projectRepository.findById(projectId).orElseThrow(ProjectNotFoundException::new);
        Path storedFile = store(multipartFile, detectedMedia.extension());
        registerRollbackCleanup(storedFile);

        ProjectMediaEntity entity =
                projectMediaRepository.save(
                        ProjectMediaEntity.createDraft(
                                project,
                                detectedMedia.mediaType(),
                                storedFile.getFileName().toString(),
                                altText,
                                sortOrder));
        return new MediaUploadResponse(
                entity.getId(), entity.getStorageKey(), entity.getMediaType().name(), "DRAFT");
    }

    private DetectedMedia detect(MultipartFile file) {
        byte[] signature = new byte[SIGNATURE_BYTES];
        int read;
        try (InputStream stream = file.getInputStream()) {
            read = stream.read(signature);
        } catch (IOException exception) {
            throw new UnsafeMediaUploadException("The uploaded file could not be inspected");
        }
        if (read < 4) {
            throw new UnsafeMediaUploadException("The uploaded file signature is invalid");
        }
        byte[] bytes = Arrays.copyOf(signature, read);

        if (startsWith(bytes, 0xFF, 0xD8, 0xFF)) {
            return new DetectedMedia(ProjectMediaEntity.MediaType.IMAGE, "jpg");
        }
        if (startsWith(bytes, 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A)) {
            return new DetectedMedia(ProjectMediaEntity.MediaType.IMAGE, "png");
        }
        if (startsWithAscii(bytes, 0, "RIFF") && startsWithAscii(bytes, 8, "WEBP")) {
            return new DetectedMedia(ProjectMediaEntity.MediaType.IMAGE, "webp");
        }
        if (startsWithAscii(bytes, 4, "ftyp")) {
            return new DetectedMedia(ProjectMediaEntity.MediaType.VIDEO, "mp4");
        }
        if (startsWithAscii(bytes, 0, "%PDF-")) {
            return new DetectedMedia(ProjectMediaEntity.MediaType.DOCUMENT, "pdf");
        }
        throw new UnsafeMediaUploadException("The uploaded media type is not allowed");
    }

    private Path store(MultipartFile file, String extension) {
        try {
            Files.createDirectories(properties.root());
            Path root = properties.root().toRealPath(LinkOption.NOFOLLOW_LINKS);
            Path target = root.resolve(UUID.randomUUID() + "." + extension).normalize();
            if (!target.startsWith(root)) {
                throw new UnsafeMediaUploadException("The storage path is invalid");
            }
            try (InputStream stream = file.getInputStream();
                    OutputStream output =
                            Files.newOutputStream(
                                    target,
                                    StandardOpenOption.CREATE_NEW,
                                    StandardOpenOption.WRITE)) {
                stream.transferTo(output);
            }
            return target;
        } catch (IOException exception) {
            throw new UnsafeMediaUploadException("The uploaded file could not be stored");
        }
    }

    private static void registerRollbackCleanup(Path storedFile) {
        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            return;
        }
        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCompletion(int status) {
                        if (status == STATUS_ROLLED_BACK) {
                            try {
                                Files.deleteIfExists(storedFile);
                            } catch (IOException ignored) {
                                // A cleanup job can remove an orphan; never expose the storage
                                // path.
                            }
                        }
                    }
                });
    }

    private static boolean startsWith(byte[] source, int... expected) {
        if (source.length < expected.length) {
            return false;
        }
        for (int index = 0; index < expected.length; index++) {
            if (Byte.toUnsignedInt(source[index]) != expected[index]) {
                return false;
            }
        }
        return true;
    }

    private static boolean startsWithAscii(byte[] source, int offset, String value) {
        if (source.length < offset + value.length()) {
            return false;
        }
        for (int index = 0; index < value.length(); index++) {
            if (source[offset + index] != (byte) value.charAt(index)) {
                return false;
            }
        }
        return true;
    }

    private record DetectedMedia(ProjectMediaEntity.MediaType mediaType, String extension) {}
}
