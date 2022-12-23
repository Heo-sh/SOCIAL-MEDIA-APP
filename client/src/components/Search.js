import { useState, useEffect, useRef } from "react";
import {Link} from "react-router-dom";
import Avatar from "./Avatar";
import fetchData from "../utils/fetchData";

export default function Search() {
    const [users, setUsers] = useState([]);
    // useRef: element에 직접 접근할 때 사용한다. null은 초기값
    const inputRef = useRef(null);

    console.log(inputRef);
    console.log(users);

    function handleChange(e) {
        const username = e.target.value;

        // 검색어가 없을 경우 검색결과가 안 보이게 처리한다.
        if (!username.trim()) {
            return setUsers([])
        }

        fetchData(`${process.env.REACT_APP_SERVER}/search/?username=${username}`)
        .then(data => {
            setUsers(data)
        })
        .catch(error => {
            alert("Something's broken");
        })
    }

    // DOM이 return된 뒤에 Element에 접근할 수 있다.
    // useEffect에 [], dependency가 없을 경우 component가 실행될 때마다 effect가 실행된다.
    useEffect(() => {
        // input에 focus를 한다.
        inputRef.current.focus();
    },[])

    return (
        <div className="px-2">
            <div className="mb-4">
                <input 
                    type="text"
                    className="border px-2 py-1 w-full"
                    onChange={handleChange}
                    placeholder="Search"
                    ref={inputRef}
                />
            </div>

            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                       <Avatar user={user}/> 
                    </li>
                ))}
            </ul>
        </div>
    )
}