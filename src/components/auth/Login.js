import React from "react"
import Settings from "../Settings"
import "./Auth.css"
import logo from "./learning-platform.png"

export const Login = () => <article className="container--login">
    <div>
        <img style={{ maxHeight: "25rem" }} src={logo} />
    </div>

    <a href={`${Settings.apiHost}/auth/github/url`} className="button bg-2 button--size-m button--round-m button--border-medium btn-github ">
        <i className="fa fa-github"></i> Sign in with Github
    </a>
</article>
