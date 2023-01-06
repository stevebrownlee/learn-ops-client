import React, { useContext, useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from 'react-router-dom'
import { RecordContext } from "./RecordProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"


export const RecordEntryForm = () => {
    const history = useHistory()
    const { recordId } = useParams()

    const { getRecord, getWeights, weights, createRecordEntry } = useContext(RecordContext)
    const { getStudent } = useContext(PeopleContext)
    const { getCohort, activeCohort } = useContext(CohortContext)

    const [record, storeRecord] = useState({
        student: {},
        achieved: false,
        weight: 0,
        note: ""
    })

    const getData = useCallback((recordId) => {
        getWeights().then(() => getRecord(recordId)).then(data => storeRecord(data))
    }, [getWeights, getRecord, storeRecord])

    useEffect(() => {
        getData(recordId)
    }, [recordId, getData])


    const updateState = (event) => {
        const copy = { ...record }
        copy[event.target.id] = event.target.value
        storeRecord(copy)
    }

    return (
        <article className="container--recordForm">
            <form className="recordForm">
                <h2 className="recordForm__title">New Learning Record Entry</h2>

                <fieldset>
                    <div className="form-group">
                        { record.student.name }
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                        <select id="weight" className="form-control"
                            value={record.weight}
                            onChange={updateState}>
                            <option value="0">Select a weight</option>
                            {
                                weights.map(weight => (
                                    <option key={weight.id} value={weight.id}> {weight.label} </option>
                                ))
                            }
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="note">Note:</label>
                        <textarea id="note"
                            required className="form-control"
                            value={record.note}
                            onChange={updateState}
                        ></textarea>
                    </div>
                </fieldset>

                <button type="submit"
                    onClick={evt => {
                        evt.preventDefault()
                        const newEntry = {
                            record: recordId,
                            note: record.note,
                            weight: record.weight
                        }
                        createRecordEntry(newEntry)
                            .then(() => getStudent(record.student.id))
                            .then(() => {
                                if ("id" in activeCohort) {
                                    getCohort(activeCohort)
                                }
                            })
                            .then(() => history.push("/"))
                    }}
                    className="btn btn-primary">Create</button>

            </form>
        </article>
    )
}
