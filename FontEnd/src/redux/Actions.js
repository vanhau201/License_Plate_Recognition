export const login = (data) => {
    return {
        type: "USER_LOGIN",
        payload: data

    }
}
export const addToken = (data) => {
    return {
        type: "ADD_TOKEN",
        payload: data

    }
}
export const logout = (data) => {
    return {
        type: "USER_LOGOUT",
        payload: data
    }
}

export const addData = (data) => {
    return {
        type: "ADD_DATA",
        payload: data
    }
}

