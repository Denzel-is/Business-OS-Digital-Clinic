package com.denzelis.businessos.configuration.media;

import jakarta.validation.constraints.NotBlank;
import java.nio.file.Path;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "business-os.media-storage")
public record MediaStorageProperties(@NotBlank String directory) {

    public MediaStorageProperties {
        directory = directory == null ? "" : directory;
    }

    public Path root() {
        return Path.of(directory).toAbsolutePath().normalize();
    }
}
