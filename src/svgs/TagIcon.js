import React, { useState } from "react"

export const TagIcon = ({ tip, position, clickFunction }) => {
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
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={clickFunction}
            className="svg"
            viewBox="0 0 22 22">
            <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8.5" cy="8.5" r="1" fill="currentColor"></circle><path d="M4 7v3.859c0 .537.213 1.052.593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834-4.834a2.025 2.025 0 0 0 0-2.864L12.29 4.593A2.025 2.025 0 0 0 10.859 4H7a3 3 0 0 0-3 3z"></path></g>
        </svg>
    </span>
}
