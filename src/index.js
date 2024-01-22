import '@radix-ui/themes/styles.css';
import "./index.css"
import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import { LearnOps } from "./components/LearnOps.js"
import { Theme } from '@radix-ui/themes';


ReactDOM.render(
    <React.StrictMode>
        <Router>
            <Theme style={{height: "100%"}}>
                <LearnOps />
            </Theme>
        </Router>
    </React.StrictMode>,
    document.getElementById("root")
)
