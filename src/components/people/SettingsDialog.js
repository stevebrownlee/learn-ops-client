import React from "react"
import { Button } from '@radix-ui/themes'
import { useSettings } from "../../hooks/useSettings"

export const SettingsDialog = ({ toggleSettings, settingsIsOpen }) => {
    const { mimic, changeMimic } = useSettings()

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
