import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css";
// import Sky from "./sky.svg";
// import Sand from "./sands.svg";
// import Building from "./buildings.svg";
import Axios from "axios";
function MainRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [contact, setContact] = useState("");
  const [msg, setMsg] = useState("");

  const register = (e) => {
    e.preventDefault();
    Axios({
      method: "POST",
      data: {
        email: email,
        password: password,
        name: name,
        contact: Number(contact).valueOf(),
        college: college,
      },
      withCredentials: true,
      url: "http://localhost:5000/api/register/mail",
    }).then((res) => {
      console.log(res);
      setMsg(res.data);
    });
  };
  return (
    <div className="register-div">
      {/* <img src={Sky} className="sky"/>
        <img src={Sand} className="sand"/>
        <img src={Building} className="building"/> */}
      <Link to="/">
        <i className="ind-event-back fas fa-chevron-left"></i>
      </Link>

      <p className="title">Cepheus Registration</p>
      {msg}
      <form onSubmit={register}>
        <div className="registration-form">
          <input
            name="Name"
            type="text"
            value={name}
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />

          <input
            name="Email"
            type="text"
            value={email}
            placeholder="email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            name="college"
            type="text"
            value={college}
            placeholder="college"
            onChange={(e) => {
              setCollege(e.target.value);
            }}
          />
          <input
            name="contact"
            type="text"
            value={contact}
            placeholder="Contact"
            onChange={(e) => {
              setContact(e.target.value);
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
          <button type="submit" className="sign-up">
            Sign Up
          </button>
          <Link to="/login">
            <button className="sign-up">Login</button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export default MainRegister;
