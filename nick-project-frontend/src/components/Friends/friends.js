import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom";

import AddFriends from "./AddFriends/addFriends";

import UserRepository from "../../repository/userRepository";
import Friend from "./Friend/friend";


const Friends = (props) => {
    const [friends, setFriends] = useState([]);
    const [filteredFriends, setFilteredFriends] = useState([]);

    const {userId} = useParams();

    const history = useHistory();

    useEffect(() => {
        if (props.loggedInUser && props.loggedInUser.userId === userId) {
            const sortedFriends = props.friends.sort((f1, f2) => {
                return (f1.firstName + f1.lastName).localeCompare(f2.firstName + f2.lastName)
            });
            setFriends(sortedFriends)
            setFilteredFriends(sortedFriends);

            document.title = `${props.loggedInUser.firstName + " " + props.loggedInUser.lastName} - Пријатели`;
        } else {
            UserRepository.getUser(userId).then(promise => {
                const user = promise.data;
                const sortedFriends = user.friends.sort((f1, f2) => {
                    return (f1.firstName + f1.lastName).localeCompare(f2.firstName + f2.lastName)
                });
                setFriends(sortedFriends);
                setFilteredFriends(sortedFriends);

                document.title = `${user.firstName + " " + user.lastName} - Пријатели`;
            });
        }
    }, [props.loggedInUser, props.friends, userId, history]);

    const mapFriends = () => {
        return filteredFriends.map(f => <Friend key={f.userId} friend={f} />);
    }

    const filter = (e) => {
        const matches = (f, filterTerm) => {
            return f.firstName.includes(filterTerm)
                || f.lastName.includes(filterTerm)
                || (f.firstName + " " + f.lastName).includes(filterTerm)
                || (f.lastName + " " + f.firstName).includes(filterTerm);
        }

        const filterTerm = e.target.value;
        if (filterTerm) {
            const filteredRecipes = friends.filter(f => matches(f, filterTerm));
            setFilteredFriends(filteredRecipes);
        } else {
            setFilteredFriends(friends);
        }
    }

    const noFriends = () => {
        if (filteredFriends.length === 0) {
            return (
                <div className="mt-5 text-center text-muted font-weight-bold">
                    Нема пријатели
                </div>
            );
        }
    }

    const addNewFriendButton = () => {
        if (props.loggedInUser && props.loggedInUser.userId === userId) {
            return (
                <div className="col-12 col-md-5 col-xl-4 mb-4 mb-md-0">
                    <AddFriends/>
                </div>
            );
        }
    }

    return (
        <section className="container">
            <div className="row mb-5">
                <div className="col-12 col-lg-9 mx-auto my-4">
                    <div className="row">
                        {addNewFriendButton()}

                        <div className="col-12 col-md-5 col-xl-4 ml-auto">
                            <input type="search" placeholder="Филтер" className="form-control" onChange={filter}/>
                        </div>
                    </div>

                    <hr/>

                    {noFriends()}

                    <div className="row">
                        {mapFriends()}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Friends;
