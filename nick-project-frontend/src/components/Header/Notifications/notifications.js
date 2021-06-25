import React, {useEffect, useState} from "react";

import Notification from "./Notification/notification";

const Notifications = (props) => {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (props.loggedInUser) {
            const friendRequestNotifications = props.loggedInUser.receivedFriendRequests.map(fr => {
                return {
                    id: fr.id.id,
                    type: "FRIEND_REQUEST",
                    userId: fr.requestor.id,
                    receivedOn: new Date(fr.madeOn),
                }
            });
            const likeNotifications = props.loggedInUser.likeNotifications.map(l => {
                return {
                    id: l.id.id,
                    type: "LIKE",
                    recipeId: l.recipeId.id,
                    userId: l.userId.id,
                    receivedOn: new Date(l.receivedOn)
                }
            });
            const commentNotifications = props.loggedInUser.commentNotifications.map(c => {
                return {
                    id: c.id.id,
                    type: "COMMENT",
                    recipeId: c.recipeId.id,
                    userId: c.userId.id,
                    receivedOn: new Date(c.receivedOn),
                    commentId: c.commentId.id
                }
            });
            const allNotifications = friendRequestNotifications.concat(likeNotifications, commentNotifications);
            allNotifications.sort((n1, n2) => n2.receivedOn - n1.receivedOn);
            setNotifications(allNotifications);
        }
    }, [props.loggedInUser]);

    const notificationsDropdownButton = () => {
        if (notifications.length > 0) {
            return (
                <button className="btn remove-button-box-shadow nav-link dropdown-toggle text-warning mx-auto"
                        data-toggle="dropdown">
                    Известувања
                </button>
            );
        } else {
            return (
                <button className="btn remove-button-box-shadow nav-link dropdown-toggle mx-auto"
                        data-toggle="dropdown">
                    Известувања
                </button>
            );
        }
    }

    const mapNotifications = () => {
        return notifications.map(n =>
            <Notification key={n.id}
                          notification={n}
                          setNotificationOnSeen={props.setNotificationOnSeen} />);
    }

    const noNotifications = () => {
        if (notifications.length === 0) {
            return (
                <div className="dropdown-item bg-light text-wrap text-center">
                    Немате известувања
                </div>
            );
        }
    }

    return props.loggedInUser ? (
        <li className="nav-item d-inline-flex justify-content-center align-items-center">
            <div className="dropdown">
                {notificationsDropdownButton()}
                <div id="notifications" className="dropdown-menu dropdown-menu-right">
                    {noNotifications()}
                    {mapNotifications()}
                </div>
            </div>
        </li>
    ) : null;
}

export default Notifications;
