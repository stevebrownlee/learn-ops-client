import React, { useContext } from "react"
import { PeopleContext } from "./PeopleProvider.js"

export const Student = ({ student }) => {
    const { getStudent } = useContext(PeopleContext)

    return (
        <>
            <div className={`personality--${student.personality} cell`}
                 onClick={() => getStudent(student.id)}>

                {
                    student.proposals.map(p => {
                        if (p.status === "submitted") {
                            return "📕 "
                        }
                        else if (p.status === "reviewed") {
                            return "📒 "
                        }
                        else if (p.status === "approved") {
                            return "📗 "
                        }
                    })
                }

                <span className="fakeLink">
                    {student.name}
                </span>
            </div>
            <div className="cell cell--centered">{student.score}</div>
        </>
    )
}
