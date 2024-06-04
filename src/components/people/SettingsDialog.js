import React from "react"
import { Button } from '@radix-ui/themes'

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
        <Button onClick={() => changeMimic(!mimic)} color="amber">
            {
                mimic ? "Instructor Interface" : "Student Interface"
            }
        </Button>
        <button className="fakeLink dialog__close"
            id="closeBtn"
            onClick={toggleSettings}>[ close ]</button>
    </dialog>
}
