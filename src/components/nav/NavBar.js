import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import "./NavBar.css"
import Logo from "./levelup.png"
import { AppContext } from "../ApplicationStateProvider.js"

export const NavBar = () => {
    const history = useHistory()
    const { getUserInfo } = useContext(AppContext)
    const [ name, setName ] = useState("Unknown")

    useEffect(
        () => {
            const info = getUserInfo()

            if ("name" in info && info.name !== null) {
                setName(info.name)
            }
            else if (localStorage.getItem("lu_name") !== null) {
                setName(localStorage.getItem("lu_name"))
            }
        },
        []
    )


    return (
        <ul className="navbar">
            <li className="navbar__item">
                <img src={Logo} />
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/">Games</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/events">Events</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/profile">Profile</Link>
            </li>
            {
                (localStorage.getItem("nss_token") !== null) ?
                    <li className="nav-item">
                        <button className="nav-link fakeLink"
                            onClick={() => {
                                localStorage.removeItem("nss_token")
                                localStorage.removeItem("lu_name")
                                history.push({ pathname: "/" })
                            }}
                        >Logout { name }
                        </button>
                    </li> :
                    <>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/register">Register</Link>
                        </li>
                    </>
            }
        </ul>
    )
}
