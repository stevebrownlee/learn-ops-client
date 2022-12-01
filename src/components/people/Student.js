import React, { useContext } from "react"
import { PeopleContext } from "./PeopleProvider.js"

export const Student = ({ student }) => {
    const { getStudent } = useContext(PeopleContext)

    return (
        <>
            <div className={`personality--${student.personality} cell`}
                 onClick={() => getStudent(student.id)}>
                {student.pending_proposal ? "📕 " : ""}
                <span className="fakeLink">
                    {student.name}
                </span>
            </div>
            <div className="cell cell--centered">{student.score}</div>
        </>
    )
}
