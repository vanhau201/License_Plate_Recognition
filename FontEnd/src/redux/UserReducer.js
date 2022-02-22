
import jwtDecode from "jwt-decode"
const initState = {
    "user": localStorage.getItem("authTokens") ? jwtDecode(localStorage.getItem("authTokens")) : null,
    "authTokens": localStorage.getItem("authTokens") ? JSON.parse(localStorage.getItem("authTokens")) : null
}

const userReducer = (state = initState, action) => {
    switch (action.type) {
        case "USER_LOGIN":
            return { ...state, user: action.payload }

        case "ADD_TOKEN":
            return { ...state, authTokens: action.payload }

        case "USER_LOGOUT":
            return { ...state, user: action.payload }

        default:
            return state
    }
}

export default userReducer