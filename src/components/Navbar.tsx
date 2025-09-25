import "../css/Navbar.css"

export default function Navbar(){
    return (
        <nav className="navbar">
            <div className="navbar-logo"></div>
            
            <div className="nav-left">
                <a href="#whatwedo">What We Do</a>
                <a href="#skills">Skills</a>
                <a href="#progress">Progress</a>
            </div>

            <div className="nav-right">
                <a href="#" className="log-in">Log In</a>
                <a href="#" className="sign-up">Sign Up</a>
            </div>
        </nav>
    )

}