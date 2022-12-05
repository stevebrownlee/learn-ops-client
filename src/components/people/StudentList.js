import Settings from "../Settings"
import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../auth/useSimpleAuth"
import { CohortContext } from "../cohorts/CohortProvider"
import { PeopleContext } from "./PeopleProvider"
import { HumanDate } from "../utils/HumanDate"
import { EditIcon } from "../../svgs/Edit"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import "./StudentList.css"
import { fetchIt } from "../utils/Fetch"
import { HelpIcon } from "../../svgs/Help"


export const StudentList = () => {
    const [chosenCohort, setCohort] = useState(0)
    const [editSlack, setSlackEdit] = useState(0)
    const [chosenStudents, updateStudents] = useState(new Set())
    const { students, getStudents } = useContext(PeopleContext)
    const { getCohorts, cohorts, leaveCohort, joinCohort, updateCohort } = useContext(CohortContext)
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()

    useEffect(() => {
        getStudents("unassigned")
        getLastFourCohorts()
    }, [])

    const getLastFourCohorts = () => getCohorts({ limit: 4 })

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

    const leave = (cohortId) => {
        leaveCohort(cohortId).then(getLastFourCohorts)
    }

    const join = (cohortId) => {
        joinCohort(cohortId).then(getLastFourCohorts)
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
                                    ? <button onClick={() => leave(cohort.id)} className="fakeLink">Leave</button>
                                    : <button onClick={() => join(cohort.id)} className="fakeLink">Join</button>
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

        <div className="studentList">
            <h2>Unassigned Students</h2>
            <div className="studentList__options">
                <select value={chosenCohort} onChange={e => setCohort(e.target.value)}>
                    <option value="0">Assign to cohort...</option>
                    {
                        cohorts.map(cohort => {
                            return <option key={`cohort--${cohort.id}`} value={cohort.id}>{cohort.name}</option>
                        })
                    }
                </select>

                <button className="button button--isi button--border-thick button--round-l button--size-s"
                    onClick={() => {
                        const fetches = []

                        const students = [...chosenStudents]
                        students.forEach(s => fetches.push(
                            fetchIt(`${Settings.apiHost}/cohorts/${chosenCohort}/assign`, {
                                method: "POST",
                                body: JSON.stringify({
                                    person_id: parseInt(s)
                                })
                            })
                        ))

                        Promise.all(fetches)
                            .then(() => getStudents("unassigned"))
                            .then(getLastFourCohorts)
                    }}>
                    <i className="button__icon icon icon-book"></i>
                    <span>Assign Students</span>
                </button>
            </div>
            <div className="studentList__student">
                <div></div>
                <h2>Student</h2>
                <h2>Joined On</h2>
            </div>
            {
                students.length > 0
                    ? students.map(student => {
                        return <div className="studentList__student" key={`student--${student.id}`}>
                            <input type="checkbox" value={student.id}
                                onChange={(e) => {
                                    const copy = new Set(chosenStudents)

                                    copy.has(e.target.value)
                                        ? copy.delete(e.target.value)
                                        : copy.add(e.target.value)

                                    updateStudents(copy)
                                }}
                            />
                            <div>
                                {student.name}
                            </div>
                            <div>
                                {
                                    new Date(student.date_joined).toLocaleDateString("en-US",
                                        {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            timeZone: 'America/Chicago'
                                        })
                                }
                            </div>
                        </div>
                    })
                    : `No unassigned students`
            }
        </div>
    </>

}
