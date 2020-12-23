import React, { useState } from "react";
import "./App.css";
import Axios from "axios";

function App() {
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerContact, setRegisterContact] = useState("");
  const [registerCollege, setRegisterCollege] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [data, setData] = useState(null);
  const [msg, setMsg] = useState("");
  const register = () => {
    Axios({
      method: "POST",
      data: {
        email: registerEmail,
        password: registerPassword,
        name: registerName,
        contact: Number(registerContact).valueOf(),
        college: registerCollege,
      },
      withCredentials: true,
      url: "http://localhost:5000/api/register/mail",
    }).then((res) => {
      console.log(res);
      setMsg(res.data);
    });
  };
  const login = () => {
    Axios({
      method: "POST",
      data: {
        email: loginEmail,
        password: loginPassword,
      },
      withCredentials: true,
      url: "http://localhost:5000/api/login",
    }).then((res) => {
      console.log(res);
      setMsg(res.data);
    });
  };
  const getUser = () => {
    Axios({
      method: "GET",
      withCredentials: true,
      url: "http://localhost:5000/api/user",
    }).then((res) => {
      setData(res.data);
      console.log(res.data);
    });
  };
  return (
    <div className="App">
      <div>
        <h1>Register</h1>
        <input
          placeholder="email"
          onChange={(e) => setRegisterEmail(e.target.value)}
        />
        <input
          placeholder="Name"
          onChange={(e) => setRegisterName(e.target.value)}
        />
        <input
          placeholder="Contact"
          onChange={(e) => setRegisterContact(e.target.value)}
        />
        <input
          placeholder="College"
          onChange={(e) => setRegisterCollege(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setRegisterPassword(e.target.value)}
        />
        <button onClick={register}>Submit</button>
      </div>
      {msg}
      <div>
        <h1>Login</h1>
        <input
          placeholder="email"
          onChange={(e) => setLoginEmail(e.target.value)}
        />
        <input
          placeholder="password"
          onChange={(e) => setLoginPassword(e.target.value)}
        />
        <button onClick={login}>Submit</button>
      </div>

      <div>
        <h1>Get User</h1>
        <button onClick={getUser}>Submit</button>
        {data ? <h1>Welcome Back {data.email}</h1> : null}
      </div>
    </div>
  );
}

export default App;
