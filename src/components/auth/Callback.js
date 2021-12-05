import React, { useCallback, useEffect, useRef, useState } from "react"
import Settings from "../Settings"
import "./Auth.css"
import { useHistory, useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min"
import useSimpleAuth from "./useSimpleAuth"

export const Callback = () => {
    const [code, set] = useState("")
    const [token, storeToken] = useState("")
    const location = useLocation()
    const history = useHistory()
    const { storeCurrentUser } = useSimpleAuth()

    const fetchUser = () => {
        fetch("http://localhost:8000/auth/user/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${token}`,
                "Accept": "application/json"
            }
        })
            .then(response => response.json())
            .then((profile) => {
                storeCurrentUser(token, profile)
                history.push("/")
            })
    }

    const fetchTokenWithCode = (accessCode) => {
        return fetch(`http://localhost:8000/auth/github`, {
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
