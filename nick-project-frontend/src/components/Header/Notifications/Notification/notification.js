import React, {useEffect, useState} from "react";
import {HashLink} from "react-router-hash-link";

import UserRepository from "../../../../repository/userRepository";
import RecipeRepository from "../../../../repository/recipeRepository";

const Notification = (props) => {
    const [user, setUser] = useState();
    const [recipe, setRecipe] = useState();

    useEffect(() => {
        UserRepository.getUserInfo(props.notification.userId).then(promise => {
            setUser(promise.data);
        });
        if (props.notification.type !== "FRIEND_REQUEST") {
            RecipeRepository.getRecipe(props.notification.recipeId).then(promise => {
                setRecipe(promise.data);
            });
        }
    }, [props.notification]);

    const setNotificationOnSeen = () => {
        props.setNotificationOnSeen(props.notification.id, props.notification.type);
    }

    if (props.notification.type === "FRIEND_REQUEST") {
        return user ? (
            <HashLink to={`/user/${user.userId}`} className="dropdown-item bg-light text-wrap">
                <span className="font-weight-bolder mr-1">
                    {user.firstName} {user.lastName}
                </span>
                ви испрати барање за пријател.
            </HashLink>
        ) : null;
    } else if (props.notification.type === "LIKE") {
        return user && recipe ? (
            <HashLink to={`/recipe/${recipe.recipeId}#likesAndComments`} className="dropdown-item text-wrap"
                      onClick={setNotificationOnSeen}>
                <span className="font-weight-bolder mr-1">
                    {user.firstName} {user.lastName}
                </span>
                го пофали вашиот рецепт
                <span className="font-weight-bolder ml-1">
                    {recipe.name}
                </span>
                .
            </HashLink>
        ) : null;
    } else {
        return user && recipe ? (
            <>
                <HashLink to={`/recipe/${recipe.recipeId}#${props.notification.commentId}`}
                          className="dropdown-item text-wrap" onClick={setNotificationOnSeen}>
                <span className="font-weight-bolder mr-1">
                    {user.firstName} {user.lastName}
                </span>
                    остави коментар на вашиот рецепт
                    <span className="font-weight-bolder ml-1">
                    {recipe.name}
                </span>
                    .
                </HashLink>
                <div className="dropdown-divider" />
            </>
        ) : null;
    }
}

export default Notification;
