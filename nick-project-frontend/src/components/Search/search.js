import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import RecipesPosts from "../RecipesPosts/recipesPosts";

import RecipeRepository from "../../repository/recipeRepository";
import UserRepository from "../../repository/userRepository";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const Search = (props) => {
    const [result, setResult] = useState([]);

    const query = useQuery();
    const searchTerm = query.get("term");
    const category = query.get("category");

    useEffect(() => {
        document.title = "Резултати од пребарување";

        setResult([]);

        RecipeRepository.searchRecipes(searchTerm ? searchTerm : "", category ? [category] : [],
            [], "", "", "", "").then(promise1 => {
            promise1.data.forEach(r => {
                UserRepository.getUserInfo(r.userId).then(promise2 => {
                    const user = promise2.data;
                    const recipe = {
                        ...r,
                        userId: user.userId,
                        userFirstName: user.firstName,
                        userLastName: user.lastName
                    };
                    setResult(prevState => [...prevState, recipe]);
                });
            });
        });
    }, [searchTerm, category]);

    return (
        <section className="container">
            <div className="row mb-5">
                <div className="col-12 col-lg-9 mx-auto my-5">
                    <RecipesPosts loggedInUser={props.loggedInUser}
                                  recipes={result}
                                  likeRecipe={props.likeRecipe}
                                  unlikeRecipe={props.unlikeRecipe}
                                  commentOnRecipe={props.commentOnRecipe}
                                  removeCommentFromRecipe={props.removeCommentFromRecipe}/>
                </div>
            </div>
        </section>
    );
}

export default Search;
