package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.CommentId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.LikeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.RecipeId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.AbstractEntity;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media.ImageFile;
import org.hibernate.annotations.Where;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "application_user")
@Getter
public class User extends AbstractEntity<UserId> {

    @Version
    private Long version;

    @Embedded
    @AttributeOverride(name = "email", column = @Column(name = "email", unique = true))
    private Email email;

    @Embedded
    @AttributeOverrides({
            @AttributeOverride(name = "firstName", column = @Column(name = "first_name")),
            @AttributeOverride(name = "lastName", column = @Column(name = "last_name"))
    })
    private FullName fullName;

    @Column(name = "residence", nullable = false)
    private String residence;

    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    private ImageFile profilePicture;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    private Set<UserRecipe> recipes;

    @ManyToMany(fetch = FetchType.EAGER)
    @JsonIgnore
    private Set<User> friends;

    @OneToMany(mappedBy = "requestor", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FriendRequest> sentFriendRequests;

    @OneToMany(mappedBy = "requestee", fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<FriendRequest> receivedFriendRequests;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @Where(clause = "seen = false")
    private Set<LikeNotification> likeNotifications;

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "user_id")
    @Where(clause = "seen = false")
    private Set<CommentNotification> commentNotifications;

    protected User() {
    }

    public User(Email email, FullName fullName, String residence, LocalDate dateOfBirth) {
        super(DomainObjectId.randomId(UserId.class));

        Objects.requireNonNull(email, "email must not be null");
        Objects.requireNonNull(fullName, "fullName must not be null");
        Objects.requireNonNull(residence, "residence must not be null");
        Objects.requireNonNull(dateOfBirth, "dateOfBirth must not be null");

        this.changePersonalInfo(email, fullName, residence, dateOfBirth);
        this.changeProfilePicture(new ImageFile(""));

        this.recipes = new HashSet<>();
        this.friends = new HashSet<>();
        this.sentFriendRequests = new HashSet<>();
        this.receivedFriendRequests = new HashSet<>();
        this.likeNotifications = new HashSet<>();
        this.commentNotifications = new HashSet<>();
    }

    public void changePersonalInfo(Email email, FullName fullName, String residence, LocalDate dateOfBirth) {
        this.email = email;
        this.fullName = fullName;
        this.residence = residence;
        this.dateOfBirth = dateOfBirth;
    }

    public void changeProfilePicture(ImageFile profilePicture) {
        this.profilePicture = profilePicture;
    }

    public void addRecipe(RecipeId recipeId) {
        this.recipes.add(new UserRecipe(recipeId));
    }

    public void removeRecipe(RecipeId recipeId) {
        UserRecipe recipe = this.recipes.stream()
                .filter(r -> r.getRecipeId().equals(recipeId))
                .findFirst()
                .orElseThrow(RuntimeException::new);
        this.recipes.remove(recipe);
    }

    public void addFriend(User friend) {
        this.friends.add(friend);
    }

    public void removeFriend(User friend) {
        this.friends.remove(friend);
    }

    public FriendRequest sendFriendRequest(UserId requestee) {
        boolean exists = this.sentFriendRequests.stream().anyMatch(fr -> fr.getRequestee().equals(requestee));
        if (exists) {
            throw new RuntimeException();
        }
        FriendRequest friendRequest = new FriendRequest(this.id(), requestee);
        this.sentFriendRequests.add(friendRequest);
        return friendRequest;
    }

    public void removeFriendRequest(UserId requestee) {
        FriendRequest friendRequest = this.sentFriendRequests.stream()
                .filter(fr -> fr.getRequestee().equals(requestee))
                .findFirst()
                .orElseThrow(RuntimeException::new);
        this.sentFriendRequests.remove(friendRequest);
    }

    public void addReceivedFriendRequest(FriendRequest friendRequest) {
        this.receivedFriendRequests.add(friendRequest);
    }

    public void removeReceivedFriendRequest(UserId requestor) {
        FriendRequest friendRequest = this.receivedFriendRequests.stream()
                .filter(fr -> fr.getRequestor().equals(requestor))
                .findFirst()
                .orElseThrow(RuntimeException::new);
        this.receivedFriendRequests.remove(friendRequest);
    }

    public void addLikeNotification(RecipeId recipeId, UserId likedBy, LikeId likeId) {
        this.likeNotifications.add(new LikeNotification(recipeId, likedBy, likeId));
    }

    public void addCommentNotification(RecipeId recipeId, UserId commentedBy, CommentId commentId) {
        this.commentNotifications.add(new CommentNotification(recipeId, commentedBy, commentId));
    }

    public void setNotificationOnSeen(NotificationId notificationId) {
        Notification notification = this.getAllNotification().stream()
                .filter(n -> n.id().equals(notificationId))
                .findFirst()
                .orElseThrow(RuntimeException::new);
        notification.setOnSeen();
    }

    private Set<Notification> getAllNotification() {
        Set<Notification> notifications = new HashSet<>();
        notifications.addAll(this.likeNotifications);
        notifications.addAll(this.commentNotifications);
        return notifications;
    }

}
