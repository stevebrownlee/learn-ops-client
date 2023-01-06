import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { RecordContext } from "./RecordProvider"
import { PeopleContext } from "../people/PeopleProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import "./Record.css"

export const Record = ({ record }) => {
    const history = useHistory()
    const [ activeRecord, updateActiveRecord ] = useState({})
    const { deleteRecordEntry, updateRecord } = useContext(RecordContext)
    const { activeCohort } = useContext(CohortContext)
    const { getStudent, getCohortStudents } = useContext(PeopleContext)

    useEffect(() => {
       updateActiveRecord({...record})
    }, [record])

    const markAsAchieved = () => {
        const copy = {...record}
        copy.achieved = true
        updateRecord(copy)
            .then(() => getStudent())
            .then(() => {
                if ("id" in activeCohort) {
                    getCohortStudents(activeCohort)
                }
            })
    }

    return (
        <>
            <div key={`record--${activeRecord.id}`} className="record">
                <div className={`record__status ${activeRecord.achieved ? "status--achieved" : "status--incomplete"}`}>
                    {
                        activeRecord.achieved
                            ? "Achieved"
                            : <div className="dropdown">
                                <div className="dropdown__text">In progress</div>
                                <div className="dropdown__content">
                                    <a className="dropdownItem" href="#"
                                        onClick={() => {
                                            history.push({ pathname: `/record/${activeRecord.id}/entries/new` })
                                        }}
                                    >Add to record</a>
                                    <a href="#"
                                        className="dropdownItem"
                                        onClick={() => markAsAchieved()}
                                    >Mark achieved</a>
                                </div>
                            </div>
                    }
                </div>
                <header className="record__header">
                    <h3>{activeRecord?.weight?.label}</h3>
                </header>
                <details open={ !activeRecord.achieved }>
                    <div className="record__details">
                        {
                            activeRecord?.entries?.map(entry => (
                                <React.Fragment key={`entry--${entry.id}`}>
                                    <div className="entry">
                                        <div className="entry__note"> {entry.note} </div>
                                        <div className="entry__date">
                                            Recorded on <HumanDate date={entry.recorded_on} /> by {entry.instructor}
                                            <span className="entry__delete small" onClick={() => {
                                                deleteRecordEntry(entry.id)
                                                    .then(getStudent)
                                                    .then(() => {
                                                        if ("id" in activeCohort) {
                                                            getCohortStudents(activeCohort)
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
                </details>
            </div>
        </>
    )
}
