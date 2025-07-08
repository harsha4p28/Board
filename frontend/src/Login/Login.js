import React, { useState ,useEffect} from "react";
import './Login.css';
import { Link,useNavigate } from "react-router-dom";

export default function Login({setUserLoggedin}) {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });
    const [errMsg, setErrMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        setLoading(true);

        try {
            const res = await fetch("https://31ec9935-6b8d-464c-84b7-ee91541cce62-00-2okr80w4xnq04.pike.replit.dev:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: 'include',
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                setFormData({ username: "", password: "" });
                setSuccess(true);
                setUserLoggedin(true)
                setTimeout(() => {
                    setSuccess(false);
                    navigate("/")
                }, 500);
            } else {
                setErrMsg(data.error || "Login failed");
                setTimeout(() => {
                    setErrMsg('');
                }, 3000);
            }
        } catch (err) {
            console.error("Login error:", err);
            alert("Something went wrong. Please try later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <form onSubmit={handleLogin}>
                <div className="login-container">
                    <div className="login-logo">
                        <h2>Login to your dashboard</h2>
                    </div>

                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    {errMsg && <p style={{ color: 'red' }}>{errMsg}</p>}
                    {success && <p style={{ color: 'green', cursor: "pointer" }}>Login Successful</p>}

                    <button className="submit-btn" disabled={loading}>
                        {loading ? "Logging in..." : "Continue"}
                    </button>
                    <p>Don't have an account?<span><Link to="/Register" className="register-link"> Register</Link></span></p>
                </div>
            </form>

        </div>
    );
}