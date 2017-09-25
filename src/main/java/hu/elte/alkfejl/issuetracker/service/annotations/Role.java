package hu.elte.alkfejl.issuetracker.service.annotations;

import hu.elte.alkfejl.issuetracker.model.User;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author Godzsák Dávid <godzsakdavid@gmail.com>
 */

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD)
public @interface Role {
    User.Role[] value() default {User.Role.GUEST};
}
