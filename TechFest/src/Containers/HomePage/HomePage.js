import React, { useEffect, useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import "./HomePage.css";
import sky from "./sky.svg";
import buildings from "./buildings.svg";
import sand from "./sands.svg";
import iitgoaLogo from "./IIT-Goa-Logo-White.svg";
import cepheusLogo from "./cepheus-logo-2.svg";
import moonLogo from "./moon.svg";
import NavbarTwo from "../../Components/NavbarTwo/NavbarTwo";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

function HomePage() {
  const [showNav, setShowNav] = useState(false);
  const [auth, setAuth] = useState({
    auth: "false",
  });

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/auth", { withCredentials: true })
      .then((res) => {
        console.log(res.data);
        setAuth(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }, []);

  const showNavbar = () => {
    setShowNav(!showNav);
  };

  return (
    <div id="home-page" className="home-page">
      <div className={`navbar-two ${showNav && "active"}`}>
        <div onClick={showNavbar} className="nav-cross-div">
          <i className="fas fa-times nav-cross"></i>
        </div>
        <NavbarTwo />
      </div>

      <div className="top-bar">
        <img className="iitgoa-top" src={iitgoaLogo} alt="" />
        <div className="nav-white-line"></div>
        <img className="cepheus-top" src={cepheusLogo} alt="" />
        <img onClick={showNavbar} className="moon-logo" src={moonLogo} alt="" />
      </div>
      <Navbar />
      <div className="image-container-home">
        <motion.img
          initial={{ opacity: 0, y: "-100vh" }}
          animate={{ opacity: 0.1, y: "0" }}
          transition={{ duration: 1 }}
          className="sky-img"
          src={sky}
          alt=""
        />
        {auth.auth === "false" ? (
          <div className="auth-buttons">
            <Link to="/register">
              <button>Sign Up</button>
            </Link>

            <Link to="/login">
              <button>Login</button>
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/">
              <button>Logout</button>
            </Link>
          </div>
        )}
        <motion.img
          initial={{ x: "-100vw", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          src={sand}
          className="sand-img"
          alt=""
        />
        <div className="buildings-div">
          <motion.img
            initial={{ x: "100vw", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
            className="buildings-img"
            src={buildings}
            alt=""
          />
        </div>
      </div>
    </div>
  );
}

export default HomePage;
