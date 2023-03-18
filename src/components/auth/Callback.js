import React, { useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"
import useSimpleAuth from "./useSimpleAuth"
import Settings from "../Settings"
import "./Auth.css"

export const Callback = () => {
    const [code, setCode] = useState("")
    const [cohort, setCohort] = useState(0)
    const [validate, setValidate] = useState(0)
    const [token, storeToken] = useState("")
    const location = useLocation()
    const history = useHistory()
    const { getProfile } = useSimpleAuth()

    const fetchUser = () => {
        getProfile(token, cohort, validate).then(() => history.push("/"))
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
        <article>
            You are now authorized via Github. Redirecting you to the Learning Platform home page.
        </article>
    )
}
