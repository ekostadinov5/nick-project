import React, {useEffect, useState} from "react";
import {Link, useParams, useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";

import LikesAndComments from "../LikesAndComments/likesAndComments";

import RecipeRepository from "../../repository/recipeRepository";
import UserRepository from "../../repository/userRepository";

const Recipe = (props) => {
    const [recipe, setRecipe] = useState();
    const [images, setImages] = useState([]);
    const [recipeUser, setRecipeUser] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const {recipeId} = useParams();

    const history = useHistory();

    useEffect(() => {
        RecipeRepository.getRecipe(recipeId).then(promise1 => {
            const recipe = promise1.data;
            setRecipe(recipe);
            recipe.imageFiles.forEach(imageFile => {
                RecipeRepository.getOneRecipeImage(imageFile.filename).then(promise2 => {
                    const image = promise2.data;
                    setImages(prevState => [...prevState, image]);
                });
            });
            UserRepository.getUserInfo(recipe.userId).then(promise2 => {
                const user = promise2.data;
                setRecipeUser(user);
            });

            document.title = recipe.name;
        });
    }, [recipeId]);

    const handleShowDeleteModal = () => {
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "hidden";
        }
        setShowDeleteModal(true);
    }
    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "scroll";
        }
    }

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

    const deleteRecipe = () => {
        props.deleteRecipe(recipe.recipeId);
        history.push(`/user/${props.loggedInUser.userId}/recipes`);
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
                <button className="btn btn-success mb-1 mr-1" data-title-right="Пофали" onClick={likeRecipe}>
                    <i className="fa fa-thumbs-up" />
                </button>
            );
        } else {
            return (
                <button className="btn btn-danger mb-1 mr-1" data-title-right="Отстрани пофалба" onClick={unlikeRecipe}>
                    <i className="fa fa-thumbs-down" />
                </button>
            );
        }
    }

    const scrollToIngredientsAndSteps = () => {
        let element = document.getElementById("ingredientsAndSteps");
        window.scrollTo(0, element.offsetTop);
    }

    const userRecipeHeader = () => {
        const availability =
            recipe.availability === "PUBLIC" ? "Јавно достапен" :
                recipe.availability === "FRIENDS" ? "Само пријатели" :
                    "Приватен";

        return props.loggedInUser && recipe.userId === props.loggedInUser.userId ? (
            <>
                <div className="text-right mb-4">
                    <div className="dropdown">
                        <button className="btn btn-outline-dark " data-toggle="dropdown" data-title-left="Опции">
                            <i className="fa fa-ellipsis-h"/>
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <h6 className="dropdown-header">
                                {availability}
                            </h6>
                            <div className="dropdown-divider" />
                            <Link to={`/recipe/${recipe.recipeId}/edit`}
                                  className="dropdown-item text-wrap">
                                Промени
                            </Link>
                            <button className="dropdown-item text-wrap bg-danger text-white"
                                    onClick={handleShowDeleteModal}>
                                Избриши
                            </button>
                        </div>
                    </div>

                    <hr />
                </div>

                <Modal dialogClassName="my-5 py-4" show={showDeleteModal} onHide={handleCloseDeleteModal}
                       animation={false}>
                    <Modal.Header closeButton>
                        <Modal.Title>
                            Избриши рецепт
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Дали сте сигурни дека сакате да го избришете вашиот рецепт?
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="btn btn-danger" onClick={deleteRecipe}>
                            Избриши
                        </button>
                        <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                            Откажи
                        </button>
                    </Modal.Footer>
                </Modal>
            </>
        ) : null;
    }

    const recipeHeader = () => {

        return (
            <div className="row">
                <div className="col-12 col-md-6 col-xl-7 mb-4">
                    <h2 className="mb-2">
                        {recipe.name}
                    </h2>
                    <h6 className="mb-3">
                        <Link to={`/user/${recipeUser.userId}`} className="text-decoration-none">
                            {recipeUser.firstName} {recipeUser.lastName}
                        </Link>
                    </h6>
                    <div className="text-muted font-italic">
                        {getFormattedDate(recipe.postedOn)}
                    </div>
                </div>

                <div className="col-12 col-md-6 col-xl-5 mb-4 text-left text-md-right">
                    {likeButton()}
                    <button className="btn btn-secondary mb-1 mr-1" data-title-right="Остави коментар"
                            onClick={focusCommentTextarea}>
                        <i className="fa fa-comment"/>
                    </button>
                    <button className="btn btn-outline-dark mb-1" onClick={scrollToIngredientsAndSteps}>
                        Како да го приготвам?
                    </button>
                </div>
            </div>
        );
    }

    const recipeDescPrepTimeAndNumServings = () => {

        return (
            <div className="row">
                <div className="col-12 col-md-7 mb-4">
                    <div className="mb-2">
                        {listCategories()}
                    </div>
                    <p className="mb-0">
                        {recipe.description}
                    </p>
                </div>

                <div className="col-12 col-md-5 mb-4">
                    <div className="card">
                        <div className="card-body py-3">
                            <div className="d-flex mb-2">
                                <i className="fa fa-2x fa-clock mt-1 mr-4"/>
                                <div>
                                    <h6 className="mb-0">Време на приготовка: </h6>
                                    <p className="mb-0">{recipe.prepTime} минути</p>
                                </div>
                            </div>
                            <div className="d-flex">
                                <i className="fas fa-2x fa-utensil-spoon mt-1 mr-4"/>
                                <div>
                                    <h6 className="mb-0">Број на порции: </h6>
                                    <p className="mb-0">{recipe.numServings}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const recipeImages = () => {
        const carouselIndicators = () => {
            return images.map((image, index) => {
                if (index === 0) {
                    return <li key={index} data-target="#carousel" data-slide-to={index} className="active"/>
                } else {
                    return <li key={index} data-target="#carousel" data-slide-to={index} />
                }
            });
        }

        const carouselItems = () => {
            return images.map((image, index) => {
                if (index === 0) {
                    return (
                        <div key={index} className="carousel-item active">
                            <img className="carousel-image d-block w-100" src={`data:image/*;base64,${image}`}
                                 alt="Слика од рецептот"/>
                        </div>
                    );
                } else {
                    return (
                        <div key={index} className="carousel-item">
                            <img className="carousel-image d-block w-100" src={`data:image/*;base64,${image}`}
                                 alt="Слика од рецептот"/>
                        </div>
                    );
                }
            });
        }

        if (images.length > 0) {
            return (
                <div id="carousel" className="carousel slide mb-4" data-ride="carousel">
                    <ul className="carousel-indicators">
                        {carouselIndicators()}
                    </ul>
                    <div className="carousel-inner">
                        {carouselItems()}
                    </div>
                    <button className="btn remove-button-box-shadow carousel-control-prev" data-target="#carousel"
                            data-slide="prev">
                        <i className="carousel-control-prev-icon" aria-hidden="true"/>
                    </button>
                    <button className="btn remove-button-box-shadow carousel-control-next" data-target="#carousel"
                            data-slide="next">
                        <i className="carousel-control-next-icon" aria-hidden="true"/>
                    </button>
                </div>
            );
        }
    }

    const recipeIngredientsAndSteps = () => {

        const mapIngredients = () => {
            return recipe.ingredients.sort((i1, i2) => i1.index - i2.index).map(i => {
                return (
                    <p key={i.index}>
                        <span className="font-weight-bold mr-1">{i.index + 1}.</span>
                        <span>{i.name}</span>
                    </p>
                );
            });
        }

        const mapPreparationSteps = () => {
            return recipe.prepSteps.sort((ps1, ps2) => ps1.index - ps2.index).map(ps => {
                return (
                    <p key={ps.index}>
                        <span className="font-weight-bold mr-1">{ps.index + 1}.</span>
                        <span>{ps.text}</span>
                    </p>
                );
            });
        }

        return (
            <div id="ingredientsAndSteps" className="row">
                <div className="col-12 col-md-4 mb-4">
                    <h4>Состојки</h4>

                    <hr/>

                    {mapIngredients()}
                </div>

                <div className="col-12 col-md-8 mb-4">
                    <h4>Чекори на приготовка</h4>

                    <hr/>

                    {mapPreparationSteps()}
                </div>
            </div>
        );
    }

    return recipe && recipeUser ? (
        <section className="container">
            <div className="row mb-5">
                <div className="col-12 col-lg-9 mx-auto my-4">
                    {userRecipeHeader()}
                    {recipeHeader()}
                    {recipeDescPrepTimeAndNumServings()}
                    {recipeImages()}
                    {recipeIngredientsAndSteps()}

                    <hr/>

                    <LikesAndComments loggedInUser={props.loggedInUser}
                                      recipeId={recipe.recipeId}
                                      commentsCollapsed={false}
                                      likes={recipe.likes}
                                      comments={recipe.comments}
                                      commentOnRecipe={props.commentOnRecipe}
                                      removeCommentFromRecipe={props.removeCommentFromRecipe} />
                </div>
            </div>
        </section>
    ) : null;
}

export default Recipe;
