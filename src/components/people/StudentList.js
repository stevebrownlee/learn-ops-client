import React, { useContext, useEffect, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth"
import { CohortContext } from "../cohorts/CohortProvider"
import { PeopleContext } from "./PeopleProvider"
import "./StudentList.css"


export const StudentList = () => {
    const [chosenCohort, setCohort] = useState(0)
    const [chosenStudents, updateStudents] = useState(new Set())
    const { students, getStudents } = useContext(PeopleContext)
    const { getCohorts, cohorts } = useContext(CohortContext)
    const { getCurrentUser } = useSimpleAuth()


    useEffect(() => {
        getStudents()
        getCohorts()
    }, [])

    return (
        <div className="studentList">
            <h2>Student List</h2>
            <div className="studentList__options">
                <div>
                    <select value={chosenCohort} onChange={e => setCohort(e.target.value)}>
                        <option value="0">Assign to cohort...</option>
                        {
                            cohorts.map(cohort => {
                                return <option key={`cohort--${cohort.id}`} value={cohort.id}>{cohort.name}</option>
                            })
                        }
                    </select>
                    <button className="button--commit"
                        onClick={() => {
                            const fetches = []

                            const students = [...chosenStudents]
                            students.forEach(s => fetches.push(
                                fetch(`http://localhost:8000/cohorts/${chosenCohort}/assign`, {
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
                </div>
            </div>
            {
                students.map(student => {
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
            }
        </div>
    )

}
