import React, { useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import "./CohortForm.css"


export const CohortForm = () => {
    const [cohort, updateCohort] = useState({
        name: "Day Cohort 54",
        startDate: new Date("01/03/2022").toISOString().substring(0,10),
        endDate: new Date("06/25/2022").toISOString().substring(0,10),
        breakStartDate: new Date("03/28/2022").toISOString().substring(0,10),
        breakEndDate: new Date("04/01/2022").toISOString().substring(0,10),
        slackChannel: "day-cohort-54"
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
                    <label htmlFor="name">Cohort name</label>
                    <input onChange={handleUserInput}
                        value={cohort.name}
                        type="text" required autoFocus
                        id="name" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="slackChannel">Slack channel</label>
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

                <div className="form-group">
                    <label htmlFor="breakStartDate">Break start date</label>
                    <input onChange={handleUserInput}
                        value={cohort.breakStartDate}
                        type="date" required
                        id="breakStartDate" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="breakEndDate">Break end date</label>
                    <input onChange={handleUserInput}
                        value={cohort.breakEndDate}
                        type="date" required
                        id="breakEndDate" className="form-control"
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
