package mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.Email;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.User;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, UserId> {

    @Query("SELECT u " +
            "FROM User u " +
            "WHERE CONCAT(u.fullName.firstName, ' ', u.fullName.lastName) LIKE %?1%")
    List<User> searchUsers(String searchTerm);

    Optional<User> findByEmail(Email email);

}
