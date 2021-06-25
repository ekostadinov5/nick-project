import React, {useState} from "react";

import Likes from "./Likes/likes";
import Comments from "./Comments/comments";

const LikesAndComments = (props) => {
    const [commentsArrowDown, setCommentsArrowDown] = useState(props.commentsCollapsed);

    return (
        <>
            <div id="likesAndComments" className="col-12 d-flex justify-content-between flex-wrap my-3">
                <Likes likes={props.likes} />

                <div className="mb-1">
                    <button className="btn p-0" data-toggle="collapse"
                            data-target={"#comments" + props.recipeId}
                            onClick={() => setCommentsArrowDown(!commentsArrowDown)}>
                        <i className="fa fa-comment mr-1"/>
                        <span className="mr-1">
                            {props.comments.length} коментари
                        </span>
                        <i className={`fa ${commentsArrowDown ? "fa-angle-down" : "fa-angle-up"}`}/>
                    </button>
                </div>
            </div>

            <Comments loggedInUser={props.loggedInUser}
                      recipeId={props.recipeId}
                      commentsCollapsed={props.commentsCollapsed}
                      comments={props.comments}
                      commentOnRecipe={props.commentOnRecipe}
                      removeCommentFromRecipe={props.removeCommentFromRecipe} />
        </>
    );
}

export default LikesAndComments;
