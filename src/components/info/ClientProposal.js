import React, { useState } from "react"
import { Link, useHistory } from "react-router-dom"

export const ClientProposal = () => {
    const [url, setURL] = useState("")
    const [overview, setOverview] = useState("")
    const [allChecked, updateAllChecked] = useState(0)
    const history = useHistory()

    return <article className="dashboard--student">
        <h2 className="cohortForm__title">Client Side Proposal</h2>

        <form className="cohortForm view"
            onSubmit={(evt) => {
                evt.preventDefault()
            }}
        >
            <div className="form-group">
                <label htmlFor="name">Proposal URL</label>
                <input onChange={e => setURL(e.target.value)}
                    value={url}
                    type="url" required autoFocus
                    placeholder="Paste Google Doc URL here"
                    id="proposalURL" className="form-control"
                />
            </div>

            <div className="form-group">
                <label htmlFor="name">Project overview</label>
                <textarea onChange={e => setOverview(e.target.value)}
                    value={overview}
                    type="text" required
                    placeholder="Brief description of project"
                    id="description" className="form-control proposal__overview"
                ></textarea>
            </div>


            <ul className="proposal__checklist">
                <li>
                    <input required type="checkbox" /> Sharing settings for my proposal document is set to anyone with the link.
                </li>
                <li>
                    <input required type="checkbox" /> My proposal meets all requirements.
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