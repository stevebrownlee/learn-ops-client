import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Record } from "../records/Record.js"
import { PeopleContext } from "./PeopleProvider.js"
import "./Student.css"

export const StudentOverview = ({ currentStudent }) => {
    const { activeStudent } = useContext(PeopleContext)
    const { getAssessments, assessments } = useContext(AssessmentContext)
    const [student, setStudent] = useState({})
    const history = useHistory()

    useEffect(() => {
        if ("id" in activeStudent) {
            setStudent(activeStudent)
            getAssessments(activeStudent.id)
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

                        <ul className="tabs" role="tablist">
                            <li>
                                <input type="radio" name="tabs" id="tab1" checked />
                                <label htmlFor="tab1"
                                    role="tab"
                                    aria-selected="true"
                                    aria-controls="panel1"
                                    tabIndex="0">Objectives</label>
                                <div id="tab-content1"
                                    className="tab-content"
                                    role="tabpanel"
                                    aria-labelledby="description"
                                    aria-hidden="false">

                                    <section className="records--overview">
                                        {
                                            student.records.map(record => {
                                                return <Record key={`record--${record.id}`} record={record} />
                                            })
                                        }
                                    </section>
                                </div>
                            </li>

                            <li>
                                <input type="radio" name="tabs" id="tab2" />
                                <label htmlFor="tab2"
                                    role="tab"
                                    aria-selected="false"
                                    aria-controls="panel2"
                                    tabIndex="0">Assessments</label>
                                <div id="tab-content2"
                                    className="tab-content"
                                    role="tabpanel"
                                    aria-labelledby="specification"
                                    aria-hidden="true">
                                    <p>"Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla?</p>
                                </div>
                            </li>
                        </ul>


                    </div>
                </div>
            </div>
            : <div></div>
    )
}
