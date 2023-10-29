import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import simpleAuth from "../auth/simpleAuth"
import { AssessmentContext } from "../assessments/AssessmentProvider"

export const ClientProposal = () => {
    const { getCurrentUser, getProfile } = simpleAuth()

    const [courses, establishCourses] = useState([])
    const [url, setURL] = useState("")
    const [overview, setOverview] = useState("")
    const [course, setCourse] = useState("")
    const [user, setUser] = useState({})

    const { getCourses, saveProposal } = useContext(AssessmentContext)

    const history = useHistory()

    useEffect(() => {
        getCourses().then(establishCourses)
        getProfile().then(() => setUser(getCurrentUser()))
    }, [])

    useEffect(() => {
        if (user?.profile) {
            const activeCourse = user.profile.current_cohort?.courses?.find(course => course.active)
            setCourse(activeCourse)
        }
    }, [user])

    return <article className="dashboard--student">
        <h1 style={{
            fontSize: "2rem"
        }} className="cohortForm__title">Submit {course.course__name} Proposal</h1>

        <form className="cohortForm view"
            onSubmit={(evt) => {
                evt.preventDefault()
                const courseId = user.profile.current_cohort.courses.find(course => course.active).course__id

                saveProposal({
                    "description": overview,
                    "proposalURL": url,
                    "repoURL": "",
                    "course": course.course__id
                })
                    .then(() => {
                        history.push("/")
                        window.alert("Proposal submitted")
                    })
                    .catch(window.alert)
            }}
        >
            <h1>Completeness Check</h1>

            <div>Your proposal will be rejected unless it meets all of the following requirements. This is your chance to double check that you have met all requirements before you submit.</div>


            <h3>Wireframes</h3>
            <ul className="proposal__checklist">
                <li>
                    <input required type="checkbox" /> My wireframes include every view in my application
                </li>
                <li>
                    <input required type="checkbox" /> My wireframes include arrows to show user journeys between views
                </li>
                <li>
                    <input required type="checkbox" /> My create and edit forms show required radio buttons/dropdown for related data
                </li>
            </ul>
            <h3>ERD</h3>
            <ul className="proposal__checklist">
                <li>
                    <input required type="checkbox" /> My ERD is is up to date and matches the data needed for my wireframes and stories
                </li>
                <li>
                    <input required type="checkbox" /> My ERD demonstrates user-related data
                </li>
                <li>
                    <input required type="checkbox" /> My ERD has a one to many relationship for when new resources are created. If this is your server-side proposal, your ERD includes a many-to-many relationship.
                </li>
                <li>
                    <input required type="checkbox" /> All of the relationships in my ERD are drawn correctly
                </li>
            </ul>
            <h3>Design Document</h3>
            <ul className="proposal__checklist">
                <li>
                    <input required type="checkbox" /> My project includes functionality for Create, Read, Update and Delete operations.
                </li>
                <li>
                    <input required type="checkbox" /> I have included a user story for all functionality.
                </li>
                <li>
                    <input required type="checkbox" /> A link to my ERD is included in my proposal.
                </li>
                <li>
                    <input required type="checkbox" /> A link to my wireframes is included in my proposal, and wireframe document is publicly accessible.
                </li>
                <li>
                    <input required type="checkbox" /> My proposal document sharing settings are set to "Anyone with the link"
                </li>
            </ul>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Proposal URL</label>
                    <input onChange={e => setURL(e.target.value)}
                        value={url}
                        type="url" required autoFocus
                        placeholder="Paste Google Doc URL here"
                        id="proposalURL" className="form-control"
                    />
                </div>
            </fieldset>

            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Project overview</label>
                    <textarea onChange={e => setOverview(e.target.value)}
                        value={overview}
                        type="text" required
                        placeholder="Brief description of project"
                        id="description" className="form-control proposal__overview"
                    ></textarea>
                </div>
            </fieldset>

            <button type="submit" className="isometric-button blue"> Submit </button>
        </form>
    </article>
}