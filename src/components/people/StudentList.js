import React, { useContext, useEffect, useState } from "react"
import { CohortContext } from "../cohorts/CohortProvider"
import { PeopleContext } from "./PeopleProvider"
import "./StudentList.css"


export const StudentList = () => {
    const [chosenCohort, setCohort] = useState(0)
    const [chosenStudents, updateStudents] = useState(new Set())
    const { students, getStudents } = useContext(PeopleContext)
    const { getCohorts, cohorts } = useContext(CohortContext)

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
