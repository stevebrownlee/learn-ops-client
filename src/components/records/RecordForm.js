import React, { useContext, useState, useEffect } from "react"
import { RecordContext } from "./RecordProvider.js"
import { useParams, useHistory } from 'react-router-dom'
import { PeopleContext } from "../people/PeopleProvider.js"
import useSimpleAuth from "../auth/useSimpleAuth.js"


export const RecordForm = () => {
    const history = useHistory()

    const { createRecord, getWeights, weights } = useContext(RecordContext)
    const { getStudents, students } = useContext(PeopleContext)
    const { getCurrentUser } = useSimpleAuth()

    const [newRecord, storeRecord] = useState({
        student: 0,
        description: "",
        obtained_from: "",
        weight: 0,
        note: ""
    })

    useEffect(() => {
        getWeights().then(getStudents)
    }, [])


    const updateState = (event) => {
        const copy = { ...newRecord }
        copy[event.target.id] = event.target.value
        storeRecord(copy)
    }

    return (
        <article className="container--recordForm">
            <form className="recordForm">
                <h2 className="recordForm__title">New Learning Record</h2>
                <fieldset>
                    <div className="form-group">
                        <select id="student" className="form-control"
                            autoFocus
                            value={newRecord.student}
                            onChange={updateState}>
                            <option value="0">Select a student</option>
                            {
                                students.map(student => (
                                    <option key={student.id} value={student.id}> {student?.name} </option>
                                ))
                            }
                        </select>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <select id="weight" className="form-control"
                            value={newRecord.weight}
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
                        <label htmlFor="description">Description:</label>
                        <input type="text" id="description" required className="form-control"
                            value={newRecord.description}
                            onChange={updateState}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <label htmlFor="note">Note:</label>
                        <input type="text" id="note" required className="form-control"
                            value={newRecord.note}
                            onChange={updateState}
                        />
                    </div>
                </fieldset>
                <fieldset>
                    <label htmlFor="obtained_from">Source:</label>
                    <div className="form-group">
                        <input onChange={updateState} type="radio" value="ONEON" name="obtained_from" id="obtained_from" /> One on one
                    </div>
                    <div className="form-group">
                        <input onChange={updateState} type="radio" value="CLASS" name="obtained_from" id="obtained_from" /> Github classroom
                    </div>
                    <div className="form-group">
                        <input onChange={updateState} type="radio" value="SCORE" name="obtained_from" id="obtained_from" /> Assessment score
                    </div>
                </fieldset>

                <button type="submit"
                    onClick={evt => {
                        evt.preventDefault()
                        createRecord(newRecord)
                            // .then(() => history.push("/games"))
                    }}
                    className="btn btn-primary">Create</button>

            </form>
        </article>
    )
}