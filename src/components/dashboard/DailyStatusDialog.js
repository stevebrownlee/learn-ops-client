import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import useKeyboardShortcut from "../ui/useKeyboardShortcut"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"

export const DailyStatusDialog = () => {
    const { activeStudent } = useContext(PeopleContext)
    const [message, setMessage] = useState("")
    let { toggleDialog: toggleStatus } = useModal("#dialog--status")
    const dailyStatusLogger = useKeyboardShortcut('d', ({ activeStudent }) => {
        if ("id" in activeStudent) {
            toggleStatus()
            document.getElementById("statusText").focus()
            setMessage("")
        }
    }, { activeStudent })


    useEffect(() => {
        document.addEventListener("keyup", dailyStatusLogger)
        return () => document.removeEventListener("keyup", dailyStatusLogger)
    }, [])

    const reset = () => {
        setMessage("")
        toggleStatus()
    }

    const createStatusEntry = (e) => {
        return fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/status`, {
            method: "POST",
            body: JSON.stringify({ status: e.target.value })
        }).then(reset)
    }

    return <dialog id="dialog--status" className="dialog--status">
        <div className="form-group">
            <label htmlFor="name">Daily status:</label>
            <input type="text" id="statusText"
                className="form-control form-control--dialog"
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={
                    e => {
                        if (e.key === "Enter") {
                            e.target.value !== "" ? createStatusEntry(e) : reset()
                        } else if (e.key === "Escape") {
                            reset()
                        }
                    }
                }
            />
        </div>
    </dialog>
}
