import React, {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

import LocalStorageService from "../../service/localStorageService";
import UserRepository from "../../repository/userRepository";

const Register = (props) => {
    const [errorMessage, setErrorMessage] = useState("");

    const history = useHistory();

    useEffect(() => {
        document.title = "Регистрација";

        if (LocalStorageService.getToken()) {
            history.replace("/");
        }
    }, [history]);

    const validateDate = (year, month, day) => {
        if (month === 0  || month === 2 || month === 4 || month === 6 || month === 7 || month === 9
            || month === 11) {
            return day >= 1 && day <= 31;
        } else if (month === 3 || month === 5 || month === 8 || month === 10) {
            return day >= 1 && day <= 30;
        } else if (month === 1) {
            if (year % 100 === 0 ? year % 400 === 0 : year % 4 === 0) {
                return day >= 1 && day <= 29;
            } else {
                return day >= 1 && day <= 28;
            }
        } else {
            return false;
        }
    }

    const register = () => {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const residence = document.getElementById("residence").value;
        const dobDay = parseInt(document.getElementById("dobDay").value);
        const dobMonth = parseInt(document.getElementById("dobMonth").value) - 1;
        const dobYear = parseInt(document.getElementById("dobYear").value);
        const date = new Date(dobYear, dobMonth, dobDay);
        const dateOfBirth = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

        if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || password.length === 0
            || confirmPassword.length === 0 || residence.length === 0 || dobDay.length === 0 || dobYear.length === 0) {
            setErrorMessage("Пополнете ги сите полиња.");
        } else if (password.length < 6) {
            setErrorMessage("Лозинката е прекратка.");
        } else if (password !== confirmPassword) {
            setErrorMessage("Лозинките не се совпаѓаат.");
        } else if (!validateDate(dobYear, dobMonth, dobDay)) {
            setErrorMessage("Датумот на раѓање не е валиден.");
        } else {
            UserRepository.register(firstName, lastName, email, password, confirmPassword, residence, dateOfBirth)
                .then(promise1 => {
                    UserRepository.login(email, password).then(promise2 => {
                        LocalStorageService.setToken(promise2.headers.authorization);
                        LocalStorageService.setRole(promise2.headers.role);
                        LocalStorageService.setIdentifier(promise2.headers.identifier);
                        props.loadLoggedInUser();
                        history.replace("/");
                    })
                }).catch(error => {
                if (error.response) {
                    if (error.response.status >= 500) {
                        setErrorMessage("Проблем со серверот.");
                    }
                }
            });
        }
    }

    return (
        <section id="registerSection">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-10 col-md-8 col-lg-7 col-xl-6 mx-auto">
                        <div className="card my-5 text-center">
                            <div className="card-body pt-4 px-4 px-lg-5">
                                <h3>Регистрација</h3>
                                <hr/>
                                <div className="form-group">
                                    <input id="firstName" type="text" className="form-control" placeholder="Име"/>
                                </div>
                                <div className="form-group">
                                    <input id="lastName" type="text" className="form-control" placeholder="Презиме"/>
                                </div>
                                <div className="form-group">
                                    <input id="email" type="email" className="form-control" placeholder="Е-пошта"/>
                                </div>
                                <div className="form-group">
                                    <input id="password" type="password" className="form-control"
                                           placeholder="Лозинка"/>
                                </div>
                                <div className="form-group">
                                    <input id="confirmPassword" type="password" className="form-control"
                                           placeholder="Потврди лозинка"/>
                                </div>
                                <div className="form-group">
                                    <input id="residence" type="text" className="form-control"
                                           placeholder="Место на живеење"/>
                                </div>
                                <div className="form-group text-right">
                                    <div className="input-group">
                                        <input id="dobDay" type="number" className="form-control" placeholder="Ден"
                                               min="1" max="31"/>
                                        <select id="dobMonth" className="form-control" defaultValue="1">
                                            <option value="1">Јануари</option>
                                            <option value="2">Февруари</option>
                                            <option value="3">Март</option>
                                            <option value="4">Април</option>
                                            <option value="5">Мај</option>
                                            <option value="6">Јуни</option>
                                            <option value="7">Јули</option>
                                            <option value="8">Август</option>
                                            <option value="9">Септември</option>
                                            <option value="10">Октомври</option>
                                            <option value="11">Ноември</option>
                                            <option value="12">Декември</option>
                                        </select>
                                        <input id="dobYear" type="number" className="form-control" placeholder="Година"
                                               min="1900" max="2100"/>
                                    </div>
                                    <span className="form-text text-muted">
                                        на раѓање
                                    </span>
                                </div>
                                <div className="form-group">
                                    <span className="small text-danger">
                                        {errorMessage}
                                    </span>
                                </div>
                                <hr />
                                <div className="form-group">
                                    <button className="btn btn-outline-dark mt-2" onClick={register}>
                                        Регистрирај се
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Register;
