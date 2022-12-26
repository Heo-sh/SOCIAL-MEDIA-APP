import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import fetchData from "../utils/fetchData";

export default function FollowersList() {
    const {username} = useParams();

    return (
        <>
            <Details username={username} />
        </>
    )
}

function Details({username}) {
    const [followers, setFollowers] = useState(null);
    const auth = useContext(AuthContext);
    const isMaster = auth.user.username === username;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);

        fetchData(`${process.env.REACT_APP_SERVER}/profiles/${username}/followers`)
        .then(data => {
            setFollowers(data);
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => setIsLoaded(true))
    }, [username])

    if (error) {
        return <p>failed to fetch followerList</p>
    }
    if (!isLoaded) {
        return <p>fetching followerList...</p>
    }

    const followerList = followers.map(follower => (
        <li key={follower._id}>{follower.follower.username}</li>
    ))

    return (
        <div>
            {followerList}
        </div>
    )
}