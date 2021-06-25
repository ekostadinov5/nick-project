import React, {useState} from "react";
import {Modal} from "react-bootstrap";

import FriendRow from "./FriendRow/friendRow";

import UserRepository from "../../../repository/userRepository";

const AddFriends = () => {
    const [searchedUsers, setSearchedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => {
        setShowModal(false);
        setSearchedUsers([]);
    }

    const searchUsers = () => {
        setSearchedUsers([]);

        const searchTerm = document.getElementById("searchUsers").value;
        if (searchTerm) {
            UserRepository.searchUsers(searchTerm).then(promise => {
                const users = promise.data;
                setSearchedUsers(prevState => [...prevState, ...users]);
            });
        }
    }

    const showSearchedUsers = () => {
        if (searchedUsers.length > 0) {
            return searchedUsers.map(u => <FriendRow key={u.userId} friend={u} />);
        } else {
            return (
                <div className="text-center text-muted font-weight-bold my-4">
                    Не е пронајден ниту еден корисник
                </div>
            );
        }
    }

    return (
        <>
            <button className="btn btn-block btn-outline-dark" onClick={handleShowModal}>
                ДОДАДЕТЕ НОВ ПРИЈАТЕЛ
            </button>

            <Modal dialogClassName="my-5 py-4" show={showModal} onHide={handleCloseModal} animation={false}
                   scrollable={true}>
                <Modal.Header closeButton>
                    <h4 className="m-0">Додадете нов пријател</h4>
                </Modal.Header>
                <Modal.Body>
                    <div className="input-group">
                        <input id="searchUsers" className="form-control" type="search"
                               placeholder="Пребарај корисници"/>
                        <div className="input-group-append">
                            <button className="btn btn-outline-dark" data-title-left="Пребарај" onClick={searchUsers}>
                                <i className="fa fa-search" />
                            </button>
                        </div>
                    </div>

                    <hr/>

                    {showSearchedUsers()}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default AddFriends;
