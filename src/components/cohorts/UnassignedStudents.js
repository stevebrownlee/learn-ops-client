import Settings from "../Settings"
import React, { useContext, useEffect, useState } from "react"
import { CohortContext } from "./CohortProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { fetchIt } from "../utils/Fetch"
import "./CohortList.css"
import "./Cohort.css"


export const UnassignedStudents = ({ getLastFourCohorts }) => {
    const [chosenCohort, setCohort] = useState(0)
    const [chosenStudents, updateStudents] = useState(new Set())
    const { students, getStudents } = useContext(PeopleContext)
    const { cohorts } = useContext(CohortContext)

    useEffect(() => {
        getStudents("unassigned")
    }, [])


    return <div className="studentList">
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
}
