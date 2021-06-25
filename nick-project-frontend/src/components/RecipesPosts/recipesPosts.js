import React from "react";

import Post from "./Post/post";

const RecipesPosts = (props) => {

    const mapRecipes = () => {
        if (props.recipes) {
            return props.recipes
                .sort((r1, r2) => new Date(r2.postedOn) - new Date(r1.postedOn))
                .map(r =>
                    <Post key={r.recipeId}
                          loggedInUser={props.loggedInUser}
                          recipe={r}
                          likeRecipe={props.likeRecipe}
                          unlikeRecipe={props.unlikeRecipe}
                          commentOnRecipe={props.commentOnRecipe}
                          removeCommentFromRecipe={props.removeCommentFromRecipe} />
                    );
        }
    }

    const noRecipes = () => {
        if (props.recipes && props.recipes.length === 0) {
            return (
                <div className="mt-5 text-center text-muted font-weight-bold">
                    Нема рецепти
                </div>
            );
        }
    }

    return (
        <>
            {noRecipes()}
            {mapRecipes()}
        </>
    );
}

export default RecipesPosts;
