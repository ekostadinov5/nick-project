import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";

import UserRepository from "../../repository/userRepository";

import LocalStorageService from "../../service/localStorageService";

const Login = (props) => {
    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();

    useEffect(() => {
        document.title = "Најава";

        if (LocalStorageService.getToken()) {
            history.replace("/");
        }
    }, [history]);

    const login = (e) => {
        e.preventDefault();
        const username = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        if (username.length > 0 && password.length > 0) {
            UserRepository.login(username, password).then(promise => {
                LocalStorageService.setToken(promise.headers.authorization);
                LocalStorageService.setRole(promise.headers.role);
                LocalStorageService.setIdentifier(promise.headers.identifier);
                props.loadLoggedInUser();
                history.replace("/");
            }).catch(error => {
                if (error.response) {
                    if (error.response.status === 403) {
                        setErrorMessage("Корисничкото име и/или лозинката кои ги внесовте се невалидни.");
                    } else if (error.response.status >= 500) {
                        setErrorMessage("Проблем со серверот.");
                    }
                }
            });
        } else {
            setErrorMessage("Внесете ги вашето корисничко име и лозинка.");
        }
    }

    return (
        <section id="loginSection">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5 mx-auto mt-0 mt-lg-5">
                        <div className="card my-5 text-center">
                            <form className="card-body pt-4 px-4 px-lg-5">
                                <h3>Најава</h3>
                                <hr />
                                <div className="form-group">
                                    <input id="email" type="email" className="form-control" placeholder="Е-пошта"/>
                                </div>
                                <div className="form-group">
                                    <input id="password" type="password" className="form-control"
                                           placeholder="Лозинка"/>
                                </div>
                                <div className="form-group">
                                    <button className="btn btn-outline-dark mt-2" onClick={login}>
                                        Најави се
                                    </button>
                                </div>
                                <span className="small text-danger">
                                    {errorMessage}
                                </span>
                            </form>
                            <div className="card-footer py-4">
                                Сеуште немате кориснички профил?
                                <Link to="/register" className="text-decoration-none ml-1">
                                    <u>
                                        Регистрирајте се!
                                    </u>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Login;
