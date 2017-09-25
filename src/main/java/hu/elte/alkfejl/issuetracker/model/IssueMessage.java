package hu.elte.alkfejl.issuetracker.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.sql.Timestamp;
import java.time.LocalDateTime;

/**
 * @author Godzsák Dávid <godzsakdavid@gmail.com>
 */
@Entity
@Table(name = "ISSUE_MESSAGES")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class IssueMessage extends BaseEntity {

    @Column(nullable = false)
    private Timestamp timestamp;

    @Column(nullable = false)
    private String message;

    @JoinColumn
    @ManyToOne(targetEntity = Issue.class)
    private Issue issue;
}
