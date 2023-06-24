import React from "react"
import { Link, useHistory } from "react-router-dom"

export const Assessment = () => {
    const history = useHistory()

    return <article className="dashboard--student">
        <h1 style={{ fontSize: "2rem" }}>Official Assessments: Capstone Project</h1>

        <div style={{ border: "1px solid goldenrod", padding: "3rem" }}>
            <h2>Client Side Capstone Project</h2>
            <p>In the client-side portion of the course, you will be asked to build a final, individual project using React <em>(called a capstone project)</em>. After you have reached your Minimally Viable Product (MVP), you will then be evaluated on your knowledge of the syntax and components of React and your ERD. This is because you will continue to be asked to write clients in React during the server-side course, so you must have basic proficiency before continuing.</p>
            <p>In addition to have basic proficiency in React, you will also be assessed on your abilities and understanding of the basic concepts of software development you learned in JavaScript. </p>

            <Link to="/assessment/client">Requirements</Link>
        </div>

        <div style={{ border: "1px solid dodgerblue", marginTop: "3rem", padding: "3rem" }}>
            <h2>Server Side Capstone Project</h2>
            <p>At the end of the course, you will build another individual project <em>(i.e. capstone)</em> using the languages and tools you learned. Once you reach MVP, you will again be interviewed by the instruction team about your project and your ERD.</p>
            <p>You will be assessed, via some basic exercises, on your abilities and understanding of SQL concepts and syntax. You will also be asked to perform some basic tasks in the main server side language you learned - either Python or C#.</p>

            <Link to="/assessment/server">Requirements</Link>
        </div>
    </article>
}