import React from "react"

export const ServerAssessment = () => {

    return <article className="dashboard--student">
        <h1 id="capstone-information">Full Stack Requirements</h1>

        <h2>Proposal</h2>
        <ol>
            <li>Your proposal must clearly articulate the problem it is solving for your customers.</li>
            <li>Your proposal must define a minimum of four user stories that describe the core functionality of your application. Registration and login do not count since you are given the code for those. </li>
            <li>Your proposal must include a hyperlink to your ERD and it must be accessible by the instructors. Do not include a picture of your ERD.</li>
            <li>Your proposal must include wireframes that comprehensively show the journey of a user through your application.<ol>
                <li>Each view must be represented. Do not include login/register unless you need to customize those views for your user experience.</li>
                <li>Buttons or links must be included with notes/arrows describing what happens when the customer clicks on it.</li>
            </ol>
            </li>
            <li>If you are using an external API, gather all sample data and be prepared to demo your API during your one on one (via Postman and with an HTTP request in code (i.e. fetch, axios, etc.) before committing to use the API.</li>
        </ol>
        <div>
            <em>
                For help on authoring good user stories, please refer to the {" "}
                <a href="https://en.wikipedia.org/wiki/Behavior-driven_development#Behavioral_specifications">Behavior Driven Development</a>{" "}
                Wikipedia entry
            </em>
        </div>

        <h2 id="data-design-erd-">Data Requirements</h2>
        <ol>
            <li>You must have an ERD for your project.</li>
            <li>You must have a user-related data scheme. This means that different people can authenticate with your application, and the resources that are created must be assigned to individual users.</li>
            <li>You must have at least one <code>one -&gt; many</code> relationship in your ERD.</li>
            <li>You must have at least one <code>many -&gt; many</code> relationship in your ERD.</li>
            <li>You are required to use the persistent storage tool that you were taught <em>(i.e. SQL Server, SQLite, etc.)</em>.</li>
        </ol>

        <h2 id="application-design">Application Design Requirements</h2>
        <h3 id="client-side">Client</h3>
        <ol>
            <li>You are required to use React.</li>
            <li>You must have a form that allows a user to create a new resource.</li>
            <li>Your form must include <code>&lt;select&gt;</code> element, radio button group, or checkbox group that allows a user to choose a related resource.</li>
            <li>You must show your proficiency with writing modular code that follows the the Single Responsibility Principle.</li>
            <li>Your application must support multiple client routes to show different views to the user, and the user must be able to navigate to each route/view.</li>
            <li>You must be able to implement a flexible layout for your UI by either (a) authoring your own CSS using Flexbox, or (b) using a 3rd party framework like Bootstrap.</li>
            <li>All copy for your application must be legible, so pay attention to colors, margins, padding, and font sizes.</li>
        </ol>

        <h3 id="client-side">Server</h3>

        <ol>
            <li>Customer must be able to delete their own data, and be prevented from deleting other customers&#39; data.</li>
            <li>Customer must be able to edit their own data, and be prevented from editing other customers&#39; data.</li>
            <li>You are required to use the major framework that you learned during the course <em>(e.g. ASP.NET, Django, etc...)</em>.</li>
            <li>You must implement the authentication scheme you learned during the course <em>(Django tokens, Identity Framework, Firebase Authentication, etc...)</em>.</li>
        </ol>


        <h2 id="additional-guidelines">Guidelines After MVP</h2>
        <p>Once your capstone MVP is complete, you want to make sure it is ready to impress your professional network, which includes all future employers? Then make sure you complete this checklist. These are not part of your official NSS proficiency assessment, but can make a huge impact on how others perceive you and your professionalism.</p>
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