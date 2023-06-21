import React from "react"
import "./loading.css";
import loading from "./loading-Infinity.svg"

export const Loading = () => {
    return <img src={loading} style={{
        maxWidth: "70%",
        minWidth: "30%"
    }} />
}
