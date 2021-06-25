import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import UserRepository from "../../../../repository/userRepository";

import defaultProfilePicture from "../../../../assets/img/default_profile_picture.png";

const Like = (props) => {
    const [profilePicture, setProfilePicture] = useState();

    useEffect(() => {
        if (props.like && props.like.profilePictureFilename) {
            UserRepository.getUserProfilePicture(props.like.userId.id).then(promise => {
                setProfilePicture(promise.data);
            });
        }
    }, [props.like]);

    return (
        <div>
            <Link to={`/user/${props.like.userId.id}`} className="text-decoration-none">
                <div className="d-flex">
                    <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                         alt="Профилна слика на корисникот"
                         className="rounded-circle mr-1" width="50" height="50" />
                    <h6 className="d-flex align-items-center ml-2">
                        {props.like.userFirstName} {props.like.userLastName}
                    </h6>
                </div>
            </Link>
        </div>
    );
}

export default Like;
