import React from "react"
import { Link, useHistory } from "react-router-dom"

export const Assessment = () => {
    const history = useHistory()

    return <article className="dashboard--student">
        <h1>Official Assessments</h1>

        <h2>Capstone Project</h2>

        <h3>Client Side Capstone Project</h3>

        <p>In the client-side portion of the course, you will be asked to build a final, individual project using React <em>(called a capstone project)</em>. After you have reached your Minimally Viable Product (MVP), you will then be evaluated on your knowledge of the syntax and components of React and your ERD. This is because you will continue to be asked to write clients in React during the server-side course, so you must have basic proficiency before continuing.</p>

        <p>In addition to have basic proficiency in React, you will also be assessed on your abilities and understanding of the basic concepts of software development you learned in JavaScript. </p>

        <Link to="/assessment/client">Requirements</Link>

        <h3>Server Side Capstone Project</h3>

        <p>At the end of the course, you will build another individual project <em>(i.e. capstone)</em> using the languages and tools you learned. Once you reach MVP, you will again be interviewed by the instruction team about your project and your ERD.</p>

        <p>You will be assessed, via some basic exercises, on your abilities and understanding of SQL concepts and syntax. You will also be asked to perform some basic tasks in the main server side language you learned - either Python or C#.</p>

        <Link to="/assessment/server">Requirements</Link>

        <div style={{ position: "absolute", top: "9rem", right: "4rem"}}>
            <button onClick={() => history.push("/proposal/client")}>Submit my proposal</button>
        </div>
    </article>
}