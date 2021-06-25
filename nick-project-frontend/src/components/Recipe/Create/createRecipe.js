import React, {useEffect, useState} from "react";
import {useHistory, Prompt} from "react-router-dom";

import imageCompression from 'browser-image-compression';

import RecipeRepository from "../../../repository/recipeRepository";
import {Modal} from "react-bootstrap";

const CreateRecipe = (props) => {
    const [ingredientsList, setIngredientsList] = useState(["", "", "", "", "", ""]);
    const [prepStepsList, setPrepStepsList] = useState(["", "", "", "", "", "", ""]);
    const [categoriesList, setCategoriesList] = useState([]);
    const [images, setImages] = useState([]);
    const [recipeValidation, setRecipeValidation] = useState({});
    const [uploadStarted, setUploadStarted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [changeMade, setChangeMade] = useState(false);
    const [confirmLeaving, setConfirmLeaving] = useState(false);
    const [nextLocation, setNextLocation] = useState("/");
    const [showReminderModal, setShowReminderModal] = useState(false);

    const history = useHistory();

    useEffect(() => {
        document.title = "Додади рецепт";

        if (confirmLeaving) {
            history.push(nextLocation);
        } else if (!props.loggedInUser) {
            // history.replace("/");
        } else {
            RecipeRepository.getAllCategories().then(promise => {
                const categories = promise.data;
                setCategoriesList(categories);
            });
        }
    }, [props.loggedInUser, history, confirmLeaving, nextLocation]);

    const handleShowReminderModal = () => setShowReminderModal(true);
    const handleCloseReminderModal = () => setShowReminderModal(false);

    const createRecipe = (e) => {
        e.preventDefault();
        const availability = document.getElementById("availability").value;
        const name = document.getElementById("name").value;
        const description = document.getElementById("description").value;
        const prepTime = document.getElementById("prepTime").value;
        const numServings = document.getElementById("numServings").value;
        const ingredients = ingredientsList.filter(i => i.length > 0);
        const prepSteps = prepStepsList.filter(ps => ps.length > 0);
        const categories = Array.from(document.getElementsByName("category"))
            .filter(checkbox => checkbox.checked)
            .map(checkbox => checkbox.value);
        if (!validate(name, description, prepTime, numServings, ingredients, prepSteps, categories)) {
            window.scrollTo(0, 0);
            return;
        }
        setNextLocation(`/user/${props.loggedInUser.userId}/recipes`);
        setUploadStarted(true);
        props.onRecipeCreated(availability, name, description, prepTime, numServings, ingredients, prepSteps,
            categories, images, onUploadProgress).finally(() => {
            setConfirmLeaving(true);
        });
    }

    const validate = (name, description, prepTime, numServings, ingredients, prepSteps, categories) => {
        const validationObject = {}
        if (!name) {
            validationObject.name = true;
        }
        if (!description) {
            validationObject.description = true;
        }
        if (!prepTime) {
            validationObject.prepTime = true;
        }
        if (!numServings) {
            validationObject.numServings = true;
        }
        if (ingredients.length === 0) {
            validationObject.ingredients = true;
        }
        if (prepSteps.length === 0) {
            validationObject.prepSteps = true;
        }
        if (categories.length === 0) {
            validationObject.categories = true;
        }
        setRecipeValidation(validationObject);
        return Object.keys(validationObject).length === 0;
    }

    const recipeName = () => {

        return (
            <div className="form-group">
                <label htmlFor="name" className="font-weight-bold">
                    Име на рецептот
                </label>
                <span className="text-danger font-weight-bolder ml-2"
                      style={{visibility: recipeValidation.name ? "visible" : "hidden"}}>
                    *
                </span>
                <input id="name" type="text" className="form-control" onChange={() => setChangeMade(true)}/>
            </div>
        );
    }

    const description = () => {

        return (
            <div className="form-group">
                <label htmlFor="description" className="font-weight-bold">
                    Краток опис
                </label>
                <span className="text-danger font-weight-bolder ml-2"
                      style={{visibility: recipeValidation.description ? "visible" : "hidden"}}>
                    *
                </span>
                <textarea id="description" className="form-control" rows="7" maxLength="300"
                          onChange={() => setChangeMade(true)}/>
            </div>
        );
    }

    const prepTimeAndNumServings = () => {

        return (
            <div className="row mb-4">
                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label htmlFor="prepTime" className="font-weight-bold">
                            Време на приготовка
                        </label>
                        <span className="text-danger font-weight-bolder ml-2"
                              style={{visibility: recipeValidation.prepTime ? "visible" : "hidden"}}>
                            *
                        </span>
                        <div className="d-inline-flex align-items-center w-100">
                            <input id="prepTime" type="number" min="1" className="form-control mr-2"
                                   onChange={() => setChangeMade(true)}/>
                            <span>минути</span>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-sm-6">
                    <div className="form-group">
                        <label htmlFor="numServings" className="font-weight-bold">
                            Број на порции
                        </label>
                        <span className="text-danger font-weight-bolder ml-2"
                              style={{visibility: recipeValidation.numServings ? "visible" : "hidden"}}>
                            *
                        </span>
                        <input id="numServings" type="number" min="1" className="form-control"
                               onChange={() => setChangeMade(true)}/>
                    </div>
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
                                   onChange={e => {
                                       changeValue(e, index);
                                       setChangeMade(true);
                                   }}/>
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
            <div className="form-group">
                <label htmlFor="ingredient0" className="font-weight-bold">
                    Состојки
                </label>
                <span className="text-danger font-weight-bolder ml-2"
                      style={{visibility: recipeValidation.ingredients ? "visible" : "hidden"}}>
                    *
                </span>
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

    const prepSteps = () => {

        const changeValue = (e, index) => {
            const newPrepStepsList = [...prepStepsList];
            newPrepStepsList[index] = e.target.value;
            setPrepStepsList(newPrepStepsList);
        }

        const mapPrepSteps = () => {
            return prepStepsList.map((prepStep, index) => {
                return (
                    <div key={index} className="col-12">
                        <div className="d-inline-flex align-items-center w-100">
                            <span className="font-weight-bold">{index + 1}.</span>
                            <input type="text" className="form-control mb-2 ml-2" value={prepStep} maxLength="255"
                                   onChange={e => {
                                       changeValue(e, index);
                                       setChangeMade(true);
                                   }}/>
                        </div>
                    </div>
                );
            });
        }

        const addPrepStep = () => {
            const newPrepStepsList = [...prepStepsList, ""];
            setPrepStepsList(newPrepStepsList);
        }

        const removePrepStep = () => {
            if (prepStepsList.length > 1) {
                setPrepStepsList(prepStepsList.slice(0, prepStepsList.length - 1));
            }
        }

        return (
            <div className="form-group">
                <label htmlFor="step0" className="font-weight-bold">
                    Чекори на приготовка
                </label>
                <span className="text-danger font-weight-bolder ml-2"
                      style={{visibility: recipeValidation.prepSteps ? "visible" : "hidden"}}>
                    *
                </span>
                <div id="steps" className="row">
                    {mapPrepSteps()}
                </div>
                <div className="text-right">
                    <button className="btn btn-outline-success rounded-circle mr-1" data-title-left="Додади чекор"
                            onClick={addPrepStep}>
                        <i className="fa fa-plus"/>
                    </button>
                    <button className="btn btn-outline-danger rounded-circle"
                            data-title-left="Отстрани чекор" onClick={removePrepStep}>
                        <i className="fa fa-minus"/>
                    </button>
                </div>
            </div>
        );
    }

    const categories = () => {

        const getCategories = () => {
            return categoriesList.map(c => {
                return (
                    <div key={c.id.id} className="col-12 col-sm-6 col-md-4 mb-2">
                        <input id={c.id.id} type="checkbox" name="category" value={c.name}
                               onChange={() => setChangeMade(true)}/>
                        <label htmlFor={c.id.id} className="ml-1">{c.name}</label>
                    </div>
                );
            })
        }

        return (
            <div className="form-group">
                <label className="font-weight-bold">
                    Категории
                </label>
                <span className="text-danger font-weight-bolder ml-2"
                      style={{visibility: recipeValidation.categories ? "visible" : "hidden"}}>
                    *
                </span>
                <div className="row">
                    {getCategories()}
                </div>
            </div>
        );
    }

    const recipeImages = () => {

        const addImages = (e) => {
            const images = e.target.files;
            const options = {
                maxSizeMB: 0.1,
                maxWidthOrHeight: 1000,
            }
            const compressedImages = [];
            for (let i = 0; i < images.length; i++) {
                compressedImages.push(imageCompression(images[i], options));
                if (compressedImages.length === images.length) {
                    setImages(prevState => {
                        return [...prevState, ...e.target.files]
                    });
                }
            }
        }

        const removeImages = () => {
            setImages([]);
        }

        return (
            <div className="form-group">
                <label className="font-weight-bold">
                    Слики
                </label>

                <div className="row">
                    <div className="col-12 col-sm-6">
                        <label htmlFor="image" className="btn btn-outline-dark btn-block">
                            Додади слики
                        </label>
                        <input id="image" type="file" accept="image/*" style={{display: "none"}} multiple={true}
                               onChange={(e) => {
                                   addImages(e);
                                   setChangeMade(true);
                               }}/>
                    </div>
                    <div className="col-12 col-sm-6 mt-2 mt-sm-0 text-center">
                        <span className="lead">
                            {images.length} слики
                        </span>
                        <button className="btn btn-sm btn-outline-danger ml-3" data-title-left="Отстрани слики"
                                onClick={removeImages}>
                            <i className="fa fa-times"/>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const availabilityAndSaveButton = () => {

        return (
            <div className="row mb-4">
                <div className="col-12 col-sm-6 mb-4 mb-sm-0">
                    <div className="form-group mb-0">
                        <label htmlFor="availability" className="font-weight-bold">
                            Достапност
                        </label>
                        <select id="availability" className="form-control" onChange={() => setChangeMade(true)}>
                            <option value="PUBLIC">Јавно достапен</option>
                            <option value="PRIVATE">Приватен</option>
                        </select>
                    </div>
                </div>
                <div className="col-12 col-sm-6 d-flex align-items-end">
                    <button className="btn btn-success btn-block" onClick={createRecipe}>
                        ЗАЧУВАЈ
                    </button>
                </div>
            </div>
        );
    }

    const onUploadProgress = (e) => {
        setUploadProgress(Math.round((100 * e.loaded) / e.total));
    }

    const uploadProgressBar = () => {

        return uploadStarted ? (
            <div>
                <div className="progress">
                    <div className="progress-bar bg-dark" style={{width: `${uploadProgress}%`}}>
                        {uploadProgress}%
                    </div>
                </div>
            </div>
        ) : null;
    }

    const reminder = () => {

        const handleNavigation = (location) => {
            if (!confirmLeaving) {
                setNextLocation(location.pathname);
                handleShowReminderModal();
                return false;
            }
            return true;
        }

        const reminderModal = () => {

            return (
                <Modal show={showReminderModal} onHide={handleCloseReminderModal}
                       animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Излез
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Доколку излезете од страната без да притиснете на копчето "ЗАЧУВАЈ", тоа што сте го внеле ќе се
                        изгуби. Дали сте сигурни дека сакате да излезете?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-danger" onClick={() => setConfirmLeaving(true)}>
                            Да
                        </button>
                        <button className="btn btn-secondary" onClick={handleCloseReminderModal}>
                            Не
                        </button>
                    </Modal.Footer>
                </Modal>
            );
        }

        return (
            <>
                <Prompt
                    when={changeMade && !confirmLeaving}
                    message={handleNavigation}/>
                {reminderModal()}
            </>
        );
    }

    return (
        <section id="createRecipeSection">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-lg-9 col-xl-8 mx-auto">
                        <div className="card my-5">
                            <div className="card-body px-4 px-lg-5 py-5">
                                <div className="mb-4">
                                    <h2>
                                        Нов рецепт
                                    </h2>

                                    <hr/>
                                </div>

                                {recipeName()}
                                {description()}
                                {prepTimeAndNumServings()}

                                <hr/>

                                {ingredients()}
                                {prepSteps()}

                                <hr/>

                                {categories()}

                                <hr/>

                                {recipeImages()}

                                <hr/>

                                {availabilityAndSaveButton()}

                                {uploadProgressBar()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {reminder()}
        </section>
    );
}

export default CreateRecipe;
