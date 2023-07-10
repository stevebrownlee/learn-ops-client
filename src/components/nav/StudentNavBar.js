import React, { useContext, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { SettingsDialog } from "../people/SettingsDialog.js"
import { SettingsIcon } from "../../svgs/SettingsIcon.js"
import { SettingsContext } from "../LearnOps.js"
import useModal from "../ui/useModal.js"
import simpleAuth from "../auth/simpleAuth"
import Logout from "./logout.png"
import logo from "./nav-logo.png"
import "./NavBar.css"

export const StudentNavBar = () => {
    const history = useHistory()
    const [checked, setChecked] = useState("")
    const { logout, isAuthenticated, getCurrentUser } = simpleAuth()
    const { mimic, changeMimic } = useContext(SettingsContext)
    let { toggleDialog: toggleSettings } = useModal("#dialog--settings")
    const isStaff = getCurrentUser().profile.staff

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
                            {makeLink("/", "Overview")}
                        </li>
                        <li className="navbar__item">
                            {makeLink("/goals", "Core Skills")}
                        </li>
                        <li className="navbar__item">
                            {makeLink("/assessment", "Capstones")}
                        </li>
                        <li className="navbar__item">
                            {makeLink("/readme", "README Resources")}
                        </li>
                        {
                            isAuthenticated()
                                ? <li className="navbar__item navbar__logout">
                                    {isStaff ? <SettingsIcon clickFunction={toggleSettings} /> : ""}
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

            {
                isStaff ? <SettingsDialog toggleSettings={toggleSettings} mimic={mimic} changeMimic={changeMimic} /> : <></>
            }
        </>
    )
}
