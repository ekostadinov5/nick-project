import React, {useState} from "react";

const BackToTopButton = () => {
    const [showButton, setShowButton] = useState(false);

    const backToTop = () =>{
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const checkScroll = () => {
        if (!showButton && window.pageYOffset > 300){
            setShowButton(true);
        } else if (showButton && window.pageYOffset <= 300){
            setShowButton(false);
        }
    };

    window.addEventListener('scroll', checkScroll);

    return showButton ? (
        <div className="scrollTop">
            <button className="btn btn-secondary" data-title-left="Нагоре" onClick={backToTop}>
                <i className="fa fa-2x fa-arrow-up" />
            </button>
        </div>
    ) : null;
}

export default BackToTopButton;
