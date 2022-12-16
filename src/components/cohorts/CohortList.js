import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CohortContext } from "./CohortProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { EditIcon } from "../../svgs/Edit"
import "./CohortList.css"
import "./Cohort.css"
import { UnassignedStudents } from "./UnassignedStudents"
import { PeopleIcon } from "../../svgs/PeopleIcon"


export const CohortList = () => {
    const [editSlack, setSlackEdit] = useState(0)
    const { getStudents } = useContext(PeopleContext)
    const {
        getCohorts, cohorts, leaveCohort,
        joinCohort, updateCohort, activateCohort
    } = useContext(CohortContext)
    const history = useHistory()

    useEffect(() => {
        getStudents("unassigned")
        getLastFourCohorts()
    }, [])

    const getLastFourCohorts = () => getCohorts({ limit: 5 })

    const slackEditInput = (cohort) => {
        return <input type="text" autoFocus style={{ fontSize: "smaller" }} onKeyUp={e => {
            if (e.key === "Enter") {
                const updatedCohort = { ...cohort, slack_channel: e.target.value }
                updateCohort(updatedCohort).then(() => {
                    getLastFourCohorts()
                    setSlackEdit(0)
                })
            }
            else if (e.key === "Escape") {
                setSlackEdit(0)
            }
        }} defaultValue={cohort.slack_channel} />
    }

    const slackDisplay = (cohort) => {
        return <>
            {cohort.slack_channel}
            <EditIcon helpFunction={() => {
                setSlackEdit(cohort.id)
            }} />
        </>
    }

    const leave = (cohort) => {
        leaveCohort(cohort.id)
            .then(getLastFourCohorts)
            .then(() => {
                localStorage.removeItem("activeCohort")
                activateCohort({})
            })
            .catch(window.alert)
    }

    const join = (cohort) => {
        joinCohort(cohort.id)
            .then(getLastFourCohorts)
            .then(() => {
                localStorage.setItem("activeCohort", cohort.id)
                activateCohort(cohort)
            })
            .catch(window.alert)

    }

    return <>
        <button className="button button--isi button--border-thick button--round-l button--size-s studentList__createCohort"
            onClick={() => history.push("/cohorts/new")}>
            <i className="button__icon icon icon-book"></i>
            <span>Create Cohort</span>
        </button>
        <div className="cohorts">

            {
                cohorts.map(cohort => {
                    return <section key={`cohort--${cohort.id}`} className="cohort">
                        <h3 className="cohort__header">{cohort.name}</h3>
                        <div className="cohort__join">
                            {
                                cohort.is_instructor === 1
                                    ? <button onClick={() => leave(cohort)} className="fakeLink">Leave</button>
                                    : <button onClick={() => join(cohort)} className="fakeLink">Join</button>
                            }

                        </div>
                        <div className="cohort__dates">
                            <div>
                                {
                                    new Date(cohort.start_date.replace(/-/g, '\/')).toLocaleDateString("en-US",
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            timeZone: 'America/Chicago'
                                        })
                                }
                            </div>
                            <div style={{ width: "30%" }}><hr /></div>
                            <div>
                                {
                                    new Date(cohort.end_date.replace(/-/g, '\/')).toLocaleDateString("en-US",
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            timeZone: 'America/Chicago'
                                        })
                                }
                            </div>
                        </div>
                        <h4>Coaches</h4>
                        <div className="cohort__coaches">
                            {
                                cohort.coaches.map(coach => <div key={`coach--${coach.name}`} className="instructor--badge cohort__coach">{coach.name}</div>)
                            }

                        </div>

                        <footer className="cohort__footer">
                            <div>
                                <PeopleIcon /> {cohort.students}
                            </div>
                            <div>
                                {
                                    editSlack === cohort.id
                                        ? slackEditInput(cohort)
                                        : slackDisplay(cohort)
                                }
                            </div>
                        </footer>
                    </section>
                })
            }
        </div>

        <UnassignedStudents getLastFourCohorts={getLastFourCohorts} />
    </>

}
