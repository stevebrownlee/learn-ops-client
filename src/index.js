import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { LearnOps } from "./components/LearnOps.js"
// import "./components/people/Student.css"

ReactDOM.render(
    <React.StrictMode>
        <Router>
            <LearnOps />
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
)
