package mk.ukim.finki.nickproject.nickprojectbackend.port.form.user;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class UserForm {

    private final String firstName;

    private final String lastName;

    private final String email;

    private final String password;

    private final String confirmPassword;

    private final String residence;

    private final LocalDate dateOfBirth;

}
