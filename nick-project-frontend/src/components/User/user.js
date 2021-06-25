import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";

import UserInfo from "./UserInfo/userInfo";
import RecipesPosts from "../RecipesPosts/recipesPosts";

import UserRepository from "../../repository/userRepository";
import RecipeRepository from "../../repository/recipeRepository";

const User = (props) => {
    const [user, setUser] = useState();
    const [userRecipes, setUserRecipes] = useState([]);

    const {userId} = useParams();

    const history = useHistory();

    useEffect(() => {
        if (props.loggedInUser && props.loggedInUser.userId === userId) {
            setUser(props.loggedInUser);
            setUserRecipes(props.recipes);

            document.title = props.loggedInUser.firstName + " " + props.loggedInUser.lastName;
        } else {
            UserRepository.getUser(userId).then(promise1 => {
                const user = promise1.data;
                setUser(user);
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
                    setUserRecipes(userRecipes);
                });

                document.title = user.firstName + " " + user.lastName;
            });
        }
    }, [props.loggedInUser, props.recipes, userId, history]);

    const hasReceivedFriendRequest = () => {
        return props.loggedInUser
            && props.loggedInUser.receivedFriendRequests.map(fr => fr.requestor.id).includes(userId);
    }

    const hasSentFriendRequest = () => {
        return props.loggedInUser && props.loggedInUser.sentFriendRequests.map(fr => fr.requestee.id).includes(userId);
    }

    const isFriend = () => {
        return props.loggedInUser && props.loggedInUser.friends.map(f => f.userId).includes(userId);
    }

    const addNewRecipeButton = () => {
        if (props.loggedInUser && props.loggedInUser.userId === userId) {
            return (
                <div className="text-center mt-4 mb-5">
                    <Link to="/recipe/create" className="btn btn-lg btn-outline-dark">
                        ВНЕСЕТЕ НОВ РЕЦЕПТ
                    </Link>
                </div>
            );
        }
    }

    return user ? (
        <section className="container">
            <div className="row">
                <div className="col-12 col-lg-3 pr-lg-0 border-right-lg">
                    <UserInfo user={user}
                              loggedInUser={props.loggedInUser}
                              userInfoOptions={props.loggedInUser && props.loggedInUser.userId === userId}
                              changeUserInfo={props.changeUserInfo}
                              changeUserProfilePicture={props.changeUserProfilePicture}
                              changeUserPassword={props.changeUserPassword}
                              hasReceivedFriendRequest={hasReceivedFriendRequest()}
                              hasSentFriendRequest={hasSentFriendRequest()}
                              isFriend={isFriend()}
                              addFriend={props.addFriend}
                              rejectFriend={props.rejectFriend}
                              removeFriend={props.removeFriend}
                              sendFriendRequest={props.sendFriendRequest}
                              removeFriendRequest={props.removeFriendRequest} />
                </div>
                <div className="col-12 col-lg-9 my-4 pl-lg-5 mb-5 ml-auto min-vh-100">
                    {addNewRecipeButton()}

                    <RecipesPosts loggedInUser={props.loggedInUser}
                                  recipes={userRecipes}
                                  likeRecipe={props.likeRecipe}
                                  unlikeRecipe={props.unlikeRecipe}
                                  commentOnRecipe={props.commentOnRecipe}
                                  removeCommentFromRecipe={props.removeCommentFromRecipe} />
                </div>
            </div>
        </section>
    ) : null;
}

export default User;
