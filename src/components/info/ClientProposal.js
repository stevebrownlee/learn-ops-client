import React from "react"
import { Link, useHistory } from "react-router-dom"

export const ClientProposal = () => {
    const history = useHistory()

    return <article className="dashboard--student">
            <h2 className="cohortForm__title">Client Side Proposal</h2>

        <ul>
            <li>Make sure that Sharing is set to anyone with the link</li>
            <li>Make sure that it includes a URL to your ERD</li>
            <li>Make sure that it includes a URL to your wireframes</li>
        </ul>

        <form className="cohortForm view">
                <div className="form-group">
                    <label htmlFor="name">Proposal URL</label>
                    <input onChange={() => {}}
                        value={""}
                        type="text" required autoFocus
                        placeholder="Paste Google Doc URL here"
                        id="proposalURL" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name">Proposal URL</label>
                    <textarea onChange={() => {}}
                        value={""}
                        rows="200"
                        type="text" required autoFocus
                        placeholder="Brief description of project"
                        id="description" className="form-control"
                    ></textarea>
                </div>

                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                        }
                    }
                    className="btn btn-primary"> Submit </button>
            </form>
    </article>
}