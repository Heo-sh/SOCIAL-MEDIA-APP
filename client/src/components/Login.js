import { useState, useContext } from "react";
import {Link, useNavigate} from "react-router-dom";
import AuthContext from "./AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const auth = useContext(AuthContext);

    const [email, setEmail] = useState(localStorage.getItem
    ("email") || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(e) {
        e.preventDefault();

        const formData = {email, password};

        console.log(formData);

        fetch(`${process.env.REACT_APP_SERVER}/accounts/login`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(formData)
        })
        .then (res => {
            if (!res.ok) {
                throw res;
            }
            // server의 응답(JSON FORMAT)을 파싱(parsing: 구문분석)한다.
            return res.json()
        })
        .then (data => {
            // login에 성공했을 때
            auth.signIn(data, () => navigate("/", {replace: true}));
            // localStorage에 login에 성공한 email을 저장한다.
            localStorage.setItem("email", email)
        })
        .catch (error => {
            // error 출력
            // console.log(error);

            // login에 실패했을 때

            // user 정보를 잘못 입력했을 때 : custom Error
            if (error.status === 401) {
                return alert("User not found")
            }
            // 기타 error (500)
            alert("Something's broken")
        }) 
    }
    
    return (
        <form onSubmit={handleSubmit} className="max-w-xs px-2 mx-auto">
            <div className="mb-4 h-48 flex justify-center items-center">
                <h1 className="text-2xl">SocialMediaApp</h1>
            </div>
            <div className="mb-2">
                <label htmlFor="">Email</label>
                <input
                    type="text"
                    className="border px-2 py-1 w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email@blabla.com"
                />
            </div>
            <div className="mb-2">
                <label htmlFor="">Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    className="border px-2 py-1 w-full"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****"
                />
                <label>
                    <input
                        type="checkbox"
                        onChange={(e) => setShowPassword(e.target.checked)}
                    /> {" "}
                    Show password
                </label>
            </div>
            <div className="mb-2">
                <button
                    type="submit"
                    className="border border-blue-500 text-blue-500 p-1 w-full disabled:opacity-[0.2]"
                    disabled={!email.trim() || !password.trim()}
                >
                Login
                </button>
            </div>
            <div>
                <Link to="/register" className="text-blue-500">Create Account</Link>
            </div>
        </form>
    )
}