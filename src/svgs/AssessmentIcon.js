import React, { useState } from "react"

export const AssessmentIcon = ({ tip, position, clickFunction, active }) => {
    const [visible, setVisible] = useState(false)
    const [style, setStyle] = useState(false)
    const [isHovered, setIsHovered] = useState(false)
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

    const tooltipStyle = {
        position: "absolute",
        top: "-4.25rem",
        left: "-4rem",
        border: "1px dashed gray",
        padding: "0.75rem",
        fontSize: "smaller",
        backgroundColor: "lightgoldenrodyellow",
        width: "10rem",
        zIndex: 10
    }

    const displayTip = () => {
        if (position === "left") {
            tooltipStyle.left = "-12rem"
        }
        return <div style={tooltipStyle}>{tip}</div>
    }

    return <span style={{ position: "relative" }}>
        {visible ? displayTip() : ""}

        <svg xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={clickFunction}
            style={{ cursor: "pointer", marginLeft: "0.33rem", height: "1rem" }}
            viewBox="0 0 512 512">
            <g fill="none">
            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M39.93 327.56l-4.71-8.13A24 24 0 0 1 44 286.64l86.87-50.07a16 16 0 0 1 21.89 5.86l12.71 22a16 16 0 0 1-5.86 21.85l-86.85 50.07a24.06 24.06 0 0 1-32.83-8.79z"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M170.68 273.72L147.12 233a24 24 0 0 1 8.8-32.78l124.46-71.75a16 16 0 0 1 21.89 5.86l31.57 54.59a16 16 0 0 1-5.84 21.84L203.51 282.5a24 24 0 0 1-32.83-8.78z"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M341.85 202.21l-46.51-80.43a24 24 0 0 1 8.8-32.78l93.29-53.78A24.07 24.07 0 0 1 430.27 44l46.51 80.43a24 24 0 0 1-8.8 32.79L374.69 211a24.06 24.06 0 0 1-32.84-8.79z"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M127.59 480l96.14-207.99"></path><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M271.8 256.02L368.55 448"></path>
            </g>
        </svg>
    </span>
}
