import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import UserRepository from "../../../repository/userRepository";

import defaultProfilePicture from "../../../assets/img/default_profile_picture.png";

const Friend = (props) => {
    const [profilePicture, setProfilePicture] = useState();

    useEffect(() => {
        if (props.friend && props.friend.profilePictureFilename) {
            UserRepository.getUserProfilePicture(props.friend.userId).then(promise => {
                setProfilePicture(promise.data);
            });
        }
    }, [props.friend]);

    return (
        <div className="col-6 col-sm-4 col-md-3 col-xl-2 mb-3">
            <Link to={`/user/${props.friend.userId}`}>
                <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                     alt="Профилна слика" className="rounded w-100" height="130"/>
            </Link>
            <div className="p-2 text-center">
                <Link to={`/user/${props.friend.userId}`} className="text-decoration-none">
                    {props.friend.firstName} {props.friend.lastName}
                </Link>
            </div>
        </div>
    );
}

export default Friend;
