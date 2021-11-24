import React, { useState } from "react"
import Settings from "./Settings.js"

export const AppContext = React.createContext()

export const AppProvider = (props) => {
    const [userInfo, setInfo] = useState({
        token: null
    })

    const getUserInfo = () => {
        return {...userInfo}
    }

    const authenticate = (credentials) => {
        return fetch(`${Settings.apiHost}/accounts/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({
                username: credentials.username,
                password: credentials.password
            })
        })
            .then(res => res.json())
            .then(res => {
                if ("token" in res) {
                    localStorage.setItem("nss_token", res.token)

                    const info = getUserInfo()
                    info.token = res.token
                    setInfo(info)

                    return true
                }

                return false
            })
    }

    return (
        <AppContext.Provider value={{
            getUserInfo,
            authenticate
        }} >
            { props.children}
        </AppContext.Provider>
    )
}
