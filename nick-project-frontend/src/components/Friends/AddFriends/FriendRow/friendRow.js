import React, {useEffect, useState} from "react";
import {Link} from "react-router-dom";

import UserRepository from "../../../../repository/userRepository";

import defaultProfilePicture from "../../../../assets/img/default_profile_picture.png";

const FriendRow = (props) => {
    const [profilePicture, setProfilePicture] = useState();

    useEffect(() => {
        if (props.friend && props.friend.profilePictureFilename) {
            UserRepository.getUserProfilePicture(props.friend.userId).then(promise => {
                setProfilePicture(promise.data);
            });
        }
    }, [props.friend]);


    return (
        <Link to={`/user/${props.friend.userId}`} className="text-decoration-none">
            <div className="row mx-0 mb-3 border rounded">
                <div className="d-flex align-items-center">
                    <div className="mr-3">
                        <img src={profilePicture ? `data:image/*;base64,${profilePicture}` : defaultProfilePicture}
                             alt="Профилна слика" className="rounded" width="100" height="100"/>
                    </div>
                    <div className="lead text-break">
                        {props.friend.firstName} {props.friend.lastName}
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default FriendRow;
