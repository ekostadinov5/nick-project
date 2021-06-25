import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import Comment from "./Comment/comment";

import RecipeRepository from "../../../repository/recipeRepository";
import UserRepository from "../../../repository/userRepository";

import defaultProfilePicture from "../../../assets/img/default_profile_picture.png";

const Comments = (props) => {
    const [comments, setComments] = useState([]);
    const [profilePicture, setProfilePicture] = useState();

    useEffect(() => {
        setComments(props.comments);

        if (props.loggedInUser && props.loggedInUser.profilePictureFilename) {
            UserRepository.getUserProfilePicture(props.loggedInUser.userId).then(promise => {
                setProfilePicture(promise.data);
            });
        } else {
            setProfilePicture(null);
        }
    }, [props.comments, props.loggedInUser]);

    const mapComments = () => {
        return comments.map(c =>
            <Comment loggedInUserId={props.loggedInUser ? props.loggedInUser.userId : null}
                     key={c.id.id}
                     recipeId={props.recipeId}
                     comment={c}
                     removeCommentFromRecipe={removeCommentFromRecipe} />);
    }

    const commentOnRecipe = () => {
        const textarea = document.getElementById("commentTextarea" + props.recipeId);
        const text = textarea.value;
        if (text) {
            RecipeRepository.commentOnRecipe(props.recipeId, props.loggedInUser.userId, text).then(promise => {
                const comment = promise.data;
                setComments([...comments, comment]);
                props.commentOnRecipe(props.recipeId, comment);
            });
            textarea.value = "";
        }
    }

    const removeCommentFromRecipe = (recipeId, commentId) => {
        RecipeRepository.removeCommentFromRecipe(recipeId, commentId).then(() => {
            setComments(comments.filter(c => c.id.id !== commentId));
            props.removeCommentFromRecipe(recipeId, commentId);
        });
    }

    const commentTextarea = () => {
        if (props.loggedInUser) {
            return (
                <div className="my-2 d-flex">
                    <Link to={`/user/${props.loggedInUser.userId}`}>
                        <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                             alt="Профилна слика на корисникот"
                             className="rounded-circle mr-1" width="50" height="50"/>
                    </Link>
                    <div className="w-100 px-3 py-2 rounded bg-light">
                        <h6 className="mb-1">
                            <Link to={`/user/${props.loggedInUser.userId}`} className="text-decoration-none">
                                {props.loggedInUser.firstName} {props.loggedInUser.lastName}
                            </Link>
                        </h6>
                        <textarea id={"commentTextarea" + props.recipeId} className="form-control my-1" rows="3"
                                  placeholder="Остави коментар"/>
                        <div className="text-right">
                            <button className="btn btn-success" onClick={commentOnRecipe}>
                                Зачувај
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
    }

    return (
        <div id={"comments" + props.recipeId}
             className={`col-12 my-2 pl-4 collapse${props.commentsCollapsed ? "" : " show"}`}>
            {mapComments()}

            {commentTextarea()}
        </div>
    );
}

export default Comments;
