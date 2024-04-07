import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import simpleAuth from "./simpleAuth"
import Settings from "../Settings"
import "./Auth.css"

export const Callback = () => {
    const [code, setCode] = useState("")
    const [cohort, setCohort] = useState(0)
    const [validate, setValidate] = useState(0)
    const [token, storeToken] = useState("")
    const location = useLocation()
    const history = useHistory()
    const { getProfile } = simpleAuth()

    const fetchUser = async () => {
        const response = await getProfile(token, cohort, validate)
        setTimeout(() => {
            history.push("/")
        }, 1000);
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
        if (params.get("code")) {
            setCode(accessCode)
        }

        const studentCohort = params.get("cohort")
        if (studentCohort) {
            setCohort(parseInt(studentCohort))
        }

        const validationFlag = params.get("validate")
        if (validationFlag) {
            setValidate(parseInt(validationFlag))
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
        <article style={{
            margin: 0,
            padding: 0,
            height: "100%", /* Ensures that the body takes the full viewport height */
            display: "flex",
            flexDirection: "column",
            justifyContent: "start", /* Centers horizontally */
            alignItems: "center", /* Centers vertically */
            backgroundColor: "#072137"
        }}>

            <div style={{color: "snow", padding: "0 0 5rem 0"}}>
                <h1>Authorization complete</h1>
                <div>🚀 Engaging warp drive to Learning Platform</div>
            </div>
            <div className="container">
                <div className="clouds"></div>
                <div className="planet">
                </div>
                <div className="moon"></div>
                <div className="up"></div>
            </div>

        </article>
    )
}
