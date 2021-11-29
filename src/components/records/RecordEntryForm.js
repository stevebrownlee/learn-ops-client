import React, { useContext, useState, useEffect, useCallback } from "react"
import { RecordContext } from "./RecordProvider.js"
import { useHistory } from 'react-router-dom'
import { PeopleContext } from "../people/PeopleProvider.js"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"


export const RecordEntryForm = () => {
    const history = useHistory()
    const { recordId } = useParams()

    const { getRecord, getWeights, weights, createRecordEntry } = useContext(RecordContext)
    const { getStudent } = useContext(PeopleContext)

    const [record, storeRecord] = useState({
        student: {},
        description: "",
        obtained_from: "ONEON",
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

    const displaySource = () => {
        let source = ""
        switch (record.obtained_from) {
            case "ONEON":
                source = "One on one"
                break;
            case "CLASS":
                source = "Github classroom"
                break;
            case "SCORE":
                source = "Google assessment score"
                break;
            default:
                break;
        }

        return source
    }

    return (
        <article className="container--recordForm">
            <form className="recordForm">
                <h2 className="recordForm__title">New Learning Record</h2>
                <fieldset>
                    <div className="form-group">
                        { record.student.name }
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        { record.description }
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
                        <input type="text" id="note" required className="form-control"
                            value={record.note}
                            onChange={updateState}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <label htmlFor="obtained_from">Source: </label>
                    { displaySource() }
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
                            .then(() => history.push("/"))
                    }}
                    className="btn btn-primary">Create</button>

            </form>
        </article>
    )
}