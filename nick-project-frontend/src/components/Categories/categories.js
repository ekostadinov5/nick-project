import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import RecipeRepository from "../../repository/recipeRepository";

const Categories = () => {
    const [categoriesCollapsed, setCategoriesCollapsed] = useState(window.innerWidth < 992);
    const [togglerUp, setTogglerUp] = useState(!(window.innerWidth < 992));
    const [categoriesList, setCategoriesList] = useState([]);

    useEffect(() => {
        RecipeRepository.getAllCategories().then(promise => {
            const categories = promise.data;
            setCategoriesList(categories);
        });
    }, []);

    window.addEventListener('resize', () => {
        if (window.innerWidth < 992 && !categoriesCollapsed) {
            setCategoriesCollapsed(true);
            setTogglerUp(false);
        } else if (window.innerWidth >= 992 && categoriesCollapsed) {
            setCategoriesCollapsed(false);
            setTogglerUp(true);
        }
    });

    const changeToggler = () => {
        setTogglerUp(!togglerUp);
    }

    const collapseToggler = () => {
        if (togglerUp) {
            return <i className="fa fa-angle-up" />
        } else {
            return <i className="fa fa-angle-down" />
        }
    }

    const mapCategories = () => {
        return categoriesList.map(c => {
            return (
                <div key={c.id.id} className="mr-2 mt-3">
                    <Link to={`/search?category=${c.name}`} className="btn btn-block btn-outline-secondary">
                        {c.name}
                    </Link>
                </div>
            );
        });
    }

    return (
        <div id="categories" className="mt-2">
            <h3 className="text-center text-lg-left">
                Категории
                <button className="btn py-0 collapse-toggler" data-toggle="collapse"
                        data-target="#collapseCategories" aria-expanded="false" aria-controls="collapseCategories"
                        onClick={changeToggler}>
                    {collapseToggler()}
                </button>
            </h3>

            <hr className="m-0"/>

            <div id="collapseCategories" className={categoriesCollapsed ? "collapse side-menu" : "side-menu"}>
                {mapCategories()}
            </div>
        </div>
    );
}

export default Categories;
