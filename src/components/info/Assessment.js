import React from "react"
import { Link } from "react-router-dom"

export const Assessment = () => {
    return <article className="dashboard--student">
        <h1>Official Assessments</h1>

        There are two parts of our comprehensive assessment of your Core Skills and Technical Skills.

        <h2>Part 1: Language Fundamentals Exercises</h2>
        <p>
            You will be given some exercises by the instruction team where you must demonstrate your ability to design and implement some algorithms to solve some basic problems. It is at the discretion of the senior instructor for when these exercises must be completed, but this is most commonly done before capstone development begins. As a beginner, we know that relying on memory is not something you are capable of during this part of the assessment, so we will primarily be assessing your <Link to="/goals">Core Skills</Link> during this phase. If you complete the code in 30 minutes, that's great, but it's not the primary goal.
        </p>

        <h2>Part 2: Capstone Project</h2>

        <h3>Client Side Capstone Project</h3>

        <p>In the client-side portion of the course, you will be asked to build a final, individual project using React <em>(called a capstone project)</em>. After you have reached your Minimally Viable Product (MVP), you will then be evaluated on your knowledge of the syntax and components of React and your ERD. This is because you will continue to be asked to write clients in React during the server-side course, so you must have basic proficiency before continuing.</p>

        <p>In addition to have basic proficiency in React, you will also be assessed on your abilities and understanding of the basic concepts of software development you learned in JavaScript. </p>

        <Link to="/assessment/client">Requirements</Link>

        <h3>Server Side Capstone Project</h3>

        <p>At the end of the course, you will build another individual project <em>(i.e. capstone)</em> using the languages and tools you learned. Once you reach MVP, you will again be interviewed by the instruction team about your project and your ERD.</p>

        <p>You will be assessed, via some basic exercises, on your abilities and understanding of SQL concepts and syntax. You will also be asked to perform some basic tasks in the main server side language you learned - either Python or C#.</p>

        <Link to="/assessment/server">Requirements</Link>
    </article>
}