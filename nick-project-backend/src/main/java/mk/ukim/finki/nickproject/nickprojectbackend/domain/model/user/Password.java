package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.ValueObject;
import org.springframework.lang.NonNull;

import javax.persistence.Embeddable;
import java.util.Objects;

@Embeddable
@Getter
public class Password implements ValueObject {

    private String password;

    protected Password() {}

    public Password(@NonNull String password) {
        Objects.requireNonNull(password, "password must not be null");

        if (password.length() < 6) {
            throw new IllegalArgumentException("The password must be at least 6 characters long");
        }

        this.password = password;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Password password1 = (Password) o;
        return Objects.equals(password, password1.password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(password);
    }

    @Override
    public String toString() {
        return "Password{" +
                "password='" + password + '\'' +
                '}';
    }

}
