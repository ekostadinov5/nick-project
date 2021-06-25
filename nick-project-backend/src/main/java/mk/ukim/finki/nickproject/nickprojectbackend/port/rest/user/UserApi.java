package mk.ukim.finki.nickproject.nickprojectbackend.port.rest.user;

import mk.ukim.finki.nickproject.nickprojectbackend.application.service.user.UserService;
import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.*;
import mk.ukim.finki.nickproject.nickprojectbackend.port.dto.user.LoggedInUserDto;
import mk.ukim.finki.nickproject.nickprojectbackend.port.dto.user.UserDto;
import mk.ukim.finki.nickproject.nickprojectbackend.port.dto.user.UserInfoDto;
import mk.ukim.finki.nickproject.nickprojectbackend.port.form.user.UserForm;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "/api/users", produces = MimeTypeUtils.APPLICATION_JSON_VALUE)
public class UserApi {
    private final UserService userService;

    public UserApi(UserService userService) {
        this.userService = userService;
    }

    @GetMapping(path = "/search")
    public List<UserInfoDto> searchUsers(@RequestParam String searchTerm) {
        return this.userService.searchUsers(searchTerm).stream()
                .map(UserInfoDto::new)
                .collect(Collectors.toList());
    }

    @GetMapping(path = "/{userId}")
    public UserDto getUser(@PathVariable UserId userId) {
        User user = this.userService.getUser(userId);
        return new UserDto(user);
    }

    @GetMapping(path = "/info/{userId}")
    public UserInfoDto getUserInfo(@PathVariable UserId userId) {
        User user = this.userService.getUser(userId);
        return new UserInfoDto(user);
    }

    @GetMapping(path = "/loggedIn/{email}")
    public LoggedInUserDto getLoggedInUser(@PathVariable Email email) {
        User user = this.userService.getUserByEmail(email);
        return new LoggedInUserDto(user);
    }

    @GetMapping(path = "/profilePicture/{userId}")
    public byte[] getUserProfilePicture(@PathVariable UserId userId) {
        return this.userService.getUserProfilePicture(userId);
    }

    @PostMapping(path = "/register")
    public LoggedInUserDto registerUser(@RequestBody UserForm form) {
        User user = this.userService.createUser(new FullName(form.getFirstName(), form.getLastName()),
                new Email(form.getEmail()), new Password(form.getPassword()), new Password(form.getConfirmPassword()),
                form.getResidence(), form.getDateOfBirth());
        return new LoggedInUserDto(user);
    }

    @PatchMapping(path = "/info/{userId}")
    public LoggedInUserDto changeUserPersonalInfo(@PathVariable UserId userId,
                                                  @RequestParam Email email,
                                                  @RequestParam String firstName,
                                                  @RequestParam String lastName,
                                                  @RequestParam String residence,
                                                  @RequestParam String dateOfBirth) {
        User user = this.userService.changeUserPersonalInfo(userId, email, new FullName(firstName, lastName), residence,
                LocalDate.parse(dateOfBirth));
        return new LoggedInUserDto(user);
    }

    @PatchMapping(path = "/profilePicture/{userId}")
    public String changeUserProfilePicture(@PathVariable UserId userId,
                                           @RequestParam MultipartFile imageFile) {
        return this.userService.changeUserProfilePicture(userId, imageFile);
    }

    @PatchMapping(path = "/password/{userId}")
    public void changeUserPassword(@PathVariable UserId userId,
                                   @RequestParam Password oldPassword,
                                   @RequestParam Password newPassword,
                                   @RequestParam Password confirmNewPassword) {
        this.userService.changeUserPassword(userId, oldPassword, newPassword, confirmNewPassword);
    }

    @PostMapping(path = "/friend/{userId}/{friendId}")
    public UserInfoDto addFriend(@PathVariable UserId userId,
                                 @PathVariable UserId friendId) {
        User user = this.userService.addFriend(userId, friendId);
        return new UserInfoDto(user);
    }

    @DeleteMapping(path = "/friend/{userId}/{friendId}")
    public void removeFriend(@PathVariable UserId userId,
                             @PathVariable UserId friendId) {
        this.userService.removeFriend(userId, friendId);
    }

    @PostMapping(path = "/friendRequest/{requestor}/{requestee}")
    public FriendRequest sendFriendRequest(@PathVariable UserId requestor,
                                           @PathVariable UserId requestee) {
        return this.userService.sendFriendRequest(requestor, requestee);
    }

    @DeleteMapping(path = "/friendRequest/{requestor}/{requestee}")
    public void removeFriendRequest(@PathVariable UserId requestor,
                                    @PathVariable UserId requestee) {
        this.userService.removeFriendRequest(requestor, requestee);
    }

    @PostMapping(path = "/notification/{userId}")
    public void setNotificationOnSeen(@PathVariable UserId userId,
                                      @RequestParam NotificationId notificationId) {
        this.userService.setNotificationOnSeen(userId, notificationId);
    }

}
