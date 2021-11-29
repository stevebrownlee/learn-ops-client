import React, { useContext } from "react"
import { PeopleContext } from "./PeopleProvider.js"

export const Student = ({ student }) => {
    const { getStudent } = useContext(PeopleContext)
    return (
        <>
            <div className="fakeLink" onClick={() => getStudent(student.id)}>{student.name}</div>
            <div className="cell--centered">{student.score}</div>
        </>
    )
}
