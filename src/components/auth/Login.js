import React, { useRef, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "./useSimpleAuth"
import Settings from "../Settings"
import "./Auth.css"

export const Login = () => {
    const invalidDialog = useRef()
    const history = useHistory()
    const [token, setToken] = useState(null)
    const [profile, updateProfile] = useState({})
    const { login, storeCurrentUser, logout } = useSimpleAuth()


    return (
        <article className="container--login">
            <h1>NSS Learn Ops</h1>
            <a href={`${Settings.apiHost}/auth/github/url`} className="button bg-2 button--size-l button--round-m button--border-medium btn-github ">
                <i className="fa fa-github"></i> Sign in with Github
            </a>
        </article>
    )
}
