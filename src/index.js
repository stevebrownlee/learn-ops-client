import React from "react"
import ReactDOM from "react-dom"
import { BrowserRouter as Router } from "react-router-dom"
import '@radix-ui/themes/styles.css';
import { Theme } from '@radix-ui/themes';

import { LearnOps } from "./components/LearnOps.js"
import "./index.css"

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
