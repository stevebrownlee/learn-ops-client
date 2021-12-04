import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Logout from "./logout.png"
import useSimpleAuth from "../auth/useSimpleAuth"
import "./NavBar.css"

export const NavBar = () => {
    const history = useHistory()
    const [checked, setChecked] = useState("")
    const { logout, isAuthenticated } = useSimpleAuth()

    const makeLink = (to, text) => {
        return <Link className="navbar__link" to={to} onClick={() => setChecked("")}>{text}</Link>
    }

    return (
        <nav className="navbar">
            <ul className="nav-links">
                <input type="checkbox" checked={checked} onClick={() => checked ? setChecked("") : setChecked("checked")} id="checkbox_toggle" />
                <label for="checkbox_toggle" class="hamburger">&#9776;</label>


                <div class="menu">
                    <li className="navbar__item">
                        {makeLink("/", "Overview")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/records", "Learning Records")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/candidate", "Candidates")}
                    </li>
                    {
                        isAuthenticated()
                            ? <li className="navbar__item navbar__logout">
                                <img alt="Project logo" className="img--logout" src={Logout}
                                    onClick={() => {
                                        logout()
                                        history.push({ pathname: "/" })
                                    }}
                                />
                            </li>
                            : ""
                    }
                </div>
            </ul>


            {/* <li className="navbar__item">
                    <Link className="navbar__link" to="/">Overview</Link>
                </li>
                <li className="navbar__item">
                    <Link className="navbar__link" to="/records">Records</Link>
                </li>
                <li className="navbar__item">
                    <Link className="navbar__link" to="/candidates">Candidates</Link>
                </li>
                {
                    isAuthenticated()
                        ? <li className="nav-item navbar__logout">
                            <img alt="Project logo" className="img--logout" src={Logout}
                                onClick={() => {
                                    logout()
                                    history.push({ pathname: "/" })
                                }}
                            />
                        </li>
                        : ""
                } */}
        </nav>
    )
}
