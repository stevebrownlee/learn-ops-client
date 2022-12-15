import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentContext } from "../assessments/AssessmentProvider"

export const ClientProposal = () => {
    const [courses, establishCourses] = useState([])
    const [url, setURL] = useState("")
    const [overview, setOverview] = useState("")
    const [course, setCourse] = useState(0)

    const { getCourses, saveProposal } = useContext(AssessmentContext)

    const history = useHistory()

    useEffect(() => {
        getCourses().then(establishCourses)
    }, [])

    return <article className="dashboard--student">
        <h2 className="cohortForm__title">Submit Your Proposal</h2>

        <form className="cohortForm view"
            onSubmit={(evt) => {
                evt.preventDefault()

                if (course > 0) {
                    saveProposal({
                        "description": overview,
                        "proposalURL": url,
                        "repoURL": "",
                        "course": parseInt(course)
                    })
                        .then(() => {
                            history.push("/")
                            window.alert("Proposal submitted")
                        })
                }
                else {
                    window.alert("Choose a course, please")
                }
            }}
        >

            <fieldset>
                <div className="form-group">
                    <label htmlFor="name">Course</label>

                    <select className="form-control"
                        value={course}
                        onChange={e => setCourse(e.target.value)}>

                        <option value={0}>Choose course</option>
                        {
                            courses.map(c => <option key={`crs--${c.id}`} value={c.id}>{c.name}</option>)
                        }
                    </select>
                </div>
            </fieldset>

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