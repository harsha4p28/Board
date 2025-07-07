import React, { useState } from "react";
import "./Register.css";
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const usernameRegex = /^[a-zA-Z0-9_]{4,20}$/;

    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }


    if (!usernameRegex.test(formData.username)) {
      alert("Username should be 4-20 characters, letters, numbers or underscores only");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials:"include"
      });

      const data = await res.json();
      if (res.ok) {
        alert("Registered successfully!");
        navigate("/login");
      } else {
        alert(data.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to register. Please try again later.");
    }
  };


  return (
    <>
      <div className="page-container">
      <form onSubmit={handleRegister}>
        <div className="Register-container">
          <div className="login-logo">
            <h2>Create Your Dashboard - In Just One Click!</h2>
          </div>

          <label htmlFor="fullname">Fullname:</label>
          <input id="fullname" type="text" name="fullname" placeholder="Enter your Fullname" value={formData.fullname} onChange={handleChange} required/>

          <label htmlFor="email">Email:</label>
          <input id="email" type="text" name="email" placeholder="Enter your Email" value={formData.email} onChange={handleChange} required/>

          <label htmlFor="username">Username:</label>
          <input id="username" type="text" name="username" placeholder="Enter your Username" value={formData.username} onChange={handleChange} required/>

          <label htmlFor="password">Password:</label>
          <input id="password" type="password" name="password" placeholder="Enter your Password" value={formData.password} onChange={handleChange} required/>

          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input id="confirmPassword" type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} required/>



          <button className="submit-btn" type="submit">Register</button>

            <div className="login-pass">
                <p>Already have an account?<span><Link to="/Login" className="login-link"><p>Login</p></Link></span></p>
            </div>
        </div>
      </form>

      </div>
    </>
  );
}
