import axios from "../custom-axios/axios";
import qs from "qs";

const UserRepository = {
    searchUsers: (searchTerm) => {
        return axios.get(`/api/users/search?searchTerm=${searchTerm}`)
    },
    getUser: (userId) => {
        return axios.get(`/api/users/${userId}`);
    },
    getUserInfo: (userId) => {
        return axios.get(`/api/users/info/${userId}`);
    },
    getLoggedInUser: (email) => {
        return axios.get(`/api/users/loggedIn/${email}`);
    },
    getUserProfilePicture: (userId) => {
        return axios.get(`/api/users/profilePicture/${userId}`);
    },
    login: (email, password) => {
        const user = {
            username: email,
            password: password
        };
        return axios.post("/login", user, {
            headers: {
                'Content-Type': 'application/json',
            }
        });
    },
    register: (firstName, lastName, email, password, confirmPassword, residence, dateOfBirth) => {
        const data = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            confirmPassword: confirmPassword,
            residence: residence,
            dateOfBirth: dateOfBirth
        };
        return axios.post("/api/users/register", data);
    },
    changeUserPersonalInfo: (userId, firstName, lastName, email, residence, dateOfBirth) => {
        const data = qs.stringify({
            firstName: firstName,
            lastName: lastName,
            email: email,
            residence: residence,
            dateOfBirth: dateOfBirth
        });
        return axios.patch(`/api/users/info/${userId}`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    },
    changeUserProfilePicture: (userId, imageFile, onUploadProgress) => {
        let formData = new FormData();
        formData.append("imageFile", imageFile);
        return axios.patch(`/api/users/profilePicture/${userId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
            onUploadProgress: onUploadProgress
        });
    },
    changeUserPassword: (userId, oldPassword, newPassword, confirmNewPassword) => {
        const data = qs.stringify({
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmNewPassword: confirmNewPassword
        });
        return axios.patch(`/api/users/password/${userId}`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })
    },
    addFriend: (userId, friendId) => {
        return axios.post(`/api/users/friend/${userId}/${friendId}`);
    },
    removeFriend: (userId, friendId) => {
        return axios.delete(`/api/users/friend/${userId}/${friendId}`);
    },
    sendFriendRequest: (requestor, requestee) => {
        return axios.post(`/api/users/friendRequest/${requestor}/${requestee}`);
    },
    removeFriendRequest: (requestor, requestee) => {
        return axios.delete(`/api/users/friendRequest/${requestor}/${requestee}`);
    },
    setNotificationOnSeen: (userId, notificationId) => {
        const data = qs.stringify({
            notificationId: notificationId
        });
        return axios.post(`/api/users/notification/${userId}`, data, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        });
    }
}

export default UserRepository;
