import React, { useCallback, useEffect, useRef, useState } from "react"
import Settings from "../Settings"
import "./Auth.css"
import { useLocation, useParams } from "react-router-dom/cjs/react-router-dom.min"

export const Callback = () => {
    const [code, set] = useState("")
    const location = useLocation()

    const fetchUser = (res) => {
        fetch("http://localhost:8000/auth/user/", {
            method: "GET",
            headers: {
                "Authorization": `Token ${res.key}`,
                "Accept": "application/json"
            }
        })
            .then(response => response.json())
            .then(console.log)
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
    }

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const accessCode = params.get("code")
        if (accessCode) {
            set(accessCode)
        }

    }, [])

    useEffect(() => {
        if (code) {
            fetchTokenWithCode(code)
                .then(fetchUser)
        }
    }, [code])

    return (
        <article>
            Access code: {code}
        </article>
    )
}
