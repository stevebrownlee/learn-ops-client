import React, { useContext, useEffect, useState } from "react"
import { PeopleIcon } from "../../svgs/PeopleIcon.js"

export const SettingsDialog = ({ toggleSettings, changeMimic, mimic }) => {


    return <dialog id="dialog--settings" className="dialog--settings"
        onKeyDown={
            e => {
                if (e.key === "Escape") {
                    toggleSettings()
                }
            }
        }
    >

        <h1>User Settings</h1>

        <button onClick={() => changeMimic(!mimic)}>
            {
                mimic ? "Instructor Interface" : "Student Interface"
            }
        </button>

        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={toggleSettings}>[ close ]</button>
    </dialog>
}
