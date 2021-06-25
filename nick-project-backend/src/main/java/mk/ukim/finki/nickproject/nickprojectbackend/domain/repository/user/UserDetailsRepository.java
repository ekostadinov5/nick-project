package mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDetailsRepository extends JpaRepository<UserDetails, Long> {

    UserDetails findByUsername(String username);

}
