import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { HumanDate } from "../utils/HumanDate.js"
import { RecordContext } from "./RecordProvider"
import "./Record.css"

export const RecordList = () => {
    const history = useHistory()
    const { getWeights, weights } = useContext(RecordContext)

    useEffect(() => {
        getWeights()
    }, [])

    return (
        <>
            <header>
                <div className="titlebar">
                    <h1>Learning Records</h1>

                </div>
                <button className="btn btn-2 btn-sep icon-create"
                    onClick={() => {
                        history.push({ pathname: "/records/new" })
                    }}
                >New Learning Record</button>
            </header>
            <article className="weights">
                {
                    weights.map(weight => {
                        return <section key={`weight--${weight.id}`} className="weight">
                            {weight.label} {weight.weight}
                        </section>
                    })
                }
            </article>
        </>
    )
}