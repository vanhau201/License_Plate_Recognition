import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "../styles/Register.css"
import Apis, { endpoints } from '../configs/Apis'


const Register = () => {
    const [username, setUsername] = useState()
    const [email, setEmail] = useState()
    const [password, setPassword] = useState()
    const [cfmPassword, setCfmPassword] = useState()
    const [flag, setFlag] = useState(false)
    const messageRef = useRef()
    const navigate = useNavigate()


    const handleRegister = async (e) => {
        e.preventDefault()

        if (username && email && password && cfmPassword) {
            if (password.length >= 8) {
                if (password === cfmPassword) {
                    const data = {
                        "username": username,
                        "email": email,
                        "password": password
                    }

                    try {
                        let res = await Apis.post(endpoints['register'], data)
                        if (res.status === 200) {
                            setFlag(false)
                            messageRef.current.innerText = ""
                            alert("Register successfull")
                            navigate("/login")
                        }
                    }
                    catch (err) {
                        if (err.response.status === 400) {
                            setFlag(true)
                            messageRef.current.innerText = "Account already exists"
                        }
                    }

                }
                else {
                    setFlag(true)
                    messageRef.current.innerText = "Confirm password is incorrect"
                }
            }
            else {
                setFlag(true)
                messageRef.current.innerText = "Password length must be at least 8 characters"
            }

        }
        else {
            setFlag(true)
            messageRef.current.innerText = "Can't be empty"
        }



    }

    return (
        <div className="root">
            <div className="card-register">
                <div className="form-register">
                    <h2>Register</h2>
                    <form action="" onSubmit={handleRegister}>

                        <div>
                            <label htmlFor="">Username</label>
                            <input type="text" name="username" onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="">Email</label>
                            <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="">Password</label>
                            <input type="password" name="password1" autoComplete='on' onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="">Confirm Password</label>
                            <input type="password" name="password2" autoComplete='on' onChange={(e) => setCfmPassword(e.target.value)} />
                        </div>
                        <div className='message'>
                            {
                                flag ? "" : <br />
                            }
                            <span ref={messageRef}>  </span>

                        </div>
                        <div>
                            <button type='submit'>Register</button>
                        </div>
                        <div>
                            <p>Already have an account ? <Link to="/login">Login here</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register