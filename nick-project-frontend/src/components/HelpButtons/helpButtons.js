import React, {useState} from "react";
import {Modal} from "react-bootstrap";

import plusMinusButtons from "../../assets/img/plus_minus_buttons.png";

const HelpButtons = (props) => {
    const [showButtons, setShowButtons] = useState(true);
    const [showHelpModal, setShowHelpModal] = useState(false);

    const handleShowHelpModal = () => {
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "hidden";
        }
        setShowHelpModal(true);
    }
    const handleCloseHelpModal = () => {
        setShowHelpModal(false);
        const sideMenu = document.getElementsByClassName("side-menu")[0];
        if (sideMenu) {
            sideMenu.style.overflowY = "scroll";
        }
    }

    const checkScroll = () => {
        if (!showButtons && window.pageYOffset <= 300){
            setShowButtons(true);
        } else if (showButtons && window.pageYOffset > 300){
            setShowButtons(false);
        }
    };

    window.addEventListener('scroll', checkScroll);

    const helpModal = () => {

        return (
            <Modal show={showHelpModal} onHide={handleCloseHelpModal} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Помош
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <p className="text-left lead">
                            Доколку сакате да го зголемите или намалите текстот на апликацијата, притиснете ги копчињата
                            означени со "+" и "-" кои се наоѓаат во долниот дел од екранот.
                        </p>
                        <img src={plusMinusButtons} alt="Слика од копчињата" />
                    </div>
                    <hr />
                    <p className="text-left lead">
                        Доколку не сте сигурни која акција се презема при клик на некое копче, придвижете се со глувчето
                        врз тоа копче за да ви се прикаже соодветната акција. Ова важи само за оние копчиња кои се со
                        икони.
                    </p>
                </Modal.Body>
            </Modal>
        );
    }

    return showButtons ? (
        <div id="help" className="btn-group-lg">
            <button className="btn btn-warning font-weight-bolder mr-1" data-title-right="Зголеми текст"
                    onClick={props.increaseElementsSize}>
                +
            </button>
            <button className="btn btn-warning font-weight-bolder mr-1" data-title-right="Намали текст"
                    onClick={props.decreaseElementsSize}>
                -
            </button>
            <button className="btn btn-warning font-weight-bolder" onClick={handleShowHelpModal}>
                ПОМОШ
            </button>
            {helpModal()}
        </div>
    ) : null;
}

export default HelpButtons;
