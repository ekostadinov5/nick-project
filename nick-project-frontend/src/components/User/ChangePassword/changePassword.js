import React, {useState} from "react";
import {Modal} from "react-bootstrap";

const ChangePassword = (props) => {
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

    const changeUserPassword = () => {
        const oldPassword = document.getElementById("oldPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmNewPassword = document.getElementById("confirmNewPassword").value;

        if (oldPassword.length === 0 || newPassword.length === 0 || confirmNewPassword.length === 0) {
            setValidationErrorMessage("Пополнете ги сите полиња.");
        } else {
            props.changeUserPassword(oldPassword, newPassword, confirmNewPassword).then(() => {
                setResponseTitle("Успешна промена");
                setResponseMessage("Вашата лозинка е успешно променета.");
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
                Промени лозинка
            </button>

            <Modal show={showFormModal} onHide={handleCloseFormModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Промени лозинка
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <input id="oldPassword" type="password" className="form-control" placeholder="Стара лозинка" />
                    </div>
                    <div className="form-group">
                        <input id="newPassword" type="password" className="form-control" placeholder="Нова лозинка" />
                    </div>
                    <div className="form-group">
                        <input id="confirmNewPassword" type="password" className="form-control"
                               placeholder="Потврди нова лозинка" />
                    </div>
                    <div className="text-center">
                        <span className="small text-danger">
                            {validationErrorMessage}
                        </span>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-right">
                        <button className="btn btn-primary mr-1" onClick={changeUserPassword}>
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

export default ChangePassword;
