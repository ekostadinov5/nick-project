package mk.ukim.finki.nickproject.nickprojectbackend.port.dto.user;

import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.User;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class UserDto implements Serializable {

    private final String userId;

    private final String email;

    private final String profilePictureFilename;

    private final String firstName;

    private final String lastName;

    private final String residence;

    private final LocalDate dateOfBirth;

    private final Set<String> recipeIds;

    private final Set<UserInfoDto> friends;

    public UserDto(User user) {
        this.userId = user.id().getId();
        this.email = user.getEmail().getEmail();
        this.firstName = user.getFullName().getFirstName();
        this.lastName = user.getFullName().getLastName();
        this.residence = user.getResidence();
        this.dateOfBirth = user.getDateOfBirth();
        this.profilePictureFilename = user.getProfilePicture().getFilename();
        this.recipeIds = user.getRecipes().stream()
                .map(r -> r.getRecipeId().getId())
                .collect(Collectors.toSet());
        this.friends = user.getFriends().stream()
                .map(UserInfoDto::new)
                .collect(Collectors.toSet());
    }

}
