import { useNavigate } from "react-router-dom";
import "../css/Navbar.css"

export default function Navbar(){

    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-logo"></div>
            
            <div className="nav-left">
                <a href="#whatwedo">What We Do</a>
                <a href="#skills">Skills</a>
                <a href="#progress">Progress</a>
            </div>

            <div className="nav-right">
                <a href="#" className="log-in" onClick={() => navigate("/Login")}>Log In</a>
                <a href="#" className="sign-up" onClick={()=> navigate("/Signup")}>Sign Up</a>
            </div>
        </nav>
    )

}