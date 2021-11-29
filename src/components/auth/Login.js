import React, { useCallback, useEffect, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import useSimpleAuth from "./useSimpleAuth"
import Settings from "../Settings"
import "./Auth.css"

export const Login = () => {
    const invalidDialog = useRef()
    const [c, set] = useState({ username: "steve@stevebrownlee.com", password: "Admin8*" })
    const history = useHistory()
    const [token, setToken] = useState(null)
    const [profile, updateProfile] = useState({})
    const { login, storeCurrentUser, logout } = useSimpleAuth()

    const getProfile = useCallback((token) => {
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
        else {
            logout()
        }
    }, [logout, updateProfile]);

    const storeProfile = useCallback((profile) => {
        storeCurrentUser(token, profile)
        history.push("/")
    }, [history, storeCurrentUser, token]);


    useEffect(() => {
        getProfile(token)
    }, [token])


    useEffect(() => {
        if ("person" in profile) {
            storeProfile(profile)
        }
    }, [profile, storeProfile])


    const cycle = e => {
        const copy = { ...c }
        copy[e.target.name] = e.target.value
        set(copy)
    }

    const handleLogin = (e) => {
        e.preventDefault()

        login(c.username, c.password)
            .then(res => {
                if ("token" in res) {
                    setToken(res.token)
                }
                invalidDialog.current.showModal()
            })
    }

    return (
        <main className="container--login">
            <dialog className="dialog dialog--auth" ref={invalidDialog}>
                <div>Email or password was not valid.</div>
                <button className="button--close" onClick={e => invalidDialog.current.close()}>Close</button>
            </dialog>
            <section>
                <form className="form--login" onSubmit={handleLogin}>
                    <h1>NSS Learn Ops</h1>
                    <h2>Please sign in</h2>
                    <fieldset>
                        <label htmlFor="inputEmail"> Email address </label>
                        <input type="email" name="username"
                            className="form-control"
                            defaultValue={c.username}
                            placeholder="Email address"
                            required autoFocus
                            onChange={cycle} />
                    </fieldset>
                    <fieldset>
                        <label htmlFor="inputPassword"> Password </label>
                        <input type="password" name="password"
                            className="form-control"
                            defaultValue={c.password}
                            placeholder="Password" required
                            onChange={cycle} />
                    </fieldset>
                    <fieldset style={{
                        textAlign: "center"
                    }}>
                        <button className="btn btn-1 btn-sep icon-send" type="submit">Sign In</button>
                    </fieldset>
                </form>
            </section>
            <section className="link--register">
                <Link to="/register">Not a member yet?</Link>
            </section>
        </main>
    )
}
