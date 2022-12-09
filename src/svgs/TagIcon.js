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
            style={{ cursor: "pointer", marginLeft: "0.33rem", height: "1rem" }}
            viewBox="0 0 20 20">
            <g fill="none">
            <path d="M5 6a4 4 0 1 1 6.646 3h-.133c-.803 0-1.518.377-1.979.965A4 4 0 0 1 5 6zm4-3a3 3 0 1 0 0 6a3 3 0 0 0 0-6zm.053 8H4.009A2.001 2.001 0 0 0 2 13c0 1.691.833 2.966 2.135 3.797C5.417 17.614 7.145 18 9 18c.803 0 1.583-.072 2.313-.22l-.854-.872C9.995 16.97 9.507 17 9 17c-1.735 0-3.257-.364-4.327-1.047C3.623 15.283 3 14.31 3 13c0-.553.448-1 1.009-1h4.99v-.484c0-.177.02-.35.054-.516zM10 14.39c0 .397.155.777.432 1.06l3.034 3.097c.58.592 1.527.606 2.124.031l2.947-2.837c.607-.585.619-1.555.025-2.155l-3.107-3.139A1.509 1.509 0 0 0 14.383 10H11.51A1.51 1.51 0 0 0 10 11.512v2.879zm2.75-.89a.75.75 0 1 1 0-1.5a.75.75 0 0 1 0 1.5z" fill="currentColor"></path>
            </g>
        </svg>
    </span>
}
