import React, { useContext, useState, useEffect, useCallback } from "react"
import { RecordContext } from "./RecordProvider.js"
import { useHistory, useParams } from 'react-router-dom'
import { PeopleContext } from "../people/PeopleProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"


export const RecordForm = () => {
    const defaultRecordState = {
        student: 0,
        achieved: false,
        weight: 0,
        note: ""
    }
    const history = useHistory()
    const { studentId } = useParams()

    const { createRecord, getWeights, weights } = useContext(RecordContext)
    const { getCohortStudents, getStudent, activeStudent } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)

    const [newRecord, storeRecord] = useState(defaultRecordState)

    const getData = useCallback(() => {
        getWeights(studentId).then(() => getStudent(studentId))

    }, [getWeights, getStudent])

    useEffect(() => {
        getData()
    }, [studentId])


    useEffect(() => {
        const updateStudent = (studentId) => {
            const copy = { ...newRecord }
            copy.student = studentId
            storeRecord(copy)
        }

        if (newRecord.student !== studentId) {
            updateStudent(studentId)
        }
    }, [studentId, newRecord])


    const updateState = (event) => {
        const copy = { ...newRecord }

        const newValue = {
            "string": event.target.value,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(event.target.value)
        }[event.target.attributes.controltype.value]

        copy[event.target.id] = newValue
        storeRecord(copy)
    }

    const create = (evt) => {
        evt.preventDefault()
        return createRecord(newRecord)
            .then(() => getWeights(studentId))
            .then(() => getStudent(studentId))
            .then(() => {
                if ("id" in activeCohort) {
                    getCohortStudents(activeCohort)
                }
            })
    }

    return (
        <article className="container--recordForm">
            <form className="recordForm">
                <h1 className="recordForm__title">New Learning Record</h1>
                <fieldset>
                    <div className="form-group">
                        <h2>{ activeStudent.name }</h2>
                    </div>
                </fieldset>
                <fieldset>
                    <div className="form-group">
                        <select id="weight" className="form-control"
                            value={newRecord.weight}
                            controltype="number"
                            onChange={updateState}>
                            <option value="0">Select a learning objective</option>
                            {
                                weights.map(weight => (
                                    <option key={weight.id} value={weight.id}> {weight.label} [{weight.weight} pts] </option>
                                ))
                            }
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                    <label htmlFor="note">Objective achieved:</label>
                    <input id="achieved" type="checkbox" checked={newRecord.achieved}
                        controltype="boolean"
                        onChange={updateState} />
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                        <label htmlFor="note">Note:</label>
                        <textarea id="note" required className="form-control"
                            controltype="string"
                            placeholder="Provide comprehensive notes supporting your assessment"
                            value={newRecord.note}
                            onChange={updateState}
                        ></textarea>
                    </div>
                </fieldset>

                <div className="recordFormButtons">
                    <button type="submit"
                        onClick={evt => create(evt).then(() => history.push("/")) }
                        className="btn btn-primary">Create</button>

                    <button type="submit"
                        onClick={evt => create(evt).then(() => {
                            storeRecord(defaultRecordState)
                        })}
                        className="btn btn-primary">Create and Add Another</button>
            </div>

        </form>
        </article >
    )
}