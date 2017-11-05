package hu.elte.alkfejl.issuetracker.api;

import hu.elte.alkfejl.issuetracker.model.Issue;
import hu.elte.alkfejl.issuetracker.model.IssueMessage;
import hu.elte.alkfejl.issuetracker.service.IssueService;
import hu.elte.alkfejl.issuetracker.service.UserService;
import hu.elte.alkfejl.issuetracker.service.annotations.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static hu.elte.alkfejl.issuetracker.model.User.Role.ADMIN;
import static hu.elte.alkfejl.issuetracker.model.User.Role.USER;

/**
 * @author Godzsák Dávid <godzsakdavid@gmail.com>
 */
@RestController
@RequestMapping("/api/issues")
public class IssueApiController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserService userService;

    @Role({ADMIN, USER})
    @GetMapping
    private ResponseEntity<Iterable<Issue>> list() {
        Iterable<Issue> issues = issueService.listByRole(userService.getUser());
        return ResponseEntity.ok(issues);
    }

    @Role({ADMIN, USER})
    @PostMapping
    private ResponseEntity<Issue> create(@RequestBody Issue issue) {
        Issue saved = issueService.create(issue);
        return ResponseEntity.ok(saved);
    }

    @Role({ADMIN, USER})
    @GetMapping("/{id}")
    private ResponseEntity<Issue> read(@PathVariable String id) {
        Issue read = issueService.read(Integer.parseInt(id));
        return ResponseEntity.ok(read);
    }

    @Role(ADMIN)
    @PutMapping("/{id}")
    private ResponseEntity<Issue> update(@PathVariable int id, @RequestBody Issue issue) {
        Issue updated = issueService.update(id, issue);
        return ResponseEntity.ok(updated);
    }

    @Role(ADMIN)
    @DeleteMapping("/{id}")
    private ResponseEntity delete(@PathVariable int id) {
        issueService.delete(id);
        return ResponseEntity.ok().build();
    }

    @Role({USER, ADMIN})
    @PostMapping("/{id}/message")
    private ResponseEntity addMessage(@PathVariable int id, @RequestBody IssueMessage message) {
        issueService.addMessage(id, message);
        return ResponseEntity.ok().build();
    }
}
