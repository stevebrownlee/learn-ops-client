import React, { useContext } from "react"
import { PeopleContext } from "./PeopleProvider.js"

export const Student = ({ student }) => {
    const { getStudent } = useContext(PeopleContext)

    return (
        <>
            <div className={`personality--${student.personality} cell fakeLink`} onClick={() => getStudent(student.id)}>{student.name}</div>
            <div className="cell cell--centered">{student.score}</div>
        </>
    )
}
