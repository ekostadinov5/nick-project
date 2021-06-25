import React, {useState} from "react";
import {Modal} from "react-bootstrap";

const ChangeUserInfo = (props) => {
    const [responseTitle, setResponseTitle] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [validationErrorMessage, setValidationErrorMessage] = useState("");
    const [showFormModal, setShowFormModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);

    const handleShowFormModal = () => {
        document.getElementById("userInfo").style.overflowY = "hidden";
        setShowFormModal(true);
    }
    const handleCloseFormModal = () => {
        setShowFormModal(false);
        document.getElementById("userInfo").style.overflowY = "scroll";
    }

    const handleShowResponseModal = () => {
        document.getElementById("userInfo").style.overflowY = "hidden";
        setShowResponseModal(true);
    }
    const handleCloseResponseModal = () => {
        setShowResponseModal(false);
        document.getElementById("userInfo").style.overflowY = "scroll";
    }

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

    const changeUserInfo = () => {
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const residence = document.getElementById("residence").value;
        const dobDay = parseInt(document.getElementById("dobDay").value);
        const dobMonth = parseInt(document.getElementById("dobMonth").value) - 1;
        const dobYear = parseInt(document.getElementById("dobYear").value);
        const date = new Date(dobYear, dobMonth, dobDay);
        const dateOfBirth = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString()
            .substring(0, 10);

        if (firstName.length === 0 || lastName.length === 0 || email.length === 0 || residence.length === 0
            || dobDay.length === 0 || dobYear.length === 0) {
            setValidationErrorMessage("Пополнете ги сите полиња.");
        } else if (!validateDate(dobYear, dobMonth, dobDay)) {
            setValidationErrorMessage("Датумот на раѓање не е валиден.");
        } else {
            props.changeUserInfo(firstName, lastName, email, residence, dateOfBirth).then(() => {
                setResponseTitle("Успешна промена");
                setResponseMessage("Вашите лични податоци се успешно променети.");
            }).catch(() => {
                setResponseTitle("Неуспешна промена");
                setResponseMessage("Неуспешна промена! Обидете се повторно подоцна.");
            }).finally(() => {
                handleCloseFormModal();
                handleShowResponseModal();
            });
        }
    }

    return (
        <>
            <button className="dropdown-item text-wrap" onClick={handleShowFormModal}>
                Промени лични информации
            </button>

            <Modal show={showFormModal} onHide={handleCloseFormModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Лични информации
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="firstName">Име</label>
                        <input id="firstName" type="text" className="form-control" defaultValue={props.user.firstName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Презиме</label>
                        <input id="lastName" type="text" className="form-control" defaultValue={props.user.lastName}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Е-пошта</label>
                        <input id="email" type="email" className="form-control"
                               defaultValue={props.user.email}/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="residence">Место на живеење</label>
                        <input id="residence" type="text" className="form-control" defaultValue={props.user.residence}/>
                    </div>
                    <div className="form-group">
                        <label className="form-text">Роден/а на:</label>
                        <div className="input-group">
                            <input id="dobDay" type="number" className="form-control" min="1" max="31"
                                   defaultValue={parseInt(props.user.dateOfBirth.split("-")[2])}/>
                            <select id="dobMonth" className="form-control"
                                    defaultValue={parseInt(props.user.dateOfBirth.split("-")[1])}>
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
                            <input id="dobYear" type="text" className="form-control"
                                   defaultValue={props.user.dateOfBirth.split("-")[0]}/>
                        </div>
                    </div>
                    <div className="text-center">
                        <span className="small text-danger">
                            {validationErrorMessage}
                        </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-right">
                        <button className="btn btn-primary mr-1" onClick={changeUserInfo}>
                            Промени
                        </button>
                        <button className="btn btn-secondary" onClick={handleCloseFormModal}>
                            Откажи
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal show={showResponseModal} onHide={handleCloseResponseModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {responseTitle}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {responseMessage}
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-right">
                        <button className="btn btn-outline-dark mr-1" onClick={handleCloseResponseModal}>
                            Во ред
                        </button>
                    </div>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ChangeUserInfo;
