import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

import RecipesPosts from "../RecipesPosts/recipesPosts";

import RecipeRepository from "../../repository/recipeRepository";
import UserRepository from "../../repository/userRepository";

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
}

const AdvancedSearch = (props) => {
    const [ingredientsList, setIngredientsList] = useState(["", ""]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [result, setResult] = useState([]);

    const query = useQuery();
    const searchTerm = query.get("term");

    useEffect(() => {
        RecipeRepository.getAllCategories().then(promise => {
            const categories = promise.data;
            setCategoriesList(categories);
        });
    }, []);

    const search = () => {
        setResult([]);

        const searchTerm = document.getElementById("advancedSearchTerm").value;
        const categories = Array.from(document.getElementsByName("category"))
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        const ingredients = ingredientsList.filter(i => i.length > 0);
        const prepTimeFrom = document.getElementById("prepTimeFrom").value;
        const prepTimeTo = document.getElementById("prepTimeTo").value;
        const numServingsFrom = document.getElementById("numServingsFrom").value;
        const numServingsTo = document.getElementById("numServingsTo").value;
        RecipeRepository.searchRecipes(searchTerm, categories, ingredients, prepTimeFrom, prepTimeTo, numServingsFrom,
            numServingsTo).then(promise1 => {
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
                    scrollToSearchResults();
                });
            });
        });
    }

    const scrollToSearchResults = () => {
        let element = document.getElementById("searchResults");
        element.style.minHeight = "540px";
        window.scrollTo(0, element.offsetTop);
    }

    const categories = () => {

        const getCategories = () => {
            return categoriesList.map(c => {
                return (
                    <div key={c.id.id} className="col-12 col-sm-6 col-md-4 mb-2">
                        <input id={c.id.id} type="checkbox" name="category" value={c.name}/>
                        <label htmlFor={c.id.id} className="ml-1">{c.name}</label>
                    </div>
                );
            })
        }

        return (
            <div className="mb-4">
                <label className="font-weight-bold">
                    Категории
                </label>

                <div className="row">
                    {getCategories()}
                </div>
            </div>
        );
    }

    const ingredients = () => {

        const changeValue = (e, index) => {
            const newIngredientsList = [...ingredientsList];
            newIngredientsList[index] = e.target.value;
            setIngredientsList(newIngredientsList);
        }

        const mapIngredients = () => {
            return ingredientsList.map((ingredient, index) => {
                return (
                    <div key={index} className="col-12 col-sm-6">
                        <div className="d-inline-flex align-items-center w-100">
                            <span className="font-weight-bold">{index + 1}. </span>
                            <input type="text" className="form-control mb-2 ml-2" value={ingredient}
                                   onChange={e => changeValue(e, index)}/>
                        </div>
                    </div>
                );
            });
        }

        const addIngredient = () => {
            const newIngredientsList = [...ingredientsList, ""];
            setIngredientsList(newIngredientsList);
        }

        const removeIngredient = () => {
            if (ingredientsList.length > 1) {
                setIngredientsList(ingredientsList.slice(0, ingredientsList.length - 1));
            }
        }

        return (
            <div className="mb-4">
                <label htmlFor="ingredient0" className="font-weight-bold">
                    Состојки
                </label>
                <div id="ingredients" className="row">
                    {mapIngredients()}
                </div>
                <div className="text-right">
                    <button className="btn btn-outline-success rounded-circle mr-1" data-title-left="Додади состојка"
                            onClick={addIngredient}>
                        <i className="fa fa-plus"/>
                    </button>
                    <button className="btn btn-outline-danger rounded-circle" data-title-left="Отстрани состојка"
                            onClick={removeIngredient}>
                        <i className="fa fa-minus"/>
                    </button>
                </div>
            </div>
        );
    }

    const prepTimeAndNumServings = () => {

        return (
            <div className="row mb-4">
                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label htmlFor="prepTime" className="font-weight-bold d-block">
                            Време на приготовка
                        </label>
                        <div className="d-inline-flex align-items-center w-100">
                            <input id="prepTimeFrom" type="number" min="1" className="form-control mr-2"
                                   placeholder="Од"/>
                            <span className="mr-2">-</span>
                            <input id="prepTimeTo" type="number" min="1" className="form-control mr-2"
                                   placeholder="До"/>
                            <span>минути</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label htmlFor="numServings" className="font-weight-bold">
                            Број на порции
                        </label>
                        <div className="d-inline-flex align-items-center w-100">
                            <input id="numServingsFrom" type="number" min="1" className="form-control mr-2"
                                   placeholder="Од"/>
                            <span className="mr-2">-</span>
                            <input id="numServingsTo" type="number" min="1" className="form-control" placeholder="До"/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const searchOptions = () => {

        return (
            <div>
                <div className="input-group input-group-lg mx-auto mb-4">
                    <input id="advancedSearchTerm" className="form-control" type="search" placeholder="Пребарај"
                           defaultValue={searchTerm}/>
                    <div className="input-group-append">
                        <button className="btn btn-outline-dark" data-title-left="Пребарај" onClick={search}>
                            <i className="fa fa-search"/>
                        </button>
                    </div>
                </div>
                {categories()}
                {ingredients()}
                {prepTimeAndNumServings()}
            </div>
        );
    }

    return (
        <section className="container">
            <div className="row mb-5">
                <div className="col-12 col-lg-9 mx-auto my-5">
                    {searchOptions()}

                    <hr/>

                    <div id="searchResults" className="mt-5">
                        <RecipesPosts loggedInUser={props.loggedInUser}
                                      recipes={result}
                                      likeRecipe={props.likeRecipe}
                                      unlikeRecipe={props.unlikeRecipe}
                                      commentOnRecipe={props.commentOnRecipe}
                                      removeCommentFromRecipe={props.removeCommentFromRecipe}/>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AdvancedSearch;
