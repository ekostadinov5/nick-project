package mk.ukim.finki.nickproject.nickprojectbackend.application.service.user.impl;

import mk.ukim.finki.nickproject.nickprojectbackend.application.service.file.FileService;
import mk.ukim.finki.nickproject.nickprojectbackend.application.service.user.UserService;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeCommentedOnEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeCreatedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeDeletedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.recipe.event.RecipeLikedEvent;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media.ImageFile;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.*;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.user.UserRepository;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final FileService fileService;

    public UserServiceImpl(UserRepository userRepository,
                           UserDetailsServiceImpl userDetailsServiceImpl,
                           FileService fileService) {
        this.userRepository = userRepository;
        this.userDetailsServiceImpl = userDetailsServiceImpl;
        this.fileService = fileService;
    }

    @Override
    public List<User> searchUsers(String searchTerm) {
        return this.userRepository.searchUsers(searchTerm);
    }

    @Override
    public User getUser(UserId userId) {
        return this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
    }

    @Override
    public User getUserByEmail(Email email) {
        return this.userRepository.findByEmail(email).orElseThrow(RuntimeException::new);
    }

    @Override
    public byte[] getUserProfilePicture(UserId userId) {
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        String filename = user.getProfilePicture().getFilename();
        return this.fileService.loadFile(filename);
    }

    @Override
    public User createUser(FullName fullName, Email email, Password password, Password confirmPassword,
                           String residence, LocalDate dateOfBirth) {
        if (!password.equals(confirmPassword)) {
            throw new RuntimeException();
        }
        this.userDetailsServiceImpl.registerUser(email.getEmail(), password.getPassword());
        return this.userRepository.saveAndFlush(new User(email, fullName, residence, dateOfBirth));
    }

    @Override
    public User changeUserPersonalInfo(UserId userId, Email email, FullName fullName, String residence,
                                       LocalDate dateOfBirth) {
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        this.userDetailsServiceImpl.changeUserEmail(user.getEmail().getEmail(), email.getEmail());
        user.changePersonalInfo(email, fullName, residence, dateOfBirth);
        return this.userRepository.saveAndFlush(user);
    }

    @Override
    public String changeUserProfilePicture(UserId userId, MultipartFile imageFile) {
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        if (!user.getProfilePicture().getFilename().isEmpty()) {
            this.fileService.deleteFile(user.getProfilePicture().getFilename());
        }
        String filename = UUID.randomUUID().toString();
        this.fileService.saveFile(filename, imageFile);
        user.changeProfilePicture(new ImageFile(filename));
        this.userRepository.saveAndFlush(user);
        return filename;
    }

    @Override
    public void changeUserPassword(UserId userId, Password oldPassword, Password newPassword,
                                   Password confirmNewPassword) {
        if (!newPassword.equals(confirmNewPassword)) {
            throw new RuntimeException();
        }
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        this.userDetailsServiceImpl.changeUserPassword(user.getEmail().getEmail(), oldPassword.getPassword(),
                newPassword.getPassword());
    }

    @Override
    @Async
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void addUserRecipe(RecipeCreatedEvent event) {
        User user = this.userRepository.findById(event.getUserId()).orElseThrow(RuntimeException::new);
        user.addRecipe(event.getRecipeId());
        this.userRepository.saveAndFlush(user);
    }

    @Override
    @Async
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void removeUserRecipe(RecipeDeletedEvent event) {
        User user = this.userRepository.findById(event.getUserId()).orElseThrow(RuntimeException::new);
        user.removeRecipe(event.getRecipeId());
        this.userRepository.saveAndFlush(user);
    }

    @Override
    public User addFriend(UserId userId, UserId friendId) {
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        User friend = this.userRepository.findById(friendId).orElseThrow(RuntimeException::new);
        user.addFriend(friend);
        friend.addFriend(user);
        user.removeFriendRequest(friend.id());
        friend.removeReceivedFriendRequest(user.id());
        this.userRepository.saveAll(Arrays.asList(user, friend));
        return user;
    }

    @Override
    public void removeFriend(UserId userId, UserId friendId) {
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        User friend = this.userRepository.findById(friendId).orElseThrow(RuntimeException::new);
        user.removeFriend(friend);
        friend.removeFriend(user);
        this.userRepository.saveAll(Arrays.asList(user, friend));
    }

    @Override
    public FriendRequest sendFriendRequest(UserId requestor, UserId requestee) {
        User requestorUser = this.userRepository.findById(requestor).orElseThrow(RuntimeException::new);
        User requesteeUser = this.userRepository.findById(requestee).orElseThrow(RuntimeException::new);
        FriendRequest friendRequest = requestorUser.sendFriendRequest(requestee);
        requesteeUser.addReceivedFriendRequest(friendRequest);
        this.userRepository.saveAll(Arrays.asList(requestorUser, requesteeUser));
        return friendRequest;
    }

    @Override
    public void removeFriendRequest(UserId requestor, UserId requestee) {
        User requestorUser = this.userRepository.findById(requestor).orElseThrow(RuntimeException::new);
        User requesteeUser = this.userRepository.findById(requestee).orElseThrow(RuntimeException::new);
        requestorUser.removeFriendRequest(requestee);
        requesteeUser.removeReceivedFriendRequest(requestor);
        this.userRepository.saveAll(Arrays.asList(requestorUser, requesteeUser));
    }

    @Override
    @Async
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void addUserLikeNotification(RecipeLikedEvent event) {
        User user = this.userRepository.findById(event.getUserId()).orElseThrow(RuntimeException::new);
        user.addLikeNotification(event.getRecipeId(), event.getLikedBy(), event.getLikeId());
        this.userRepository.saveAndFlush(user);
    }

    @Override
    @Async
    @TransactionalEventListener(phase = TransactionPhase.BEFORE_COMMIT)
    public void addUserCommentNotification(RecipeCommentedOnEvent event) {
        User user = this.userRepository.findById(event.getUserId()).orElseThrow(RuntimeException::new);
        user.addCommentNotification(event.getRecipeId(), event.getCommentedBy(), event.getCommentId());
        this.userRepository.saveAndFlush(user);
    }

    @Override
    public void setNotificationOnSeen(UserId userId, NotificationId notificationId) {
        User user = this.userRepository.findById(userId).orElseThrow(RuntimeException::new);
        user.setNotificationOnSeen(notificationId);
        this.userRepository.saveAndFlush(user);
    }

}
