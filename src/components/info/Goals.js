import React from "react"
import Hiring from "./hiring-manager-skills.png"
import "./Goals.css"

export const LearningGoals = () => {
    return <article className="dashboard--student">
        <h1>What Hiring Managers Want</h1>
        <img className="hiringGraph" src={Hiring} alt="Hiring manager needs" width="100%" />

        <h1>Core Skills</h1>
        <h2>Analytical Thinking</h2>
        <div>Use objective, logic-based approach to identify the functional units of a problem. Detect patterns, and
            using them to think creativity when presented with new challenges.</div>
        <ul>
            <li>Take the time to understand the problem</li>
            <li>Debug code and analyze every step and inspect every value </li>
            <li>Read the chapter content/video to determine if the patterns are being followed
            </li>
            <li>Know how to focus on facts</li>
            <li>Ask for facts instead of relying on fallable memory or guesses</li>
            <li>Reading and understanding the problem using the Console or Network tab</li>
        </ul>

        <h2>Algorithmic Thinking</h2>
        <div>
            Once a problem is analyzed, understood, and deconstructed into functional units, algorithmic thinking
            develops a logical, efficient series of steps required to solve each unit. Each functional unit is
            broken down into basic operations (BO) or elementary operations (EO).
        </div>
        <ul>
            <li>Define algorithms comprised of only BO and EO</li>
            <li>Correctly order the series of BO and EO in the algorithm</li>
            <li>Organize the BO and EO into appropriate modules (Single Responsibility Principle)</li>
            <li>Explain how to navigate related data in multiple tables to present the correct, joined information</li>
        </ul>

        <h2>Efficient Learning</h2>
        <div>
            Efficient learners take the time to use every resource available to learn a new skill, or implement a
            non-mastered skill in a new context.
        </div>
        <ul>
            <li>Use the debugger consistenly and efficiently to learn what the code is doing</li>
            <li>Know how to use developer tools to learn what the system is doing <em>(Network tab, React Components tab, SQL tools, Application tab)</em></li>
            <li>Perform efficient WWW searches</li>
            <li>Know how to quickly navigate/evaluate WWW search results <em>(right language, right version, recent date, finding accepted soution)</em></li> <li>Ask for help, and do it efficiently <em>(i.e. presenting the problem, the relevant code, investigative steps taken)</em></li>
        </ul>

        <h2>Communication</h2>
        <div>
            Communicate effectivly with both technical and non-technical language. Master complex communication during group-based work. Use correct vocabulary when describing technical concepts. Know how, and when to ask for help from a senior technical resource.
        </div>
        <ul>
            <li>Ask for help, and do it efficiently <em>(i.e. presenting the problem, the relevant code, investigative steps taken)</em></li>
            <li>Write coherent, readable algorithms</li>
            <li>Intentfully improve their vocabulary</li>
            <li>Write valid, readable commit messages</li>
            <li>Write valid, readable pull requests</li>
            <li>Produce a valid, readable capstone proposal that met all requirements</li>
            <li>Offer help, advice, rubber ducking to teammates</li>
        </ul>

        <h1>Technical Skills</h1>

        Using your Core Skills will ease your ability to learn the technical skills that employers expect from a Nashville Software School graduate. Our expectation is that you have a proficiency <em>(not mastery)</em> in the language fundamentals of your course, the framework/library of your course, and strong vocabulary when explaining them to another person.

        <ol>
            <li>Iterating collections</li>
            <li>Defininition and usage of functions to define tasks comprised of BO and EO</li>
            <li>Conditional logic</li>
            <li>Defining, navigating, and joining related data</li>
            <li>Usage of debugging and investigative tools <em>(debugger, Dev Tools, Postman)</em></li>
            <li>Modular application design and development</li>
            <li>Source code versioning in both individual and group-based work</li>
            <li>Client/server communication workflow</li>
        </ol>

    </article>
}