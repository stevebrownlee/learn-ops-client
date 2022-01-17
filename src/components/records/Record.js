import React, { useContext } from "react"
import { useHistory } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { RecordContext } from "./RecordProvider"
import { PeopleContext } from "../people/PeopleProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import "./Record.css"

export const Record = ({ record }) => {
    const history = useHistory()
    const { deleteRecordEntry } = useContext(RecordContext)
    const { activeCohort } = useContext(CohortContext)
    const { getStudent, getCohortStudents } = useContext(PeopleContext)

    return (
        <>
            <div key={`record--${record.id}`} className="record">
                <header className="record__header">
                    {record.description}

                    <span className="record__addto fakeLink small" onClick={() => {
                        history.push({ pathname: `/record/${record.id}/entries/new` })
                    }}
                    >Add to Record</span>
                </header>
                <div className="record__details">
                    {
                        record.weights.map(w => (
                            <React.Fragment key={`recordweight--${w.id}`}>
                                <div className="record__entry">
                                    <div className="record__score">
                                        {w.label} for {w.score} points
                                        <span className="record__delete fakeLink small" onClick={() => {
                                            deleteRecordEntry(w.id).then(getStudent)
                                                .then(() => {
                                                    if ("id" in activeCohort) {
                                                        getCohortStudents(activeCohort.id)
                                                    }
                                                })
                                        }}
                                        >Delete</span>
                                    </div>
                                    <div className="record__note">{w.note}</div>
                                    <div className="record__date">Recorded on <HumanDate date={w.recorded_on} /> by {w.instructor.name}</div>
                                </div>
                                <div className="record__separator"></div>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
