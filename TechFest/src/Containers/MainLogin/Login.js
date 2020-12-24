import React, { useState } from "react";
import "./Login.css";
import Axios from "axios";
import { Link } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

  const login = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: {
        email: email,
        password: password,
      },
      withCredentials: true,
      url: "http://localhost:5000/api/login",
    }).then((res) => {
      console.log(res);
      setMsg(res.data);
    });
  };
  return (
    <div className="login">
      {/* <img src={Sky} className="sky"/>
        <img src={Sand} className="sand"/>
        <img src={Building} className="building"/> */}
      <Link to="/">
        <i className="ind-event-back fas fa-chevron-left"></i>
      </Link>

      <p className="title">Login</p>
      {msg}

      <form onSubmit={login}>
        <div className="login-info">
          <input
            name="uid"
            type="text"
            value={email}
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            name="password"
            type="text"
            value={password}
            placeholder="password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          <div className="buttons">
            <Link to="/register">
              <button className="sign-up">Sign Up</button>
            </Link>
            <button type="submit" className="login-button">
              Login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
