import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { RecordContext } from "./RecordProvider"
import "./Record.css"

export const RecordList = () => {
    const history = useHistory()
    const { getRecords, records, deleteRecordEntry } = useContext(RecordContext)

    useEffect(() => {
        getRecords()
    }, [])

    return (
        <>
            <header>
                <button className="btn btn-2 btn-sep icon-create"
                    onClick={() => {
                        history.push({ pathname: "/records/new" })
                    }}
                >New Record</button>
            </header>
            <article className="recordWeights">
                <section className="records">
                {
                    records.map(record => {
                        return <div key={`record--${record.id}`} className="record">
                            <header className="record__header">
                                {record.student.name} {record.description}

                                <span className="record__addto fakeLink small" onClick={() => {
                                    history.push({ pathname: `/record/${record.id}/entries/new` })
                                }}
                                >Add to Record</span>
                            </header>
                            <div className="record__details">
                            {
                                record.weights.map(w => (
                                    <React.Fragment key={`recordweight--${w.id}`}>
                                        <div  className="record__entry">
                                            <div className="record__score">
                                                {w.label} for {w.score} points
                                                <span className="record__delete fakeLink small" onClick={() => {
                                                    deleteRecordEntry(w.id)
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
                    })
                }
                </section>
            </article>
        </>
    )
}
