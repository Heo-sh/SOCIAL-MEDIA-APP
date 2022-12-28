// my work
// import { useState, useEffect, useContext } from "react";
// import { useParams, Link } from "react-router-dom";
// import AuthContext from "./AuthContext";
// import fetchData from "../utils/fetchData";

// export default function FollowersList() {
//     const {username} = useParams();

//     return (
//         <>
//             <Details username={username} />
//         </>
//     )
// }

// function Details({username}) {
//     const [followers, setFollowers] = useState(null);
//     const auth = useContext(AuthContext);
//     const isMaster = auth.user.username === username;
//     const [error, setError] = useState(null);
//     const [isLoaded, setIsLoaded] = useState(false);

//     useEffect(() => {
//         setIsLoaded(false);

//         fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}/followers`)
//         .then(data => {
//             setFollowers(data);
//         })
//         .catch(error => {
//             setError(error)
//         })
//         .finally(() => setIsLoaded(true))
//     }, [username])

//     if (error) {
//         return <p>failed to fetch followerList</p>
//     }
//     if (!isLoaded) {
//         return <p>fetching followerList...</p>
//     }

//     const followerList = followers.map(follower => (
//         <li key={follower._id}>{follower.follower.username}</li>
//     ))

//     return (
//         <div>
//             {followerList}
//         </div>
//     )
// }

import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import fetchData from "../utils/fetchData";
import { useParams } from "react-router-dom";

export default function FollowersList() {
    const {username} = useParams();
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [follow, setFollow] = useState([]);

    useEffect(() => {
        fetchData(`http://localhost:3000/profiles/${username}/followers`)
        .then(data => {
            setFollow([...follow, ...data])
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => setIsLoaded(true))
    }, [])

    const followerList = follow.map(follow => (
        <li key={follow._id}>
            <Avatar user={follow.follower} />
        </li>
    ))

    return(
        <div className="px-2">
            <h1 className="text-2xl mb-4">Followers</h1>
            <ul>
                {followerList}
            </ul>

            {!isLoaded && <p>fetching following...</p>}
            {error && <p>failed to fetch following</p>}
        </div>
    )
}