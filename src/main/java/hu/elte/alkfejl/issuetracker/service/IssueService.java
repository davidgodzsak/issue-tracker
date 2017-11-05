package hu.elte.alkfejl.issuetracker.service;

import hu.elte.alkfejl.issuetracker.model.Issue;
import hu.elte.alkfejl.issuetracker.model.IssueMessage;
import hu.elte.alkfejl.issuetracker.model.User;
import hu.elte.alkfejl.issuetracker.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.Collections;

/**
 * @author Godzsák Dávid <godzsakdavid@gmail.com>
 */
@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    public Iterable<Issue> issues() {
        return issueRepository.findAll();
    }

    public Iterable<Issue> listByRole(User user) {
        //TODO: kivenni
        if (user == null) {
            return issueRepository.findAll();
        }
        User.Role role = user.getRole();
        if (role.equals(User.Role.USER)) {
            return issueRepository.findAllByUser(user);
        } else if (role.equals(User.Role.ADMIN)) {
            return issueRepository.findAll();
        }
        return Collections.emptyList();
    }

    public Issue create(Issue issue) {
        issue.setStatus(Issue.Status.ADDED);
        issue.setTimestamp(Timestamp.valueOf(LocalDateTime.now()));
        return issueRepository.save(issue);
    }

    public Issue update(int id, Issue issue) {
        Issue currentIssue = issueRepository.findOne(id);

        currentIssue.setStatus(issue.getStatus());
        return issueRepository.save(currentIssue);
    }

    public void delete(int id) {
        issueRepository.delete(id);
    }

    public Issue read(int id) {
        return issueRepository.findOne(id);
    }

    public void addMessage(int id, IssueMessage message) {
        Issue issue = issueRepository.findOne(id);
        message.setTimestamp(Timestamp.valueOf(LocalDateTime.now()));
        issue.getMessages().add(message);
        issueRepository.save(issue);
    }
}
