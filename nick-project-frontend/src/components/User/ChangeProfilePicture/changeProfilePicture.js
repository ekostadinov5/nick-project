import React, {useState} from "react";
import {Modal} from "react-bootstrap";

import imageCompression from "browser-image-compression";

const ChangeProfilePicture = (props) => {
    const [image, setImage] = useState();
    const [uploadStarted, setUploadStarted] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [responseTitle, setResponseTitle] = useState("");
    const [responseMessage, setResponseMessage] = useState("");
    const [showFormModal, setShowFormModal] = useState(false);
    const [showResponseModal, setShowResponseModal] = useState(false);

    const handleShowFormModal = () => {
        document.getElementById("userInfo").style.overflowY = "hidden";
        setShowFormModal(true);
    }
    const handleCloseFormModal = () => {
        setShowFormModal(false);
        document.getElementById("userInfo").style.overflowY = "scroll";
        setImage(null);
        setUploadStarted(false);
        setUploadProgress(0);
    }

    const handleShowResponseModal = () => {
        document.getElementById("userInfo").style.overflowY = "hidden";
        setShowResponseModal(true);
    }
    const handleCloseResponseModal = () => {
        setShowResponseModal(false);
        document.getElementById("userInfo").style.overflowY = "scroll";
    }

    const selectFile = (e) => {
        const image = e.target.files[0];
        const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 1000,
        }
        imageCompression(image, options).then(compressedImage => {
            setImage(compressedImage);
        });
    }

    const changeProfilePicture = () => {
        if (image) {
            setUploadStarted(true);
            props.changeUserProfilePicture(image, onUploadProgress).then(() => {
                setResponseTitle("Успешна промена");
                setResponseMessage("Вашата профилна слика е успешно променета.");
            }).catch(() => {
                setResponseTitle("Неуспешна промена");
                setResponseMessage("Неуспешна промена! Обидете се повторно подоцна.");
            }).finally(() => {
                handleCloseFormModal();
                handleShowResponseModal();
            });
        }
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

    return (
        <>
            <button className="dropdown-item text-wrap" onClick={handleShowFormModal}>
                Промени профилна слика
            </button>

            <Modal show={showFormModal} onHide={handleCloseFormModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Промени профилна слика
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label htmlFor="image" className="btn btn-outline-dark btn-block my-3">
                            Избери слика
                            {(() => {
                                if (image) {
                                    return <i className="fa fa-check ml-2" />
                                }
                            })()}
                        </label>
                        <input id="image" type="file" accept="image/*" style={{display: "none"}}
                               onChange={selectFile} />
                    </div>
                    {uploadProgressBar()}
                </Modal.Body>
                <Modal.Footer>
                    <div className="form-group text-right">
                        <button className="btn btn-primary mr-1" onClick={changeProfilePicture}>
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

export default ChangeProfilePicture;
