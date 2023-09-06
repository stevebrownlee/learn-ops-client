import React from "react"

export const SettingsDialog = ({ toggleSettings, settingsIsOpen, changeMimic, mimic }) => {
    return <dialog id="dialog--settings"
        open={settingsIsOpen}
        className="dialog--settings"
        onKeyDown={
            e => {
                if (e.key === "Escape") {
                    toggleSettings()
                }
            }
        }
    >

        <h1>User Settings</h1>
        <button onClick={() => changeMimic(!mimic)} className="isometric-button yellow">
            {
                mimic ? "Instructor Interface" : "Student Interface"
            }
        </button>
        <button className="fakeLink dialog__close"
            id="closeBtn"
            onClick={toggleSettings}>[ close ]</button>
    </dialog>
}
