import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { LearnOps } from "./components/LearnOps.js"
import "./index.css"

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <LearnOps />
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
)
