import { useState, useContext, useEffect } from "react";
import { Link as ScrollLink, animateScroll as scroll } from "react-scroll";
import User from "/src/BackEnd/User";
import { UserContext } from "/src/App";
import { Link } from "react-router-dom";

export default function Header() {
  const { connected, setConnected } = useContext(UserContext);
  const [showNav, setShowNav] = useState(false);

  const handleLogout = () => {
    setConnected(false);
    User.deConnecter();
    localStorage.removeItem("user");
  };

  const ShowCompteStatus = () => {
    // TOFIX : not working
    //if (window.location.pathname == "/Login") return <></>;
    if (!connected)
      return (
        <>
          <Link className="nav-link" to="/Login">
            Login
          </Link>
        </>
      );
    else
      return (
        <Link className="nav-link" to="/Profile">
          Profile
        </Link>
      );
  };

  return (
    <>
      <header className="header_section">
        <div className="container">
          <nav className="navbar navbar-expand-lg custom_nav-container ">
            <Link className="navbar-brand" to="/">
              <img
                src="src\Imgs\CodeKids-erased.png"
                alt=""
                className="img-fluid"
                style={{ width: "100%", maxWidth: "100px", maxHeight: "100px" }}
              />
              <span>CodeKids-Learning</span>
            </Link>
            <button
              className={
                showNav ? "navbar-toggler" : "navbar-toggler collapsed"
              }
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded={showNav}
              aria-label="Toggle navigation"
              onClick={() => setShowNav(!showNav)}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className={
                !showNav
                  ? "collapse navbar-collapse"
                  : "collapse navbar-collapse show"
              }
              id="navbarSupportedContent"
            >
              <div className="d-flex ml-auto flex-column flex-lg-row align-items-center">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <ScrollLink className="nav-link" to="home" smooth={true} duration={500}>Home</ScrollLink>
                  </li>
                  <li className="nav-item">
                    <ScrollLink className="nav-link" to="about" smooth={true} duration={500}>About Us</ScrollLink>
                  </li>
                  <li className="nav-item">
                    <ScrollLink className="nav-link" to="teachers" smooth={true} duration={500}>Teachers</ScrollLink>
                  </li>
                  <li className="nav-item">
                    <ScrollLink className="nav-link" to="rules" smooth={true} duration={500}>Rules</ScrollLink>
                  </li>
                  <li className="nav-item">
                    <ScrollLink className="nav-link" to="contact" smooth={true} duration={500}>Contact</ScrollLink>
                  </li>
                  <li className="nav-item">
                    <ShowCompteStatus />
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div >
      </header >
    </>
  );
}
