import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom/cjs/react-router-dom.min"
import useSimpleAuth from "./useSimpleAuth"
import Settings from "../Settings"
import "./Auth.css"

export const Callback = () => {
    const [code, set] = useState("")
    const [token, storeToken] = useState("")
    const location = useLocation()
    const history = useHistory()
    const { getProfile } = useSimpleAuth()

    const fetchUser = () => {
        getProfile(token).then(() => history.push("/"))
    }

    const fetchTokenWithCode = (accessCode) => {
        return fetch(`${Settings.apiHost}/auth/github`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({ code: accessCode })
        })
            .then(response => response.json())
            .then(res => {
                storeToken(res.key)
            })
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const accessCode = params.get("code")
        if (accessCode) {
            set(accessCode)
        }

    }, [])

    useEffect(() => {
        if (token) {
            fetchUser()
        }
    }, [token])

    useEffect(() => {
        if (code) {
            fetchTokenWithCode(code)
        }
    }, [code])

    return (
        <article>
            Access code: {code}
        </article>
    )
}
