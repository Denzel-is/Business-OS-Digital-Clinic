package com.denzelis.businessos.diagnostic.infrastructure.persistence;

import com.denzelis.businessos.shared.infrastructure.persistence.AuditedEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(
        name = "diagnostic_answer",
        indexes = @Index(name = "idx_diagnostic_answer_session_id", columnList = "session_id"),
        uniqueConstraints =
                @UniqueConstraint(
                        name = "uq_diagnostic_answer_question",
                        columnNames = {"session_id", "question_code"}))
public class DiagnosticAnswerEntity extends AuditedEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "session_id", nullable = false)
    private DiagnosticSessionEntity session;

    @Column(name = "question_code", nullable = false, length = 80)
    private String questionCode;

    @Column(name = "answer_code", nullable = false, length = 80)
    private String answerCode;

    protected DiagnosticAnswerEntity() {}
}
