import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { Record } from "../records/Record.js"
import { PeopleContext } from "./PeopleProvider.js"
import "./Student.css"

export const StudentOverview = ({ currentStudent }) => {
    const { activeStudent } = useContext(PeopleContext)
    const [student, setStudent] = useState({})
    const history = useHistory()

    useEffect(() => {
        if ("id" in activeStudent) {
            setStudent(activeStudent)
        }
    }, [activeStudent])

    useEffect(() => {
        if (currentStudent) {
            setStudent(currentStudent)
        }
    }, [currentStudent])

    return (
        "id" in student
            ? <div className="card student">
                <div className="card-body">
                    <header className="student__header">
                        <h2 className="card-title student__info">{student.name} ({student.cohorts.map(c => c.name).join(", ")})</h2>
                        <div className="student__score">
                            {student.score}
                        </div>
                    </header>
                    <div className="card-text">
                        <div className="student__github">
                            Github: <a href={`https://www.github.com/${student.github}`}>
                                {`https://www.github.com/${student.github}`}</a>
                        </div>

                        <button className="button button--isi button--border-thick button--round-l button--size-s button--record"
                            onClick={() => {
                                history.push(`/records/new/${student.id}`)
                            }}
                        >
                            <i className="button__icon icon icon-book"></i>
                            <span>New Objective Record</span>
                        </button>

                        <button className="button button--isi button--border-thick button--round-l button--size-s button--record"
                            onClick={() => {
                                history.push({
                                    pathname: "/feedback/new",
                                    state: {
                                        studentId: student.id
                                    }
                                })
                            }}
                        >
                            <i className="button__icon icon icon-write"></i>
                            <span>Send Feedback</span>
                        </button>

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
