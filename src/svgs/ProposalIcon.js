import React, { useState } from "react"

export const ProposalIcon = ({ tip, color }) => {
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

    return <span style={{ position: "relative" }}>
        <svg xmlns="http://www.w3.org/2000/svg"
            className="svg"
            viewBox="0 0 32 32">
            <g fill="none"><path d="M17 2v7a3 3 0 0 0 3 3h7v15a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3h9zm2 .117V9a1 1 0 0 0 1 1h6.883a3 3 0 0 0-.762-1.293L20.293 2.88A3 3 0 0 0 19 2.117z" fill={color}></path></g>
        </svg>
    </span>
}



