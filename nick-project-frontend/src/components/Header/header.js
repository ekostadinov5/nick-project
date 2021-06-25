import React, {useEffect, useState} from "react";
import {Link, NavLink, useHistory} from "react-router-dom";

import Notifications from "./Notifications/notifications";

import UserRepository from "../../repository/userRepository";

import LocalStorageService from "../../service/localStorageService";

import logoImage from "../../assets/img/logo.png";
import defaultProfilePicture from "../../assets/img/default_profile_picture.png";

const Header = (props) => {
    const [profilePicture, setProfilePicture] = useState();

    const history = useHistory();

    useEffect(() => {
        if (props.loggedInUser && props.loggedInUser.profilePictureFilename) {
            UserRepository.getUserProfilePicture(props.loggedInUser.userId).then(promise => {
                setProfilePicture(promise.data);
            });
        } else {
            setProfilePicture(null);
        }
    }, [props.loggedInUser]);

    const search = () => {
        const searchTerm = document.getElementById("searchTerm").value;
        history.push(`/search?term=${searchTerm}`);
    }

    const advancedSearch = () => {
        const searchTerm = document.getElementById("searchTerm").value;
        history.push(`/search/advanced?term=${searchTerm}`);
    }

    const goToLoginPage = () => {
        history.push("/login");
    }

    const logout = () => {
        LocalStorageService.clearToken();
        LocalStorageService.clearRole();
        LocalStorageService.clearIdentifier();
        props.unloadLoggedInUser();
        history.push("/");
    }

    const recipesAndFriendsLinks = () => {
        if (props.loggedInUser) {
            return (
                <>
                    <li className="nav-item d-inline-flex justify-content-center align-items-center">
                        <NavLink to={`/user/${props.loggedInUser.userId}/recipes`} exact className="nav-link">
                            Мои рецепти
                        </NavLink>
                    </li>
                    <li className="nav-item d-inline-flex justify-content-center align-items-center">
                        <NavLink to={`/user/${props.loggedInUser.userId}/friends`} exact className="nav-link">
                            Пријатели
                        </NavLink>
                    </li>
                </>
            );
        } else {
            return (
                <>
                    <li className="nav-item d-inline-flex justify-content-center align-items-center">
                        <button className="nav-link btn remove-button-box-shadow" onClick={goToLoginPage}>
                            Мои рецепти
                        </button>
                    </li>
                    <li className="nav-item d-inline-flex justify-content-center align-items-center">
                        <button className="nav-link btn remove-button-box-shadow" onClick={goToLoginPage}>
                            Пријатели
                        </button>
                    </li>
                </>
            );
        }
    }

    const userOptions = () => {
        if (props.loggedInUser) {
            return (
                <div className="text-center ml-0 ml-lg-2 mt-3 mt-lg-0">
                    <div className="dropdown d-inline">
                        <button className="btn remove-button-box-shadow" data-toggle="dropdown"
                                data-title-left="Мој профил">
                            <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                                 alt="Профилна слика на логираниот корисник"
                                 className="rounded-circle" width="45" height="45"/>
                        </button>
                        <div className="dropdown-menu dropdown-menu-right">
                            <h6 className="dropdown-header">
                                {props.loggedInUser.firstName} {props.loggedInUser.lastName}
                            </h6>
                            <div className="dropdown-divider" />
                            <Link to={`/user/${props.loggedInUser.userId}`} className="dropdown-item text-wrap">
                                Профил
                            </Link>
                            <button className="dropdown-item bg-danger text-white" onClick={logout}>Одјава</button>
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    <Link to="/login" className="btn btn-warning ml-0 ml-lg-2 mt-2 mt-lg-0">
                        Најава
                    </Link>
                </div>
            );
        }
    }

    return props ? (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <img id="navbarLogo" src={logoImage} alt="Лого"/>
                </Link>
                <button className="navbar-toggler" data-toggle="collapse" data-target="#navbarToggler"
                        aria-controls="navbarToggler" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"/>
                </button>
                <div className="collapse navbar-collapse my-3 my-lg-0" id="navbarToggler">
                    <div className="form-inline mt-2 mt-lg-0">
                        <div className="input-group mx-auto">
                            <input id="searchTerm" className="form-control" type="search" placeholder="Пребарај"/>
                            <div className="input-group-append">
                                <button className="btn btn-outline-dark" data-title-left="Пребарај" onClick={search}>
                                    <i className="fa fa-search"/>
                                </button>
                                <button className="btn btn-outline-dark" onClick={advancedSearch}
                                      data-title-left="Напредно пребарување">
                                    <i className="fa fa-search-plus"/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <ul className="navbar-nav ml-auto mt-2 mt-lg-0">
                        <li className="nav-item d-inline-flex justify-content-center align-items-center">
                            <NavLink to="/" exact className="nav-link">Почетна</NavLink>
                        </li>
                        {recipesAndFriendsLinks()}

                        <Notifications loggedInUser={props.loggedInUser}
                                       setNotificationOnSeen={props.setNotificationOnSeen} />
                    </ul>
                    {userOptions()}
                </div>
            </div>
        </nav>
    ) : null;
}

export default Header;
