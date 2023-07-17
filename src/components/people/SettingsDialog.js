import React from "react"

export const SettingsDialog = ({ toggleSettings, changeMimic, mimic }) => {
    return <dialog id="dialog--settings"
        className="border-spacing-10 border-slate-800 p-5 rounded-sm shadow-gray-400 shadow-lg"
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
        <button className="fakeLink dialog__close"
            id="closeBtn"
            onClick={toggleSettings}>[ close ]</button>
    </dialog>
}
