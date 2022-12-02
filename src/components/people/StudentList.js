import Settings from "../Settings"
import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../auth/useSimpleAuth"
import { CohortContext } from "../cohorts/CohortProvider"
import { PeopleContext } from "./PeopleProvider"
import { HumanDate } from "../utils/HumanDate"
import "./StudentList.css"
import slackLogo from "../teams/images/slack.png"


export const StudentList = () => {
    const [chosenCohort, setCohort] = useState(0)
    const [editSlack, setSlackEdit] = useState(0)
    const [chosenStudents, updateStudents] = useState(new Set())
    const { students, getStudents } = useContext(PeopleContext)
    const { getCohorts, cohorts } = useContext(CohortContext)
    const { getCurrentUser } = useSimpleAuth()
    const history = useHistory()

    useEffect(() => {
        getStudents("unassigned")
        getCohorts({ limit: 4 })
    }, [])

    const slackEditInput = (current) => {
        return <input type="text" value={current} />
    }

    const slackDisplay = (cohort) => {
        return <>
            {cohort.slack_channel}
            <img onClick={() => {
                setSlackEdit(cohort.id)
            }}
                className="icon--slack--cohort" src={slackLogo} alt="Create Slack team channel" />
        </>
    }

    return <>
        <div className="cohorts">
            {
                cohorts.map(cohort => {
                    return <section key={`cohort--${cohort.id}`} className="cohort">
                        <h2>{cohort.name}</h2>
                        <div className="cohort__join">
                            <button className="fakeLink">Join</button>
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
                                {cohort.students} students
                            </div>
                            <div>
                                {
                                    editSlack === cohort.id
                                        ? slackEditInput(cohort.slack_channel)
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
                <button className="studentList__commit button--commit"
                    onClick={() => {
                        const fetches = []

                        const students = [...chosenStudents]
                        students.forEach(s => fetches.push(
                            fetch(`${Settings.apiHost}/cohorts/${chosenCohort}/assign`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                    Authorization: `Token ${getCurrentUser().token}`
                                },
                                body: JSON.stringify({
                                    person_id: parseInt(s)
                                })
                            })
                        ))

                        Promise.all(fetches).then(getStudents)
                    }}
                >Commit Change</button>

                <button onClick={() => history.push("/cohorts/new")} className="studentList__createCohort">Create New Cohort</button>
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
                                    student.cohorts.length > 0
                                        ? student.cohorts[0].name
                                        : "Not assigned"
                                }
                            </div>
                        </div>
                    })
                    : `No unassigned students`
            }
        </div>
    </>

}
