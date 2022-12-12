
import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import fetchData from "../utils/fetchData";

export default function AuthProvider({children}) {
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // logIn을 하지 않은 상태
        if (!localStorage.getItem("token")) {
            return setIsLoaded(true);
        }

        fetchData(`${process.env.REACT_APP_SERVER}/user`)
        .then(data => {
            // user state를 update한다.
            setUser(data)
        })
        .catch(error => {
            console.log(error)
            setError(error);
        })
        .finally(() => setIsLoaded(true));
    }, [])

    // LogIn
    function signIn(data, callback) {
        setUser(data.user);
        // localStorage에 token을 저장한다.
        localStorage.setItem("token", data.token);
        callback()
    }

    // LogOut
    function signOut() {
        setUser(null);
        // localStorage에서 token을 삭제한다.
        localStorage.removeItem("token");
    }

    const value = {user, setUser, signIn, signOut}

    if (error) {
        return <p>failed to fetch a user</p>
    }
    if (!isLoaded) {
        return <p>fething a user...</p>
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}