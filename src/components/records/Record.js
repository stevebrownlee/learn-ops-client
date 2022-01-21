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
                        record.entries.map(entry => (
                            <React.Fragment key={`entry--${entry.id}`}>
                                <div className="entry">
                                    <div className="entry__note"> {entry.note} </div>
                                    <div className="entry__date">
                                        Recorded on <HumanDate date={entry.recorded_on} /> by {entry.instructor}
                                        <span className="entry__delete small" onClick={() => {
                                                deleteRecordEntry(entry.id).then(getStudent)
                                                    .then(() => {
                                                        if ("id" in activeCohort) {
                                                            getCohortStudents(activeCohort.id)
                                                        }
                                                    })
                                            }}
                                            >🚫</span>
                                    </div>
                                </div>
                                <div className="entry__separator"></div>
                            </React.Fragment>
                        ))
                    }
                </div>
            </div>
        </>
    )
}
