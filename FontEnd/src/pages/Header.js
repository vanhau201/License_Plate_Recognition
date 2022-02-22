import "../styles/Header.css"
import { Link, NavLink } from "react-router-dom"
import { useSelector } from 'react-redux';
import { logout } from "../redux/Actions"
import { useDispatch } from 'react-redux';


function Header() {

    const user = useSelector(state => state.user)
    const dispatch = useDispatch()

    const handleLogout = () => {
        localStorage.removeItem("authTokens")
        dispatch(logout(null))
        // navigate("/login")

    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark pl-5">
                <Link className="navbar-brand" to="/" >𝓛𝓲𝓬𝓮𝓷𝓼𝓮 𝓟𝓵𝓪𝓽𝓮 𝓡𝓮𝓬𝓸𝓰𝓷𝓲𝓽𝓲𝓸𝓷</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarTogglerDemo02"
                    aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
                    <ul className="navbar-nav mr-auto mt-2 ml-5 mt-lg-0">
                        <li className="nav-item">
                            <NavLink id="home" className="nav-link" to="/">Home <span className="sr-only"></span></NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="statistics">Statistics</NavLink>
                        </li>

                    </ul>
                    <ul className="navbar-nav mt-2 mt-lg-0 ml-5 mr-4">
                        <li className="nav-item mr-3">
                            <i className="nav-link active">Hi, {user.username} </i>
                        </li>
                        <li className="nav-item">
                            <Link style={{ cursor: 'pointer' }} className="nav-link active" to="" onClick={handleLogout}><i className="fas fa-sign-out-alt"></i> Logout</Link>
                        </li>

                    </ul>


                </div>
            </nav>
        </div>
    );
}

export default Header;
