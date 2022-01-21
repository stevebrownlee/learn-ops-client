import React, { useContext, useState, useEffect, useCallback } from "react"
import { RecordContext } from "./RecordProvider.js"
import { useHistory } from 'react-router-dom'
import { PeopleContext } from "../people/PeopleProvider.js"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { CohortContext } from "../cohorts/CohortProvider.js"


export const RecordForm = () => {
    const defaultRecordState = {
        student: 0,
        achieved: false,
        weight: 0,
        note: ""
    }
    const history = useHistory()
    const location = useLocation()

    const { createRecord, getWeights, weights } = useContext(RecordContext)
    const { getCohortStudents, getStudents, students, getStudent } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)

    const [newRecord, storeRecord] = useState(defaultRecordState)

    const getData = useCallback(() => {
        getWeights().then(getStudents)

    }, [getWeights, getStudents])

    useEffect(() => {
        getData()
    }, [])


    useEffect(() => {
        const updateStudent = (location) => {
            const copy = { ...newRecord }
            copy.student = location?.state?.studentId
            storeRecord(copy)
        }

        if (newRecord.student !== location?.state?.studentId) {
            updateStudent(location)
        }
    }, [location, newRecord])


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
            .then(() => getStudent())
            .then(() => {
                if ("id" in activeCohort) {
                    getCohortStudents(activeCohort.id)
                }
            })
    }

    return (
        <article className="container--recordForm">
            <form className="recordForm">
                <h2 className="recordForm__title">New Learning Record</h2>
                <fieldset>
                    <div className="form-group">
                        <select id="student" className="form-control"
                            autoFocus
                            controltype="number"
                            disabled={location?.state?.studentId}
                            value={newRecord.student}
                            onChange={updateState}>
                            <option value="0">Select a student</option>
                            {
                                students.map(student => (
                                    <option key={student.id}
                                        value={student.id}>
                                        {student?.name}
                                    </option>
                                ))
                            }
                        </select>
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
                    <input id="achieved" type="checkbox" value={newRecord.achieved}
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