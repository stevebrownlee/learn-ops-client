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
        <h2 className="cohortForm__title">Submit {course.course__name} Proposal</h2>

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


            <ul className="proposal__checklist">
                <li className="important">
                    <input required type="checkbox" /> My proposal meets all requirements.
                </li>
                <li>
                    <input required type="checkbox" /> Sharing settings for my proposal document is set to anyone with the link.
                </li>
                <li>
                    <input required type="checkbox" /> My proposal includes a URL to my ERD.
                </li>
                <li>
                    <input required type="checkbox" /> My proposal includes a URL to my wireframes.
                </li>
                <li>
                    <input required type="checkbox" /> My wireframes are set to public visibility for review.
                </li>
            </ul>

            <button type="submit" className="btn btn-primary"> Submit </button>
        </form>
    </article>
}