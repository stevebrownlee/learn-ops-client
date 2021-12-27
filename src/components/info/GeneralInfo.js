import React from "react"
import useSimpleAuth from "../auth/useSimpleAuth"

export const GeneralInfo = () => {
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()


    return <article className="dashboard--student">
        <h1 id="capstone-information">Final Evaluation Information</h1>

        At the end of your client-side course, and the end of the server-side course, your abilities and knowledge will be officially assessed by your instruction team.

        <h2>Client Side</h2>

        <p>In the client-side portion of the course, you will be asked to build a final, individual project using React <em>(called a capstone project)</em>. After you have reached your Minimally Viable Product (MVP), you will then be evaluated on your knowledge of the syntax and components of React and your ERD. This is because you will continue to be asked to write clients in React during the server-side course, so you must have basic proficiency before continuing.</p>

        <p>In addition to have basic proficiency in React, you will also be assessed, via some basic exercises, on your abilities and understanding of the basic concepts of software development you learned in JavaScript.</p>

        <h2>Server Side</h2>

        <p>At the end of the course, you will build another individual project <em>(i.e. capstone)</em> using the languages and tools you learned. Once you reach MVP, you will again be interviewed by the instruction team about your project and your ERD.</p>

        <p>You will be assessed, via some basic exercises, on your abilities and understanding of SQL concepts and syntax. You will also be asked to perform some basic tasks in the main server side language you learned - either Python or C#.</p>

        <h2 id="proposal-planning">Requirements</h2>

        <h3 id="proposal-planning">Capstone Project Proposal Requirements</h3>

        These are the requirements that your proposal document must meet before it is approved by the instruction team.

        <ol>
            <li>Your proposal must clearly articulate the problem it is solving for your customers.</li>
            <li>Your proposal must define a minimum of four user stories that describe the core functionality of your application. Registration and login do not count since you are given the code for those. </li>
            <li>Your proposal must include a hyperlink to your ERD and it must be accessible by the instructors. Do not include a picture of your ERD.</li>
            <li>Your proposal must include wireframes that comprehensively show the journey of a user through your application.<ol>
                <li>Each view must be represented. Do not include login/register unless you need to customize those views for your user experience.</li>
                <li>Buttons or links must be included with notes/arrows describing what happens when the customer clicks on it.</li>
            </ol>
            </li>
        </ol>
        <h4 id="supporting-notes">Supporting Notes</h4>
        <ul>
            <li>If you are using an external API, gather all sample data and be prepared to demo your API during your one on one (via Postman and with an HTTP request in code (i.e. fetch, axios, etc.) before committing to use the API.</li>
            <li>For help on authoring good user stories, please refer to the <a href="https://en.wikipedia.org/wiki/Behavior-driven_development#Behavioral_specifications">Behavior Driven Development Wikipedia entry</a></li>
        </ul>
        <h3 id="data-design-erd-">Data Requirements</h3>
        <ol>
            <li>You must have an ERD for your project.</li>
            <li>You must have a user-related data scheme. This means that different people can authenticate with your application, and the resources that are created must be assigned to individual users.</li>
            <li>In addition to having user-related data, you need to have at least one more <code>1 -&gt; many</code> relationships defined in your ERD.</li>
            <li>Having a <code>many -&gt; many</code> relationship is recommended, but <strong>not required</strong> for your client side project.</li>
            <li>You are required to use the persistent storage tool that you were taught <em>(i.e. json-server, firebase, SQL Server, SQLite, etc.)</em>.</li>
        </ol>
        <h4 id="server-side">Server Side</h4>
        <p>There are additional data design requirements for your server side capstone.</p>
        <ol>
            <li>You must have at least one <code>many -&gt; many</code> relationship in your ERD.</li>
        </ol>
        <h3 id="application-design">Application Design Requirements</h3>
        <h4 id="client-side">Client Side</h4>
        <ol>
            <li>You are required to use the major libraries and/or frameworks that you learned during the course <em>(e.g. React, etc...)</em>.</li>
            <li>Your application must support multiple routes to show different views to the user, and the user must be able to navigate to each route/view.</li>
            <li>You must show your proficiency with following the Single Responsibility Principle by writing modular code, where each module has a single responsibility <em>(e.g. displays a list of things, displays a single thing, manages application state, etc.)</em>.</li>
            <li>You must have a form that allows a user to create a new resource.</li>
            <li>Your form must include <code>&lt;select&gt;</code> element, radio button group, or checkbox group that allows a user to choose a related resource. For example, if your application allows users to create new plants for their home, one of the fields in the form must allow them to select something like the following items:<ol>
                <li>The room it will be in.</li>
                <li>The level of sunlight it needs.</li>
                <li>It&#39;s type.</li>
            </ol>
            </li>
            <li>Customer must be able to delete their own data, and be prevented from deleting other customers&#39; data.</li>
            <li>It is strongly recommended that you provide the ability for your customers to edit their data. If you feel that your application does not need this ability, you must gain approval from the senior instructor to exclude it from your application.</li>
            <li>You must be able to implement a flexible layout for your UI by either (a) authoring your own CSS using Flexbox, or (b) using a 3rd party framework like Bootstrap.</li>
            <li>All copy for your application must be legible, so pay attention to colors, margins, padding, and font sizes.</li>
        </ol>
        <h4 id="server-side">Server Side</h4>
        <p>For your server side capstone at the end of the cohort, there are additional requirements.</p>
        <ol>
            <li>You are required to use the major framework that you learned during the course <em>(e.g. ASP.NET, Django, etc...)</em>.</li>
            <li>Your application must include edit capabilties.</li>
        </ol>
        <h2 id="interview">Interview</h2>
        <p>After you have reached your MVP goals for your project, you will also be interviewed by the instruction team so that your knowledge and vocabulary about basic software concepts in can be assessed.</p>
        <ol>
            <li>You must clearly demonstrate the flow of data in your React application, and how to implement a new feature.</li>
            <li>You must be able to demonstrate your proficiency with debugging.</li>
            <li>You must be able to demonstrate your proficiency with key Developer Tools.</li>
            <li>You must be able to explain any key aspects of the libraries and frameworks that the instructor asks you. </li>
        </ol>

        After the interview, your instruction will give you a few fundamental exercises in the language you just learned so that your abilities and understanding of the core concepts can be assessed. These fundamentals exercises hold equal weight to your ability to reach MVP on your individual project.


        <h3 id="server-side">Server Side</h3>
        <p>For your server side capstone at the end of the cohort, there are additional requirements.</p>
        <ol>
            <li>You will be asked to write one, or more, SQL queries that involve querying two, or more, tables and obtaining information from each of the specified tables.</li>
            <li>You will be asked to clearly explain how a client and a server communicate with each other, and demonstrate how the data in the request and response are captured by the corresponding code.</li>
        </ol>
        <h2 id="additional-guidelines">Additional Guidelines</h2>
        <p>Do you want to impress your professional network, which includes all future employers? Then make sure you complete this checklist. These are not part of your official NSS proficiency assessment, but can make a huge impact on how others perceive you and your professionalism.</p>
        <h3 id="general">General</h3>
        <ol>
            <li>Project details<ol>
                <li>Make sure your project name is in the <code>&lt;title&gt;</code> tag of <code>public/index.html</code>.</li>
                <li>Make sure your project name is correct in the <code>name</code> property in your <code>package.json</code>.</li>
            </ol>
            </li>
            <li>Have a comprehensive README that has the following sections.<ol>
                <li>Introduction</li>
                <li>Purpose &amp; motivation for project</li>
                <li>How does the application work? <em>(animations are always good)</em></li>
                <li>How was the application developed?</li>
                <li>How to install and run the application.</li>
                <li>Difficulties &amp; challenges faced during process.</li>
                <li>Public link <em>(if exists)</em>.</li>
            </ol>
            </li>
            <li>No zombie code. Having chunks of code that are commented out is unprofessional.</li>
            <li>No console logs.</li>
            <li>The console in your Developer Tools should not have any errors.</li>
            <li>Student should be able to explain any warnings in the console.</li>
            <li>Professional/meaningful commit and PR messages. </li>
            <li>Write a minimum of 4 integration tests for your client and/or server side project.</li>
        </ol>
        <h3 id="design">Design</h3>
        <ol>
            <li>Limited color palette (3 colors)</li>
            <li>Most text copy should be left aligned</li>
            <li>Use of padding/margins</li>
            <li>Consistency: views, cards, fonts, sizes, etc.</li>
            <li>If you use images in your application, they must be resized, if needed, for display in the UI and the correct ratio must be maintained.</li>
        </ol>

    </article>
}