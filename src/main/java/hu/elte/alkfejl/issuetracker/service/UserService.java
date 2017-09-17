package hu.elte.alkfejl.issuetracker.service;

import hu.elte.alkfejl.issuetracker.model.User;
import hu.elte.alkfejl.issuetracker.repository.UserRepoitory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import static hu.elte.alkfejl.issuetracker.model.User.Role.USER;

/**
 * @author Godzsák Dávid <godzsakdavid@gmail.com>
 */

@Service
public class UserService {
    @Autowired
    private UserRepoitory userRepoitory;

    public void register(User user) {
        user.setRole(USER);
        userRepoitory.save(user);
    }

    public boolean isValid(User user) {
        return userRepoitory.findByUsernameAndPassword(user.getUsername(), user.getPassword()).isPresent();
    }
}
