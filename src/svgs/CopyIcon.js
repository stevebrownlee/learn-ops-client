import React, { useState } from "react"
import { Toast } from "toaster-js"

export const CopyIcon = ({ text }) => {

    return <span style={{
        backgroundColor: "lightgray",
        padding: "0.33rem",
        margin: "0 -0.5rem 0 1rem",
        position: "relative",
        color: "darkslategray"
    }}>
        <svg
            onClick={() => {
                navigator.clipboard.writeText(text)
                new Toast("URL copied", Toast.TYPE_DONE, 1000);
            }}
            className="svg"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="svg">
            <path opacity=".3" d="M8 7h11v14H8z" fill="currentColor"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="currentColor"></path>
        </svg>
    </span>
}
