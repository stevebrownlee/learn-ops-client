import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { RecordContext } from "./RecordProvider"
import "./Record.css"

export const RecordList = () => {
    const history = useHistory()
    const { getWeights, weights, getRecords, records } = useContext(RecordContext)

    useEffect(() => {
        getWeights().then(getRecords)
    }, [])

    return (
        <>
            <header>
                <div className="titlebar">
                    <h1>Learning Records</h1>
                    <button className="btn btn-2 btn-sep icon-create"
                        onClick={() => {
                            history.push({ pathname: "/records/new" })
                        }}
                    >New Record</button>
                </div>
            </header>
            <article className="recordWeights">
                <section className="records">
                    {
                        records.map(record => {
                            return <div key={`record--${record.id}`} className="record">
                                <header className="record__header">
                                    {record.student.name} {record.description}
                                </header>
                                <div className="record__details">
                                    <div className="record__separator"></div>
                                    {
                                        record.weights.map(w => <div key={`recordweight--${w.id}`} className="record__entry">
                                            <div className="record__score">{w.label} for {w.score} points</div>
                                            <div className="record__note">{w.note}</div>
                                            <div className="record__date">Recorded on {w.recorded_on} by {w.instructor.name}</div>
                                        </div>)
                                    }
                                </div>
                            </div>
                        })
                    }
                </section>
                <section className="weights">
                    {
                        weights.map(weight => {
                            return <div key={`weight--${weight.id}`} className="weight">
                                {weight.label} {weight.weight}
                            </div>
                        })
                    }
                </section>
            </article>
        </>
    )
}