import React, { useState } from "react"
import { useHistory } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import "./CohortForm.css"
import { HelpIcon } from "../../svgs/Help.js"


export const CohortForm = () => {
    const [cohort, updateCohort] = useState({
        name: "",
        startDate: "",
        endDate: "",
        breakStartDate: "",
        breakEndDate: "",
        slackChannel: ""
    })
    const history = useHistory()

    const constructNewCohort = () => {
        fetchIt(`${Settings.apiHost}/cohorts`, { method: "POST", body: JSON.stringify(cohort)})
            .then(() => history.push("/students"))
    }

    const handleUserInput = (event) => {
        const copy = {...cohort}
        copy[event.target.id] = event.target.value
        updateCohort(copy)
    }

    return (
        <>
            <form className="cohortForm view">
                <h2 className="cohortForm__title">New Cohort</h2>
                <div className="form-group">
                    <label htmlFor="name">
                        Cohort name
                        <HelpIcon tip="Day Cohort 62, for example." />
                    </label>
                    <input onChange={handleUserInput}
                        value={cohort.name}
                        type="text" required autoFocus
                        id="name" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label>
                        Instructor Slack Channel ID
                        <HelpIcon tip="Click on the instructor channel name at the top of Slack. Channel ID is at the bottom of pop-up." />
                    </label>
                    <input onChange={handleUserInput}
                        value={cohort.slackChannel}
                        type="text" required
                        id="slackChannel" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="startDate">Start date</label>
                    <input onChange={handleUserInput}
                        value={cohort.startDate}
                        type="date" required
                        id="startDate" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="endDate">End date</label>
                    <input onChange={handleUserInput}
                        value={cohort.endDate}
                        type="date" required
                        id="endDate" className="form-control"
                    />
                </div>

                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()
                            constructNewCohort()
                        }
                    }
                    className="btn btn-primary"> Create </button>
            </form>
        </>
    )
}
