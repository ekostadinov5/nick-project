import React, {useEffect, useState} from "react";
import {Modal} from "react-bootstrap";

import Like from "./Like/like";

import UserRepository from "../../../repository/userRepository";

const Likes = (props) => {
    const [likes, setLikes] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const likes = [];
        props.likes.forEach(l => {
            UserRepository.getUserInfo(l.userId.id).then(promise => {
                const like = {
                    ...l,
                    userFirstName: promise.data.firstName,
                    userLastName: promise.data.lastName,
                    profilePictureFilename: promise.data.profilePictureFilename
                };
                likes.push(like);
            });
        });
        setLikes(likes);
    }, [props.likes]);

    const handleShowModal = () => {
        if (props.likes.length > 0) {
            const sideMenu = document.getElementsByClassName("side-menu")[0];
            if (sideMenu) {
                sideMenu.style.overflowY = "hidden";
            }
            setShowModal(true);
        }
    }
    const handleCloseModal = () => {
        setShowModal(false);
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "scroll";
        }
    }

    const mapLikes = () => {
        return likes.map(l => <Like key={l.userId.id} like={l} />);
    }

    return (
        <>
            <button className="btn p-0 mb-1 text-decoration-none" onClick={handleShowModal}>
                <i className="fa fa-thumbs-up text-primary mr-1"/>
                {props.likes.length} пофалби
            </button>

            <Modal dialogClassName="my-5 py-4" show={showModal} onHide={handleCloseModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Пофалби
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {mapLikes()}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Likes;
