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

    function handleSubmit(e) {}
    
    return (
        <form onSubmit={handelSubmit} className="max-w-xs px-2 mx-auto">
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
                />
            </div>
            <div className="mb-2">
                <label htmlFor="">Password</label>
                <input
                    type={showPassword ? "text" : "password"}
                    className="border px-2 py-1 w-full"
                    onChange={(e) => setPassword(e.target.value)}
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
                <Link to="/register" className="text-blue-500"></Link>
            </div>
        </form>
    )
}