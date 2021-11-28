import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { Record } from "../records/Record.js"
import { PeopleContext } from "./PeopleProvider.js"
import "./Student.css"

export const StudentOverview = () => {
    const { activeStudent: student } = useContext(PeopleContext)
    const [score, updateScore] = useState(0)
    const history = useHistory()

    useEffect(() => {
        if ("id" in student) {
            const learningScore = student.records.reduce(
                (total, current) => {
                    return total + current.weights.reduce(
                        (tot, curr) =>  tot + curr.score, 0
                    )
                }, 0
            )
            updateScore(learningScore)
        }
    }, [student])

    return (
        "id" in student
            ? <div className="card student">
                <div className="card-body">
                    <h2 className="card-title">{student.name} ({student.cohorts.map(c => c.name).join(", ")})</h2>
                    <h3 className="card-title">Learning progress: {score}</h3>
                    <div className="card-text">
                        <div>
                            Github: <a href={`https://www.github.com/${student.github_handle}`}>
                                {`https://www.github.com/${student.github_handle}`}</a>
                        </div>

                        <button className="btn btn-2 btn-sep icon-create"
                            onClick={() => {
                                history.push({
                                    pathname: "/records/new",
                                    state: {
                                        studentId: student.id
                                    }
                                })
                            }}
                        >New Record</button>
                        <section className="records--overview">
                            {
                                student.records.map(record => {
                                    return <Record key={`record--${record.id}`} record={record} />
                                })
                            }
                        </section>
                    </div>
                </div>
            </div>
            : <div></div>
    )
}
