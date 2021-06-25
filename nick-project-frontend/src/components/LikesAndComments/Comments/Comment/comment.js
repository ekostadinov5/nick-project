import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {Modal} from "react-bootstrap";

import UserRepository from "../../../../repository/userRepository";

import defaultProfilePicture from "../../../../assets/img/default_profile_picture.png";

const Comment = (props) => {
    const [userInfo, setUserInfo] = useState();
    const [profilePicture, setProfilePicture] = useState();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    useEffect(() => {
        UserRepository.getUserInfo(props.comment.userId.id).then(promise => {
            const userInfo = promise.data;
            setUserInfo(userInfo);
            return userInfo;
        }).then(userInfo => {
            if (userInfo && userInfo.profilePictureFilename) {
                UserRepository.getUserProfilePicture(props.comment.userId.id).then(promise => {
                    setProfilePicture(promise.data);
                });
            }
        });
    }, [props.comment]);

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

    const getFormattedDateAndTime = (dateTime) => {
        const getMonth = (dateTime) => {
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
            const index = dateTime.getMonth();
            return months[index];
        }

        dateTime = new Date(dateTime);
        const day = dateTime.getDate();
        const month = getMonth(dateTime);
        const year = dateTime.getFullYear();
        const hours = dateTime.getHours();
        const minutes = dateTime.getMinutes();
        return ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ", " + day + " " + month + " " + year;
    }

    const removeCommentFromRecipe = () => {
        props.removeCommentFromRecipe(props.recipeId, props.comment.id.id);
    }

    const removeButton = () => {
        if (userInfo.userId === props.loggedInUserId) {
            return (
                <>
                    <button className="btn btn-sm m-0 p-0" onClick={handleShowDeleteModal}>
                        <i className="fa fa-xs fa-times" />
                    </button>

                    <Modal dialogClassName="my-5 py-4" show={showDeleteModal} onHide={handleCloseDeleteModal}
                           animation={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Отстрани коментар
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Дали сте сигурни дека сакате да го отстраните вашиот коментар?
                        </Modal.Body>
                        <Modal.Footer>
                            <button className="btn btn-danger" onClick={removeCommentFromRecipe}>
                                Отстрани
                            </button>
                            <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                Откажи
                            </button>
                        </Modal.Footer>
                    </Modal>
                </>
            );
        }
    }

    return userInfo ? (
        <div id={props.comment.id.id} className="my-2 d-flex">
            <Link to={`/user/${userInfo.userId}`}>
                <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                     alt="Профилна слика на корисникот"
                     className="rounded-circle mr-1" width="50" height="50" />
            </Link>
            <div className="w-100 px-3 py-2 rounded bg-light">
                <div className="d-flex justify-content-between mb-1">
                    <h6 className="mb-1">
                        <Link to={`/user/${userInfo.userId}`} className="text-decoration-none">
                            {userInfo.firstName} {userInfo.lastName}
                        </Link>
                    </h6>

                    {removeButton()}
                </div>
                <p className="mb-0">
                    {props.comment.text}
                </p>
                <div className="text-right">
                    <small className="text-muted font-italic">
                        {getFormattedDateAndTime(props.comment.postedOn)}
                    </small>
                </div>
            </div>
        </div>
    ) : null;
}

export default Comment;
