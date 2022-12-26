import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import AuthContext from "./AuthContext";
import fetchData from "../utils/fetchData";

export default function FollowingList() {
    const {username} = useParams;
    const [user, setUser] = useState(null);
    const auth = useContext(AuthContext);
    const isMaster = auth.user.username === username;
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);

    console.log(user)

    useEffect(() => {
        setIsLoaded(false);

        fetchData(`${process.env.REACT_APP_SERVER}/data/${username}`)
        .then(data => {
            setUser(data);
        })
        .catch(error => {
            setError(error)
        })
        .finally(() => setIsLoaded(true))
    }, [username])
}