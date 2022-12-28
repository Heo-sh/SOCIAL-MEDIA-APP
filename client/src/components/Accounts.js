import { useState, useEffect, useContext } from "react";
import AuthContext from "./AuthContext";

export default function Accounts() {
    const auth = useContext(AuthContext);
    // user와 setUser state는 AuthProvider에서 가져온 현재 login한 user이다 -> 구조분해할당
    const {user, setUser} = auth;

    console.log(user);

    // profile 사진을 upload하는 함수
    function uploadImage(e) {
        const files = e.target.files;

        const formData = new FormData();
        formData.append("image", files[0]);

        fetch(`${process.env.REACT_APP_SERVER}/accounts/edit/image`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`},
            body: formData
        })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.json();
        })
        .then(data => {
            // user update
            const editedUser = {...user, image: data};
            setUser(editedUser);

            alert("Image is uploaded");
        })
        .catch(error => {
            alert("Something's broken");
        })
    }

    // profile 사진을 delete하는 함수
    function deleteImage() {
        fetch(`${process.env.REACT_APP_SERVER}/accounts/edit/image`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`},
        })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            const editedUser = {...user, image: null};
            setUser(editedUser);
        })
        .catch(error => {
            alert("Something's broken");
        })
    }

    // 자기소개를 수정하는 함수
    function editBio(bio, setBio) {
        const formData = {bio};

        fetch(`${process.env.REACT_APP_SERVER}/accounts/edit`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json"},
            body: JSON.stringify(formData)
        })
        .then(res => {
            if (!res.ok) {
                throw res;
            }
            return res.json();
        })
        .then(data => {
            // user update
            const editedUser = {...user, bio: data};
            setUser(editedUser);

            alert("account is updated")
            
            // bio update -> promise then method 안에서 update
            setBio("");
        })
        .catch(error => {
            alert("Something's broken")
            console.log(error);
        })
    }

    return (
        <div className="px-2">
            <Image
                user={user}
                uploadImage={uploadImage}
                deleteImage={deleteImage}
            />
            <Form
                user={user}
                editBio={editBio}
            />
        </div>
    )
}

function Image({user, uploadImage, deleteImage}) {
    return(
        <div className="mb-4">
            <img 
                src={`${process.env.REACT_APP_SERVER}/data/users/${user.image || "avatar.jpeg"}`}
                className="w-24 h-24 object-cover rounded-full"
                accept="image/*"
            />
            {user.image ? (
                <button
                    type="button"
                    className="text-red-400"
                    onClick={deleteImage}
                >
                    Delete image
                </button>
            ) : (
                <input
                    type="file"
                    onChange={uploadImage}
                />
            )}
        </div>
    )
}

function Form({user, editBio}) {
    const [bio, setBio] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        editBio(bio, setBio);

        // setBio state가 비동기가 활성화되기도 전에 update가 되기 때문에 fetch 안에서 bio를 update해주는 것이다.
        // setBio("");
    }

    return(
        <form onSubmit={handleSubmit}>
            <div className="mb-2">
                <label htmlFor="">Username</label>
                <input 
                    type="text"
                    className="border px-2 py-1 w-full"
                    value={user.username}
                    disabled={true}
                />
            </div>
            <div className="mb-2">
                <label htmlFor="">Email</label>
                <input
                    type="text"
                    className="border px-2 py-1 w-full"
                    value={user.email}
                    disabled={true}
                />
            </div>
            <div className="mb-2">
                <label htmlFor="">Bio</label>
                <textarea
                    rows="3"
                    className="border px-2 py-1 w-full"
                    defaultValue={user.bio}
                    onChange={(e) => setBio(e.target.value)}
                />
            </div>
            <div className="mb-2">
                <button
                    type="submit"
                    className="border border-black px-2 disabled:opacity-[0.2]"
                    disabled={!bio.trim()}
                >
                    Submit
                </button>
            </div>
        </form>
    )
}