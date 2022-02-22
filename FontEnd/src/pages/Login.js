import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Apis, { endpoints } from '../configs/Apis';
import jwtDecode from 'jwt-decode';
import "../styles/Login.css"
import { useDispatch } from 'react-redux';
import { login, addToken } from '../redux/Actions'
import { useNavigate } from 'react-router-dom';


function Login() {

    const [username, setUserName] = useState()
    const [password, setPassWord] = useState()
    const messageRef = useRef()
    const [flag, setFlag] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()
        if (username && password) {

            try {
                const res = await Apis.post(endpoints["token"], { "username": username, "password": password })
                if (res.status === 200) {

                    dispatch(login(jwtDecode(res.data.access)))
                    dispatch(addToken(res.data))
                    localStorage.setItem('authTokens', JSON.stringify(res.data))
                    // setFlag(false)
                    // messageRef.current.innerText = ""
                    navigate("/")
                }
            }
            catch (err) {
                setFlag(true)
                messageRef.current.innerText = "Incorrect account or password"
            }
        }
        else {
            setFlag(true)
            messageRef.current.innerText = "Username and password cannot be empty"
        }





    }





    return (
        <div className="root">
            <div className="card-login">
                <div className="form-login">
                    <h2>Login</h2>
                    <form action="" onSubmit={handleLogin}>

                        <div>
                            <label htmlFor="">Username</label>
                            <input type="text" name="username" onChange={(e) => setUserName(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="">Password</label>
                            <input type="password" name="password" autoComplete='on' onChange={(e) => setPassWord(e.target.value)} />
                        </div>
                        <div className='message'>
                            {
                                flag ? "" : <br />
                            }

                            <span ref={messageRef}>  </span>

                        </div>
                        <div>
                            <button type='submit'>Login</button>
                        </div>
                        <div>
                            <p>Don't have an account ? <Link to="/register">Register here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login;
