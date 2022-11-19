import React, { useCallback, useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useHistory } from "react-router-dom"
import { CohortContext } from "../cohorts/CohortProvider.js"
import Settings from "../Settings.js"
import "./Auth.css"
import useSimpleAuth from "./useSimpleAuth.js"


export const Register = (props) => {
    const [user, set] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        verifyPassword: "",
        cohort: 0,
        slackHandle: "",
        githubHandle: ""
    })
    const { getCohorts, cohorts } = useContext(CohortContext)
    const history = useHistory()
    const { storeCurrentUser } = useSimpleAuth()
    const [token, setToken] = useState(null)
    const [profile, updateProfile] = useState({})

    const passwordDialog = React.createRef()

    useEffect(() => {
        getCohorts()
        // eslint-disable-next-line
    }, [])

    const storeProfile = useCallback((profile) => {
        storeCurrentUser(token, profile)
        history.push("/")
    }, [history, storeCurrentUser, token]);

    useEffect(() => {
        if ("person" in profile) {
            storeProfile(profile)
        }
    }, [profile, storeProfile])

    useEffect(() => {
        if (token) {
            fetch(`${Settings.apiHost}/profile`, {
                method: "GET",
                headers: {
                    Authorization: `Token ${token}`
                }
            })
                .then(res => res.json())
                .then(updateProfile)
        }
    }, [token])

    const cycle = e => {
        const copy = { ...user }
        copy[e.target.id] = e.target.value
        set(copy)
    }

    const handleRegister = (e) => {
        e.preventDefault()

        if (user.password === user.verifyPassword) {
            const newUser = {
                username: user.email,
                first_name: user.firstName,
                last_name: user.lastName,
                email: user.email,
                password: user.password,
                cohort: user.cohort,
                slackHandle: user.slackHandle,
                githubHandle: user.githubHandle
            }

            return fetch(`${Settings.apiHost}/accounts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(newUser)
            })
                .then(res => res.json())
                .then(res => {
                    if ("token" in res) {
                        setToken(res.token)
                    }
                })
        } else {
            passwordDialog.current.showModal()
        }
    }

    return (
        <main style={{ textAlign: "center" }}>

            <dialog className="dialog dialog--password" ref={passwordDialog}>
                <div>Passwords do not match</div>
                <button className="button--close" onClick={e => passwordDialog.current.close()}>Close</button>
            </dialog>

            <form className="form--login" onSubmit={handleRegister}>
                <h1 className="h3 mb-3 font-weight-normal">Register an account</h1>
                <fieldset>
                    <label htmlFor="firstName"> First Name </label>
                    <input onChange={cycle} value={user.firstName} type="text" id="firstName" className="form-control" placeholder="First name" required autoFocus />
                </fieldset>
                <fieldset>
                    <label htmlFor="lastName"> Last Name </label>
                    <input onChange={cycle} value={user.lastName} type="text" id="lastName" className="form-control" placeholder="Last name" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="email"> Email address </label>
                    <input onChange={cycle} value={user.email} type="email" id="email" className="form-control" placeholder="Email address" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="slackHandle"> Slack user name </label>
                    <input onChange={cycle} value={user.slackHandle} type="text" id="slackHandle" className="form-control" placeholder="Your Slack user name" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="githubHandle"> Github user name </label>
                    <input onChange={cycle} value={user.githubHandle} type="text" id="githubHandle" className="form-control" placeholder="Your Github user name" required />
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <select id="cohort" className="form-control"
                            value={user.cohort}
                            onChange={cycle}>
                            <option value="0">Which cohort are you in?</option>
                            {
                                cohorts.map(cohort => (
                                    <option key={cohort.id} value={cohort.id}> {cohort.name} </option>
                                ))
                            }
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <label htmlFor="inputPassword"> Password </label>
                    <input onChange={cycle} value={user.password} type="password" id="password" className="form-control" placeholder="Password" required />
                </fieldset>
                <fieldset>
                    <label htmlFor="verifyPassword"> Verify Password </label>
                    <input onChange={cycle} value={user.verifyPassword} type="password" id="verifyPassword" className="form-control" placeholder="Verify password" required />
                </fieldset>
                <fieldset style={{
                    textAlign: "center"
                }}>
                    <button className="btn btn-1 btn-sep icon-send" type="submit">Register</button>
                </fieldset>
            </form>
            <section className="link--register">
                Already registered? <Link to="/login">Login</Link>
            </section>
        </main>
    )
}
