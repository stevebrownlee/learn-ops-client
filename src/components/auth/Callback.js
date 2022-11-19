import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
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
            .then(response => {
                if (response.status === 200) {
                    return response.json()
                }
                throw { message: "Server error", statusCode: response.status }
            })
            .then(res => {
                storeToken(res.key)
            })
            .catch((msg) => {
                console.log(msg)
            })
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const accessCode = params.get("code")
        if (accessCode) {
            set(accessCode)
        }

    }, [location.search])

    useEffect(() => {
        if (token) {
            fetchUser()
        }
    }, [token, fetchUser])

    useEffect(() => {
        if (code) {
            fetchTokenWithCode(code)
        }
    }, [code])

    return (
        <article>
            You are now authorized via Github. Redirecting you to the Learning Platform home page.
        </article>
    )
}
