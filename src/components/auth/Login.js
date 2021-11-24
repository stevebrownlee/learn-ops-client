import React, { useContext, useRef, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { AppContext } from "../ApplicationStateProvider.js"
import "./Auth.css"

export const Login = () => {
    const invalidDialog = useRef()
    const [c, set] = useState({ username: "me@me.com", password: "Admin8*" })
    const history = useHistory()
    const { authenticate } = useContext(AppContext)

    const cycle = e => {
        const copy = {...c}
        copy[e.target.name] = e.target.value
        set(copy)
    }

    const handleLogin = (e) => {
        e.preventDefault()

        authenticate(c)
            .then(success => {
                if (!success) {
                    invalidDialog.current.showModal()
                } else {
                    history.push("/")
                }
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
                        textAlign:"center"
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
