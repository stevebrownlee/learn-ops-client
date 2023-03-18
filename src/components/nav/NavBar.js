import React, { useState } from "react"
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
                <input type="checkbox" checked={checked} onChange={() => checked ? setChecked("") : setChecked("checked")} id="checkbox_toggle" />
                <label htmlFor="checkbox_toggle" className="hamburger">&#9776;</label>


                <div className="menu">
                    <li className="navbar__item">
                        {makeLink("/", "Overview")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/teams", "Weekly Teams")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/cohorts", "Cohorts")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/assessments", "Assessments")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/projects", "Projects")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/books", "Books")}
                    </li>
                    <li className="navbar__item">
                        {makeLink("/courses", "Courses")}
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
        </nav>
    )
}
