import React, { useState } from "react"

export const NoteIcon = ({ tip, position, clickFunction }) => {
    const [visible, setVisible] = useState(false)
    const [delayHandler, setDelayHandler] = useState(null)

    const handleMouseEnter = event => {
        setDelayHandler(setTimeout(() => {
            setVisible(true)
        }, 750))
    }

    const handleMouseLeave = () => {
        setVisible(false)
        clearTimeout(delayHandler)
    }

    const displayTip = () => {
        return <div className="tooltip">{tip}</div>
    }

    return <span style={{ position: "relative" }}>
        {visible ? displayTip() : ""}

        <svg xmlns="http://www.w3.org/2000/svg"
            onMouseOver={handleMouseEnter}
            onMouseOut={handleMouseLeave}
            onClick={clickFunction}
            style={{ cursor: "pointer", marginLeft: "0.33rem", height: "1rem" }}
            viewBox="0 0 24 24">
            <g fill="none">
                <path d="M3 17.75A3.25 3.25 0 0 0 6.25 21h4.915l.356-1.423l.02-.077H6.25a1.75 1.75 0 0 1-1.75-1.75V11h3.25l.184-.005A3.25 3.25 0 0 0 11 7.75V4.5h6.75c.966 0 1.75.784 1.75 1.75v4.982c.479-.19.994-.263 1.5-.22V6.25A3.25 3.25 0 0 0 17.75 3h-6.879a2.25 2.25 0 0 0-1.59.659L3.658 9.28A2.25 2.25 0 0 0 3 10.871v6.879zM7.75 9.5H5.561L9.5 5.561V7.75l-.006.144A1.75 1.75 0 0 1 7.75 9.5zm11.35 3.17l-5.903 5.902a2.686 2.686 0 0 0-.706 1.247l-.458 1.831a1.087 1.087 0 0 0 1.319 1.318l1.83-.457a2.685 2.685 0 0 0 1.248-.707l5.902-5.902A2.286 2.286 0 0 0 19.1 12.67z" fill="currentColor"></path>
            </g>
        </svg>
    </span>
}