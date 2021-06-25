import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";

import RecipesPosts from "../RecipesPosts/recipesPosts";

import UserRepository from "../../repository/userRepository";
import RecipeRepository from "../../repository/recipeRepository";

const Recipes = (props) => {
    const [recipes, setRecipes] = useState([]);
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    const {userId} = useParams();

    const history = useHistory();

    useEffect(() => {
        if (props.loggedInUser && props.loggedInUser.userId === userId) {
            setRecipes(props.recipes)
            setFilteredRecipes(props.recipes);

            document.title = `${props.loggedInUser.firstName + " " + props.loggedInUser.lastName} - Рецепти`;
        } else {
            UserRepository.getUser(userId).then(promise1 => {
                const user = promise1.data;
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
                    setRecipes(userRecipes);
                    setFilteredRecipes(userRecipes);
                });

                document.title = `${user.firstName + " " + user.lastName} - Рецепти`;
            });
        }
    }, [props.loggedInUser, props.recipes, userId, history]);

    const filter = (e) => {
        const filterTerm = e.target.value;
        if (filterTerm) {
            const filteredRecipes = recipes.filter(r => r.name.includes(filterTerm));
            setFilteredRecipes(filteredRecipes);
        } else {
            setFilteredRecipes(recipes);
        }
    }

    const addNewRecipeButton = () => {
        if (props.loggedInUser && props.loggedInUser.userId === userId) {
            return (
                <div className="col-12 col-md-4 mb-4 mb-md-0">
                    <Link to="/recipe/create" className="btn btn-block btn-outline-dark">
                        ВНЕСЕТЕ НОВ РЕЦЕПТ
                    </Link>
                </div>
            );
        }
    }

    return (
        <section className="container">
            <div className="row mb-5">
                <div className="col-12 col-lg-9 mx-auto mt-4 mb-5">
                    <div className="row">
                        {addNewRecipeButton()}

                        <div className="col-12 col-md-4 ml-auto">
                            <input type="search" placeholder="Филтер" className="form-control" onChange={filter}/>
                        </div>
                    </div>

                    <hr/>

                    <RecipesPosts loggedInUser={props.loggedInUser}
                                  recipes={filteredRecipes}
                                  likeRecipe={props.likeRecipe}
                                  unlikeRecipe={props.unlikeRecipe}
                                  commentOnRecipe={props.commentOnRecipe}
                                  removeCommentFromRecipe={props.removeCommentFromRecipe} />
                </div>
            </div>
        </section>
    );
}

export default Recipes;
