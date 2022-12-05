import React, { useRef, useState } from "react"

export const HelpIcon = ({ helpFunction, tip, position }) => {
    const [visible, setVisible] = useState(false)
    const [style, setStyle] = useState(false)

    const tooltipStyle = {
        position: "absolute",
        top: "-4rem",
        left: "2rem",
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
        { visible ? displayTip() : "" }

        <svg className="tooltip"
            onMouseOver={() => setVisible(!visible)}
            onMouseOut={() => setVisible(!visible)}
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style={{ cursor: "pointer", height: "1rem" }}>
            <g fill="none">
                <path d="M9.25 7.307C9.09 7.491 9 7.745 9 8a.5.5 0 0 1-1 0c0-.473.161-.97.5-1.354C8.847 6.252 9.36 6 10 6s1.153.252 1.5.646c.339.385.5.88.5 1.354c0 .49-.116.87-.302 1.19c-.163.279-.376.5-.545.677l-.042.043c-.186.195-.329.354-.434.554c-.1.191-.177.444-.177.829a.5.5 0 1 1-1 0c0-.532.11-.947.291-1.293c.177-.337.41-.584.598-.781l.022-.023c.188-.197.322-.337.423-.51c.095-.163.166-.369.166-.686c0-.255-.089-.51-.25-.693C10.597 7.134 10.36 7 10 7s-.597.134-.75.307zm.75 6.905a.7.7 0 1 0 0-1.399a.7.7 0 0 0 0 1.4zM2 10a8 8 0 1 1 4.262 7.075l-3.64.91a.5.5 0 0 1-.607-.606l.91-3.641A7.968 7.968 0 0 1 2 10zm8-7a7 7 0 0 0-6.107 10.425a.5.5 0 0 1 .05.366l-.756 3.022l3.022-.756a.5.5 0 0 1 .366.05A7 7 0 1 0 10 3z" fill="currentColor"></path>
            </g>
        </svg>
    </span>
}