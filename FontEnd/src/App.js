import "./App.css"
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Login from './pages/Login';
import Register from './pages/Register';
import Body from './pages/Body';
import Home from './pages/Home'
import Statistics from './pages/Statistics'
import { useSelector } from "react-redux";

function App() {

    const user = useSelector(state => state.user)
    // const user = false

    return (
        <div className="App">

            <Router>
                <Routes>
                    <Route element={user ? <Body /> : <Navigate to={"/login"} />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/statistics' element={<Statistics />} />
                    </Route>
                    <Route path='/login' element={!user ? <Login /> : <Navigate to={"/"} />} />
                    <Route path='/register' element={<Register />}></Route>
                </Routes>

            </Router>


        </div>
    );
}

export default App;
