import React, {useEffect} from "react";
import {Link, useHistory} from "react-router-dom";

import Categories from "../Categories/categories";
import RecipesPosts from "../RecipesPosts/recipesPosts";

const Home = (props) => {
    const history = useHistory();

    useEffect(() => {
        document.title = "Почетна";
    }, []);

    const goToLoginPage = () => {
        history.push("/login");
    }

    const addNewRecipeButton = () => {
        if (props.loggedInUser) {
            return (
                <div className="text-center mt-4 mb-5">
                    <Link to="/recipe/create" className="btn btn-lg btn-outline-dark">
                        ВНЕСЕТЕ НОВ РЕЦЕПТ
                    </Link>
                </div>
            );
        } else {
            return (
                <div className="text-center mt-4 mb-5">
                    <button className="btn btn-lg btn-outline-dark" onClick={goToLoginPage}>
                        ВНЕСЕТЕ НОВ РЕЦЕПТ
                    </button>
                </div>
            );
        }
    }

    const addFriendsButton = () => {
        if (props.loggedInUser && props.recipes.length === 0) {
            return (
                <div className="mt-5 text-center">
                    <Link to={`user/${props.loggedInUser.userId}/friends`} className="btn btn-outline-dark mb-2 mr-1">
                        Додадете пријатели
                    </Link>
                    <span className="d-inline-block lead">
                        за да откриете нови рецепти!
                    </span>
                </div>
            );
        }
    }

    return (
        <section className="container">
            <div className="row">
                <div className="col-12 col-lg-3 pr-lg-0 border-right-lg">
                    <Categories/>
                </div>
                <div className="col-12 col-lg-9 mt-4 mb-5 ml-auto pl-lg-5 min-vh-100">
                    {addNewRecipeButton()}

                    <RecipesPosts loggedInUser={props.loggedInUser}
                                  recipes={props.recipes}
                                  likeRecipe={props.likeRecipe}
                                  unlikeRecipe={props.unlikeRecipe}
                                  commentOnRecipe={props.commentOnRecipe}
                                  removeCommentFromRecipe={props.removeCommentFromRecipe} />

                    {addFriendsButton()}
                </div>
            </div>
        </section>
    );
}

export default Home;
