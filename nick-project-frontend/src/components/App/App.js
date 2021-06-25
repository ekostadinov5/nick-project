import "./App.css";

import React, {useEffect, useState} from "react";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import Cookies from "js-cookie";

import Header from "../Header/header";
import Home from "../Home/home";
import User from "../User/user";
import Recipes from "../Recipes/recipes";
import Friends from "../Friends/friends";
import CreateRecipe from "../Recipe/Create/createRecipe";
import Recipe from "../Recipe/recipe";
import EditRecipe from "../Recipe/Edit/editRecipe";
import Search from "../Search/search";
import AdvancedSearch from "../Search/advancedSearch";
import Login from "../Login/login";
import Register from "../Register/register";
import HelpButtons from "../HelpButtons/helpButtons";
import BackToTopButton from "../BackToTopButton/backToTopButton";

import UserRepository from "../../repository/userRepository";
import RecipeRepository from "../../repository/recipeRepository";

import LocalStorageService from "../../service/localStorageService";

const ELEMENTS_SIZE = ["small", "medium", "large", "larger"];
const AUTO_REFRESH_INTERVAL = 600000;

const App = () => {
    const [elementsSizeIndex, setElementsSizeIndex] = useState(1);

    const [homePageRecipes, setHomePageRecipes] = useState([]);

    const [loggedInUser, setLoggedInUser] = useState();
    const [loggedInUserRecipes, setLoggedInUserRecipes] = useState([]);
    const [loggedInUserFriends, setLoggedInUserFriends] = useState([]);

    const [renderRoutes, setRenderRoutes] = useState(false);

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        let elemSizeIdx = Cookies.get("elemSizeIdx");
        if (elemSizeIdx) {
            elemSizeIdx = parseInt(elemSizeIdx);
            setFontSize(ELEMENTS_SIZE[elemSizeIdx]);
            setElementsSizeIndex(elemSizeIdx);
        }

        if (LocalStorageService.getToken()) {
            loadLoggedInUser();
        } else {
            renderMostPopularRecipes();
            setRenderRoutes(true);
        }

        const interval = setInterval(() => setRefresh(!refresh), AUTO_REFRESH_INTERVAL);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [refresh]);

    const setFontSize = (fontSize) => {
        document.documentElement.style.fontSize = fontSize;
    }

    const increaseElementsSize = () => {
        if (elementsSizeIndex < 3) {
            setFontSize(ELEMENTS_SIZE[elementsSizeIndex + 1]);
            setElementsSizeIndex(elementsSizeIndex + 1);
            Cookies.set("elemSizeIdx", elementsSizeIndex + 1);
        }
    }

    const decreaseElementsSize = () => {
        if (elementsSizeIndex > 0) {
            setFontSize(ELEMENTS_SIZE[elementsSizeIndex - 1]);
            setElementsSizeIndex(elementsSizeIndex - 1);
            Cookies.set("elemSizeIdx", elementsSizeIndex - 1);
        }
    }

    const loadLoggedInUser = () => {
        UserRepository.getLoggedInUser(LocalStorageService.getIdentifier()).then(promise1 => {
            const user = promise1.data;
            setLoggedInUser(user);
            RecipeRepository.getRecipesList(user.recipeIds).then(promise2 => {
                const recipes = promise2.data;
                const userRecipes = recipes.map(r => {
                    return {
                        ...r,
                        userId: user.userId,
                        userFirstName: user.firstName,
                        userLastName: user.lastName
                    };
                });
                setLoggedInUserRecipes(userRecipes);
            });
            setLoggedInUserFriends(user.friends);
            setRenderRoutes(true);

            const friendsIds = user.friends.map(f => f.userId);
            renderFriendsRecipes(friendsIds);
        });
    }

    const unloadLoggedInUser = () => {
        setLoggedInUser(null);
        setLoggedInUserRecipes([]);
        setLoggedInUserFriends([]);
        renderMostPopularRecipes();
    }

    const renderFriendsRecipes = (friendsIds) => {
        RecipeRepository.getFriendsRecipes(friendsIds).then(promise1 => {
            setHomePageRecipes([]);
            promise1.data.forEach(r => {
                UserRepository.getUserInfo(r.userId).then(promise2 => {
                    const user = promise2.data;
                    const recipe = {
                        ...r,
                        userId: user.userId,
                        userFirstName: user.firstName,
                        userLastName: user.lastName
                    };
                    setHomePageRecipes(prevState => [...prevState, recipe]);
                });
            });
        });
    }

    const renderMostPopularRecipes = () => {
        RecipeRepository.getMostPopularRecipes().then(promise1 => {
            setHomePageRecipes([]);
            promise1.data.forEach(r => {
                UserRepository.getUserInfo(r.userId).then(promise2 => {
                    const user = promise2.data;
                    const recipe = {
                        ...r,
                        userId: user.userId,
                        userFirstName: user.firstName,
                        userLastName: user.lastName
                    };
                    setHomePageRecipes(prevState => [...prevState, recipe]);
                });
            });
        });
    }

    const changeUserInfo = (firstName, lastName, email, residence, dateOfBirth) => {
        const userId = loggedInUser.userId;
        return UserRepository.changeUserPersonalInfo(userId, firstName, lastName, email, residence, dateOfBirth)
            .then(promise => {
                const user = promise.data;
                setLoggedInUser(user);
            });
    }

    const changeUserProfilePicture = (image, onUploadProgress) => {
        const userId = loggedInUser.userId;
        return UserRepository.changeUserProfilePicture(userId, image, onUploadProgress).then(promise => {
            setLoggedInUser(prevState => {
                return {
                    ...prevState,
                    profilePictureFilename: promise.data
                }
            });
        });
    }

    const changeUserPassword = (oldPassword, newPassword, confirmNewPassword) => {
        const userId = loggedInUser.userId;
        return UserRepository.changeUserPassword(userId, oldPassword, newPassword, confirmNewPassword);
    }

    const createRecipe = (availability, name, description, prepTime, numServings, ingredients, prepSteps,
                          categories, images, onUploadProgress) => {
        const userId = loggedInUser.userId;
        return RecipeRepository.createRecipe(userId, availability, name, description, prepTime, numServings,
            ingredients, prepSteps, categories, images, onUploadProgress).then(promise => {
            const recipe = promise.data;
            setLoggedInUser({
                ...loggedInUser,
                recipeIds: [...loggedInUser.recipeIds, recipe.recipeId]
            });
            setLoggedInUserRecipes([...loggedInUserRecipes, recipe]);
        });
    }

    const editRecipe = (recipeId, availability, name, description, prepTime, numServings, ingredients, prepSteps,
                        categories, imageFiles, deleteOldImages, onUploadProgress) => {
        return RecipeRepository.updateRecipe(recipeId, availability, name, description, prepTime, numServings,
            ingredients, prepSteps, categories, imageFiles, deleteOldImages, onUploadProgress).then(promise => {
            const recipe = promise.data;
            setLoggedInUserRecipes(loggedInUserRecipes.map(r => {
                if (r.recipeId !== recipeId) {
                    return r;
                } else {
                    return recipe;
                }
            }));
        });
    }

    const deleteRecipe = (recipeId) => {
        RecipeRepository.deleteRecipe(recipeId).then(() => {
            setLoggedInUser({
                ...loggedInUser,
                recipeIds: loggedInUser.recipeIds.filter(rId => rId !== recipeId)
            });
            setLoggedInUserRecipes(loggedInUserRecipes.filter(r => r.recipeId !== recipeId));
        });
    }

    const likeRecipe = (recipeId, like) => {
        const newHomePageRecipes = homePageRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    likes: [...r.likes, like]
                }
            }
        });
        setHomePageRecipes(newHomePageRecipes);
        const newLoggedInUserRecipes = loggedInUserRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    likes: [...r.likes, like]
                }
            }
        });
        setLoggedInUserRecipes(newLoggedInUserRecipes);
    }

    const unlikeRecipe = (recipeId) => {
        const newHomePageRecipes = homePageRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    likes: r.likes.filter(l => l.userId.id !== loggedInUser.userId)
                }
            }
        });
        setHomePageRecipes(newHomePageRecipes);
        const newLoggedInUserRecipes = loggedInUserRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    likes: r.likes.filter(l => l.userId.id !== loggedInUser.userId)
                }
            }
        });
        setLoggedInUserRecipes(newLoggedInUserRecipes);
    }

    const commentOnRecipe = (recipeId, comment) => {
        const newHomePageRecipes = homePageRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    comments: [...r.comments, comment]
                }
            }
        });
        setHomePageRecipes(newHomePageRecipes);
        const newLoggedInUserRecipes = loggedInUserRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    comments: [...r.comments, comment]
                }
            }
        });
        setLoggedInUserRecipes(newLoggedInUserRecipes);
    }

    const removeCommentFromRecipe = (recipeId, commentId) => {
        const newHomePageRecipes = homePageRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    comments: r.comments.filter(c => c.id.id !== commentId)
                }
            }
        });
        setHomePageRecipes(newHomePageRecipes);
        const newLoggedInUserRecipes = loggedInUserRecipes.map(r => {
            if (r.recipeId !== recipeId) {
                return r;
            } else {
                return {
                    ...r,
                    comments: r.comments.filter(c => c.id.id !== commentId)
                }
            }
        });
        setLoggedInUserRecipes(newLoggedInUserRecipes);
    }

    const addFriend = (userId) => {
        const friendId = loggedInUser.userId;
        UserRepository.addFriend(userId, friendId).then(promise => {
            const friend = promise.data;
            setLoggedInUser({
                ...loggedInUser,
                friends: [...loggedInUser.friends, friend],
                receivedFriendRequests: loggedInUser.receivedFriendRequests.filter(fr => fr.requestor.id !== userId)
            });
            setLoggedInUserFriends([...loggedInUserFriends, friend]);
        });
    }

    const rejectFriend = (requestor) => {
        const requestee = loggedInUser.userId;
        UserRepository.removeFriendRequest(requestor, requestee).then(() => {
            setLoggedInUser({
                ...loggedInUser,
                receivedFriendRequests: loggedInUser.receivedFriendRequests.filter(fr => fr.requestor.id !== requestor)
            });
        });
    }

    const removeFriend = (friendId) => {
        const userId = loggedInUser.userId;
        UserRepository.removeFriend(userId, friendId).then(() => {
            setLoggedInUser({
                ...loggedInUser,
                friends: loggedInUser.friends.filter(f => f.userId !== friendId)
            });
        });
    }

    const sendFriendRequest = (requestee) => {
        const requestor = loggedInUser.userId;
        UserRepository.sendFriendRequest(requestor, requestee).then(promise => {
            const friendRequest = promise.data;
            setLoggedInUser({
                ...loggedInUser,
                sentFriendRequests: [...loggedInUser.sentFriendRequests, friendRequest]
            });
        });
    }

    const removeFriendRequest = (requestee) => {
        const requestor = loggedInUser.userId;
        UserRepository.removeFriendRequest(requestor, requestee).then(() => {
            setLoggedInUser({
                ...loggedInUser,
                sentFriendRequests: loggedInUser.sentFriendRequests.filter(fr => fr.requestee.id !== requestee)
            });
        });
    }

    const setNotificationOnSeen = (notificationId, type) => {
        const userId = loggedInUser.userId;
        UserRepository.setNotificationOnSeen(userId, notificationId).then(() => {
            if (type === "LIKE") {
                setLoggedInUser({
                    ...loggedInUser,
                    likeNotifications: loggedInUser.likeNotifications.filter(n => n.id.id !== notificationId)
                });
            } else {
                setLoggedInUser({
                    ...loggedInUser,
                    commentNotifications: loggedInUser.commentNotifications.filter(n => n.id.id !== notificationId)
                });
            }
        });
    }

    return renderRoutes ? (
        <>
            <Router>
                <Header loggedInUser={loggedInUser}
                        setNotificationOnSeen={setNotificationOnSeen}
                        unloadLoggedInUser={unloadLoggedInUser}/>
                <Switch>
                    <Route path="/" exact render={() =>
                        <Home loggedInUser={loggedInUser}
                              recipes={homePageRecipes}
                              likeRecipe={likeRecipe}
                              unlikeRecipe={unlikeRecipe}
                              commentOnRecipe={commentOnRecipe}
                              removeCommentFromRecipe={removeCommentFromRecipe}/>}/>
                    <Route path="/user/:userId" exact render={() =>
                        <User loggedInUser={loggedInUser}
                              changeUserInfo={changeUserInfo}
                              changeUserProfilePicture={changeUserProfilePicture}
                              changeUserPassword={changeUserPassword}
                              recipes={loggedInUserRecipes}
                              likeRecipe={likeRecipe}
                              unlikeRecipe={unlikeRecipe}
                              commentOnRecipe={commentOnRecipe}
                              removeCommentFromRecipe={removeCommentFromRecipe}
                              addFriend={addFriend}
                              rejectFriend={rejectFriend}
                              removeFriend={removeFriend}
                              sendFriendRequest={sendFriendRequest}
                              removeFriendRequest={removeFriendRequest}/>}/>
                    <Route path="/user/:userId/recipes" exact render={() =>
                        <Recipes loggedInUser={loggedInUser}
                                 recipes={loggedInUserRecipes}
                                 likeRecipe={likeRecipe}
                                 unlikeRecipe={unlikeRecipe}
                                 commentOnRecipe={commentOnRecipe}
                                 removeCommentFromRecipe={removeCommentFromRecipe}/>}/>
                    <Route path="/user/:userId/friends" exact render={() =>
                        <Friends loggedInUser={loggedInUser}
                                 friends={loggedInUserFriends}/>}/>
                    <Route path="/recipe/create" exact render={() =>
                        <CreateRecipe loggedInUser={loggedInUser}
                                      onRecipeCreated={createRecipe}/>}/>
                    <Route path="/recipe/:recipeId" exact render={() =>
                        <Recipe loggedInUser={loggedInUser}
                                deleteRecipe={deleteRecipe}
                                likeRecipe={likeRecipe}
                                unlikeRecipe={unlikeRecipe}
                                commentOnRecipe={commentOnRecipe}
                                removeCommentFromRecipe={removeCommentFromRecipe}/>}/>
                    <Route path="/recipe/:recipeId/edit" exact render={() =>
                        <EditRecipe loggedInUser={loggedInUser}
                                    editRecipe={editRecipe}/>}/>
                    <Route path="/search" exact render={() =>
                        <Search loggedInUser={loggedInUser}
                                likeRecipe={likeRecipe}
                                unlikeRecipe={unlikeRecipe}
                                commentOnRecipe={commentOnRecipe}
                                removeCommentFromRecipe={removeCommentFromRecipe}/>}/>
                    <Route path="/search/advanced" exact render={() =>
                        <AdvancedSearch loggedInUser={loggedInUser}
                                        likeRecipe={likeRecipe}
                                        unlikeRecipe={unlikeRecipe}
                                        commentOnRecipe={commentOnRecipe}
                                        removeCommentFromRecipe={removeCommentFromRecipe}/>}/>
                    <Route path="/login" exact render={() => <Login loadLoggedInUser={loadLoggedInUser}/>}/>
                    <Route path="/register" exact render={() => <Register loadLoggedInUser={loadLoggedInUser}/>}/>
                </Switch>
                <HelpButtons increaseElementsSize={increaseElementsSize}
                             decreaseElementsSize={decreaseElementsSize}/>
                <BackToTopButton/>
            </Router>
        </>
    ) : null;
}

export default App;
