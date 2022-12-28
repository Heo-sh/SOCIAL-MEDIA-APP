// my work
// import { useState, useEffect, useContext } from "react";
// import { useParams, Link } from "react-router-dom";
// import AuthContext from "./AuthContext";
// import fetchData from "../utils/fetchData";

// export default function FollowingList() {
//     const {username} = useParams;
//     const [user, setUser] = useState(null);
//     const auth = useContext(AuthContext);
//     const isMaster = auth.user.username === username;
//     const [error, setError] = useState(null);
//     const [isLoaded, setIsLoaded] = useState(false);

//     console.log(user)

//     useEffect(() => {
//         setIsLoaded(false);

//         fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}`)
//         .then(data => {
//             setUser(data);
//         })
//         .catch(error => {
//             setError(error)
//         })
//         .finally(() => setIsLoaded(true))
//     }, [username])
// }

import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import fetchData from "../utils/fetchData";
import { useParams } from 'react-router-dom';

export default function FollowingList() {
    const {username} = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [follow, setFollow] = useState([]);

    useEffect(() => {
        fetchData(`http://localhost:3000/profiles/${username}/following`)
        .then(data => {
            setFollow([...follow, ...data])
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => setIsLoaded(true))
    }, [])

    console.log(follow);

    const followingList = follow.map(follow => (
        <li key={follow.id}>
            <Avatar user={follow.following} />
        </li>
    ))

    return(
        <div className="px-2">
            <h1 className="text-2xl mb-4">Following</h1>
            <ul>
                {followingList}
            </ul>

            {!isLoaded && <p>fetching following...</p>}
            {error && <p>failed to fetch following</p>}
        </div>
    )
}