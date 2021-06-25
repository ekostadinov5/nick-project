import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

import LikesAndComments from "../../LikesAndComments/likesAndComments";

import RecipeRepository from "../../../repository/recipeRepository";

import defaultRecipeImage from "../../../assets/img/default_recipe_image.png";

const Post = (props) => {
    const [recipe, setRecipe] = useState();
    const [image, setImage] = useState();

    const history = useHistory();

    useEffect(() => {
        setRecipe(props.recipe);
        if (props.recipe.imageFiles.length > 0) {
            RecipeRepository.getOneRecipeImage(props.recipe.imageFiles[0].filename).then(promise => {
                const image = promise.data;
                setImage(image);
            });
        }
    }, [props.recipe]);

    const getFormattedDate = (date) => {
        const getMonth = (date) => {
            const months = [
                "Јануари",
                "Февруари",
                "Март",
                "Април",
                "Мај",
                "Јуни",
                "Јули",
                "Август",
                "Септември",
                "Октомври",
                "Ноември",
                "Декември"
            ]
            const index = date.getMonth();
            return months[index];
        }

        date = new Date(date);
        const day = date.getDate();
        const month = getMonth(date);
        const year = date.getFullYear();
        return day + " " + month + " " + year;
    }

    const listCategories = () => {
        return recipe.categories.map((c, index) => {
            return (
                <span key={index} className="d-inline-block rounded-pill border border-dark small px-2 py-1 mr-2 mb-2">
                    {c.name}
                </span>
            );
        });
    }

    const isLiked = () => {
        const likedByIds = recipe.likes.map(l => l.userId.id);
        return props.loggedInUser && likedByIds.includes(props.loggedInUser.userId);
    }

    const focusCommentTextarea = () => {
        if (props.loggedInUser) {
            let comments = document.getElementById("comments" + recipe.recipeId);
            comments.classList.add("show");
            let commentTextarea = document.getElementById("commentTextarea" + recipe.recipeId);
            commentTextarea.focus();
        } else {
            history.push("/login");
        }
    }

    const likeRecipe = () => {
        if (props.loggedInUser) {
            RecipeRepository.likeRecipe(recipe.recipeId, props.loggedInUser.userId).then(promise => {
                const like = promise.data;
                setRecipe({
                    ...recipe,
                    likes: [...recipe.likes, like]
                });
                props.likeRecipe(recipe.recipeId, like);
            });
        } else {
            history.push("/login");
        }
    }

    const unlikeRecipe = () => {
        RecipeRepository.unlikeRecipe(recipe.recipeId, props.loggedInUser.userId).then(() => {
            setRecipe({
                ...recipe,
                likes: recipe.likes.filter(l => l.userId.id !== props.loggedInUser.userId)
            });
            props.unlikeRecipe(recipe.recipeId);
        });
    }

    const likeButton = () => {
        if (!isLiked()) {
            return (
                <button className="btn btn-success mr-1" data-title-right="Пофали" onClick={likeRecipe}>
                    <i className="fa fa-thumbs-up"/>
                </button>
            );
        } else {
            return (
                <button className="btn btn-danger mr-1" data-title-right="Отстрани пофалба" onClick={unlikeRecipe}>
                    <i className="fa fa-thumbs-down"/>
                </button>
            );
        }
    }

    return recipe ? (
        <div className="row mx-0 mb-5 border rounded">
            <div className="col-12 col-md-5 col-xl-4 p-0">
                <Link to={`/recipe/${recipe.recipeId}`}>
                    <img src={image ? `data:image/*;base64,${image}` : defaultRecipeImage} alt="Слика од рецептот"
                         className="image-fitted" style={{"maxHeight": "270px"}}/>
                </Link>
            </div>
            <div className="col-12 col-md-7 col-xl-8 py-2 bg-light d-flex flex-wrap">
                <div>
                    <div className="mb-3">
                        <h4 className="mb-1">
                            <Link to={`/recipe/${recipe.recipeId}`} className="text-dark text-decoration-none">
                                {recipe.name}
                            </Link>
                        </h4>
                        <h6 className="mb-2">
                            <Link to={`/user/${recipe.userId}`} className="text-decoration-none">
                                {recipe.userFirstName} {recipe.userLastName}
                            </Link>
                        </h6>
                        <small className="text-muted font-italic">
                            {getFormattedDate(recipe.postedOn)}
                        </small>
                    </div>
                    <div>
                        <div className="mb-2">
                            {listCategories()}
                        </div>
                        <p>
                            {recipe.description}
                        </p>
                    </div>
                </div>
                <div className="text-right mt-auto w-100">
                    {likeButton()}
                    <button className="btn btn-secondary mr-1" data-title-right="Остави коментар"
                            onClick={focusCommentTextarea}>
                        <i className="fa fa-comment"/>
                    </button>
                    <Link to={`/recipe/${recipe.recipeId}`} className="btn btn-outline-dark">
                        Повеќе
                    </Link>
                </div>
            </div>

            <LikesAndComments loggedInUser={props.loggedInUser}
                              recipeId={recipe.recipeId}
                              commentsCollapsed={true}
                              likes={recipe.likes}
                              comments={recipe.comments}
                              commentOnRecipe={props.commentOnRecipe}
                              removeCommentFromRecipe={props.removeCommentFromRecipe}/>
        </div>
    ) : null;
}

export default Post;
