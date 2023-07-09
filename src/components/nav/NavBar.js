import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"
import Logout from "./logout.png"
import logo from "./nav-logo.png"
import useSimpleAuth from "../auth/useSimpleAuth"
import { SettingsIcon } from "../../svgs/SettingsIcon.js"
import useModal from "../ui/useModal.js"
import "./NavBar.css"
import { SettingsDialog } from "../people/SettingsDialog.js"

export const NavBar = ({ mimic, changeMimic, isStaff }) => {
    const history = useHistory()
    const [checked, setChecked] = useState("")
    const { logout, isAuthenticated } = useSimpleAuth()
    let { toggleDialog: toggleSettings } = useModal("#dialog--settings")

    const makeLink = (to, text) => {
        return <Link className="navbar__link" to={to} onClick={() => setChecked("")}>{text}</Link>
    }

    return (
        <>
            <nav className="navbar">
                <ul className="nav-links">
                    <input type="checkbox" checked={checked} onChange={() => checked ? setChecked("") : setChecked("checked")} id="checkbox_toggle" />
                    <label htmlFor="checkbox_toggle" className="hamburger">&#9776;</label>


                    <div className="menu">
                        <li className="navbar__logo">
                            <img style={{ maxHeight: "30px" }} src={logo} />
                        </li>
                        <li className="navbar__item">
                            {makeLink("/", "Students")}
                        </li>
                        <li className="navbar__item">
                            {makeLink("/teams", "Weekly Teams")}
                        </li>
                        <li className="navbar__item">
                            {makeLink("/cohorts", "Cohorts")}
                        </li>
                        <li className="navbar__item">
                            {makeLink("/courses", "Course Management")}
                        </li>
                        {
                            isAuthenticated()
                                ? <>
                                    <li className="navbar__item navbar__logout">
                                        <SettingsIcon clickFunction={toggleSettings} />
                                        <img alt="Project logo" className="img--logout" src={Logout}
                                            onClick={() => {
                                                logout()
                                                history.push({ pathname: "/" })
                                            }}
                                        />
                                    </li>
                                </>
                                : ""
                        }
                    </div>
                </ul>
            </nav>

            <SettingsDialog toggleSettings={toggleSettings} mimic={mimic} changeMimic={changeMimic} />
        </>
    )
}
