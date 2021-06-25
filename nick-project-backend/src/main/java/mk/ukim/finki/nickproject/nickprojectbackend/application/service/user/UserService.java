package mk.ukim.finki.nickproject.nickprojectbackend.application.service.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeCommentedOnEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeCreatedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeDeletedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeLikedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

public interface UserService {

    List<User> searchUsers(String searchTerm);

    User getUser(UserId userId);

    User getUserByEmail(Email email);

    byte[] getUserProfilePicture(UserId userId);

    User createUser(FullName fullName, Email email, Password password, Password confirmPassword, String residence,
                    LocalDate dateOfBirth);

    User changeUserPersonalInfo(UserId userId, Email email, FullName fullName, String residence, LocalDate dateOfBirth);

    String changeUserProfilePicture(UserId userId, MultipartFile imageFile);

    void changeUserPassword(UserId userId, Password oldPassword, Password newPassword, Password confirmNewPassword);

    void addUserRecipe(RecipeCreatedEvent event);

    void removeUserRecipe(RecipeDeletedEvent event);

    User addFriend(UserId userId, UserId friendId);

    void removeFriend(UserId userId, UserId friendId);

    FriendRequest sendFriendRequest(UserId requestor, UserId requestee);

    void removeFriendRequest(UserId requestor, UserId requestee);

    void addUserLikeNotification(RecipeLikedEvent event);

    void addUserCommentNotification(RecipeCommentedOnEvent event);

    void setNotificationOnSeen(UserId userId, NotificationId notificationId);

}
