package mk.ukim.finki.nickproject.nickprojectbackend.port.dto.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.User;

import java.io.Serializable;

@Getter
public class UserInfoDto implements Serializable {

    private final String userId;

    private final String profilePictureFilename;

    private final String firstName;

    private final String lastName;

    public UserInfoDto(User user) {
        this.userId = user.id().getId();
        this.firstName = user.getFullName().getFirstName();
        this.lastName = user.getFullName().getLastName();
        this.profilePictureFilename = user.getProfilePicture().getFilename();
    }

}
