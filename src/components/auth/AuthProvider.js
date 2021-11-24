import React, { useState } from "react"
import Settings from "../Settings.js"

export const ProfileContext = React.createContext()

export const ProfileProvider = (props) => {
    const [profile, setProfile] = useState({events:[]})

    const getProfile = () => {
        return fetch(`${Settings.apiHost}/profile`, {
            headers: {
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(response => response.json())
            .then(setProfile)
    }

    return (
        <ProfileContext.Provider value={{
            profile, getProfile
        }}>
            {props.children}
        </ProfileContext.Provider>
    )
}
