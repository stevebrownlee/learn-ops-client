import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Logo from "./learnops.png"
import useSimpleAuth from "../auth/useSimpleAuth"
import "./NavBar.css"

export const NavBar = () => {
    const history = useHistory()
    const [name, setName] = useState("Unknown")
    const { getCurrentUser, logout, isAuthenticated } = useSimpleAuth()

    useEffect(
        () => {
            const user = getCurrentUser()
            setName(user.profile.person.first_name)
        }, []
    )


    return (
        <ul className="navbar">
            <li className="navbar__item">
                <img className="navbar__logo" src={Logo} />
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/">Overview</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/students">Students</Link>
            </li>
            <li className="navbar__item">
                <Link className="navbar__link" to="/candidates">Candidates</Link>
            </li>
            {
                isAuthenticated()
                    ? <li className="nav-item">
                        <button className="nav-link fakeLink"
                            onClick={() => {
                                logout()
                                history.push({ pathname: "/" })
                            }}
                        >Logout {name}
                        </button>
                    </li>
                    : <>
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
