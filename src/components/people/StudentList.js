import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { Record } from "../records/Record"
import { PeopleContext } from "./PeopleProvider"
import { StudentOverview } from "./StudentOverview"

export const StudentList = () => {

    const { students, getStudents } = useContext(PeopleContext)
    const history = useHistory()

    useEffect(() => {
        getStudents()
    }, [])

    return (
        <>
            {
                students.map(student => {
                    return <StudentOverview currentStudent={student} key={`student--${student.id}`} />
                })
            }
        </>
    )
}
