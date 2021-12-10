import React from "react"
import Settings from "../Settings"
import "./Auth.css"

console.log(Settings)

export const Login = () => <article className="container--login">
    <h1>NSS Learn Ops</h1>
    <a href={`${Settings.apiHost}/auth/github/url`} className="button bg-2 button--size-l button--round-m button--border-medium btn-github ">
        <i className="fa fa-github"></i> Sign in with Github
    </a>
</article>
