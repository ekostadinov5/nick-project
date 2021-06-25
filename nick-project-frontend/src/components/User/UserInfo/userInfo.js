import React, {useEffect, useState} from "react";
import {Link, useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";

import ChangeProfilePicture from "../ChangeProfilePicture/changeProfilePicture";
import ChangeUserInfo from "../ChangeUserInfo/changeUserInfo";
import ChangePassword from "../ChangePassword/changePassword";

import UserRepository from "../../../repository/userRepository";

import defaultProfilePicture from "../../../assets/img/default_profile_picture.png";

const UserInfo = (props) => {
    const [profilePicture, setProfilePicture] = useState();
    const [showProfilePictureModal, setShowProfilePictureModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const history = useHistory();

    useEffect(() => {
        if (props.user && props.user.profilePictureFilename) {
            UserRepository.getUserProfilePicture(props.user.userId).then(promise => {
                setProfilePicture(promise.data);
            });
        }
    }, [props.user]);

    const handleShowProfilePictureModal = () => {
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "hidden";
        }
        setShowProfilePictureModal(true);
    }
    const handleCloseProfilePictureModal = () => {
        setShowProfilePictureModal(false);
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "scroll";
        }
    }

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

    const expandProfilePicture = () => {
        handleShowProfilePictureModal();
    }

    const calculateAgeFromDate = (date) => {
        let dateOfBirth = new Date(date);
        let today = new Date();
        let age = today.getFullYear() - dateOfBirth.getFullYear();
        let m = today.getMonth() - dateOfBirth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() - dateOfBirth.getDate() <= 0)) {
            age--;
        }
        return age;
    }

    const addFriend = () => {
        if (props.loggedInUser) {
            props.addFriend(props.user.userId);
        } else {
            history.push("/login");
        }
    }

    const rejectFriend = () => {
        if (props.loggedInUser) {
            props.rejectFriend(props.user.userId);
        } else {
            history.push("/login");
        }
    }

    const removeFriend = () => {
        if (props.loggedInUser) {
            props.removeFriend(props.user.userId);
        } else {
            history.push("/login");
        }
    }

    const sendFriendRequest = () => {
        if (props.loggedInUser) {
            props.sendFriendRequest(props.user.userId);
        } else {
            history.push("/login");
        }
    }

    const removeFriendRequest = () => {
        if (props.loggedInUser) {
            props.removeFriendRequest(props.user.userId);
        } else {
            history.push("/login");
        }
    }

    const userInfoOptions = () => {
        if (props.userInfoOptions) {
            return (
                <div className="mb-2 text-right">
                    <div className="dropdown">
                        <button className="btn btn-sm btn-outline-dark " data-toggle="dropdown"
                                data-title-left="Промени профил">
                            <i className="fa fa-ellipsis-h"/>
                        </button>
                        <div className="dropdown-menu">
                            <ChangeProfilePicture changeUserProfilePicture={props.changeUserProfilePicture} />
                            <div className="dropdown-divider" />
                            <ChangeUserInfo user={props.user}
                                            changeUserInfo={props.changeUserInfo}/>
                            <div className="dropdown-divider" />
                            <ChangePassword changeUserPassword={props.changeUserPassword} />
                        </div>
                    </div>
                </div>
            );
        }
    }

    const profilePictureModal = () => {
        return (
            <Modal show={showProfilePictureModal} onHide={handleCloseProfilePictureModal} animation={false}>
                <Modal.Header className="px-3 py-2" closeButton>
                    <Modal.Title>
                        Профилна слика
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-0">
                    <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                         alt="Профилна слика" className="img-fluid" />
                </Modal.Body>
            </Modal>
        );
    }

    const friendRequestButton = () => {
        if (!props.userInfoOptions) {
            if (props.hasReceivedFriendRequest) {
                return (
                    <>
                        <button className="btn btn-success btn-block" onClick={addFriend}>
                            <i className="fa fa-check mr-2"/>
                            Прифати
                        </button>
                        <button className="btn btn-danger btn-block" onClick={rejectFriend}>
                            <i className="fa fa-times mr-2"/>
                            Отфрли
                        </button>
                    </>
                );
            }
            if (props.hasSentFriendRequest) {
                return (
                    <button className="btn btn-outline-danger btn-block" onClick={removeFriendRequest}>
                        <i className="fa fa-minus mr-2"/>
                        Отстрани барање
                    </button>
                );
            } else if (props.isFriend) {
                return (
                    <>
                        <button className="btn btn-danger btn-block" onClick={handleShowDeleteModal}>
                            <i className="fa fa-user-minus mr-2"/>
                            Отстрани пријател
                        </button>

                        <Modal dialogClassName="my-5 py-4" show={showDeleteModal} onHide={handleCloseDeleteModal}
                               animation={false}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Отстрани пријател
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Дали сте сигурни дека сакате да го отстраните вашиот пријател?
                            </Modal.Body>
                            <Modal.Footer>
                                <button className="btn btn-danger" onClick={removeFriend}>
                                    Отстрани
                                </button>
                                <button className="btn btn-secondary" onClick={handleCloseDeleteModal}>
                                    Откажи
                                </button>
                            </Modal.Footer>
                        </Modal>
                    </>
                );
            } else {
                return (
                    <button className="btn btn-outline-success btn-block" onClick={sendFriendRequest}>
                        <i className="fa fa-user-plus mr-2"/>
                        Додади пријател
                    </button>
                );
            }
        }
    }

    return (
        <div id="userInfo" className="pl-1 pr-2 side-menu">
            {userInfoOptions()}

            <div className="text-center mb-4">
                <button className="btn remove-button-box-shadow p-0" onClick={expandProfilePicture}>
                    <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                         alt="Профилна слика" className="rounded-circle border border-dark p-1" width="200"
                         height="200"/>
                </button>
                {profilePictureModal()}
                <h3 className="my-3">{props.user.firstName} {props.user.lastName}</h3>
            </div>

            <hr/>

            <div className="mb-4">
                {friendRequestButton()}
                <Link to={`/user/${props.user.userId}/recipes`} className="btn btn-outline-dark btn-block">
                    Рецепти ({props.user.recipeIds.length})
                </Link>
                <Link to={`/user/${props.user.userId}/friends`} className="btn btn-outline-dark btn-block">
                    Пријатели ({props.user.friends.length})
                </Link>
            </div>

            <div className="mb-3 text-center">
                <div className="font-weight-bold">Место на живеење</div>
                <div>{props.user.residence}</div>
            </div>
            <div className="mb-3 text-center">
                <div className="font-weight-bold">Години</div>
                <div>{calculateAgeFromDate(props.user.dateOfBirth)}</div>
            </div>
        </div>
    );
}

export default UserInfo;
