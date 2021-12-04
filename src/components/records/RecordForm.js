import React, { useContext, useState, useEffect, useCallback } from "react"
import { RecordContext } from "./RecordProvider.js"
import { useHistory } from 'react-router-dom'
import { PeopleContext } from "../people/PeopleProvider.js"
import { useLocation } from "react-router-dom/cjs/react-router-dom.min"
import { CohortContext } from "../cohorts/CohortProvider.js"


export const RecordForm = () => {
    const history = useHistory()
    const location = useLocation()

    const { createRecord, getWeights, weights } = useContext(RecordContext)
    const { getStudents, students, getStudent } = useContext(PeopleContext)
    const { getCohort, activeCohort } = useContext(CohortContext)

    const [newRecord, storeRecord] = useState({
        student: 0,
        description: "",
        obtained_from: "",
        weight: 0,
        note: ""
    })

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
                        <label htmlFor="description">Description:</label>
                        <input type="text" id="description" required className="form-control"
                            value={newRecord.description}
                            onChange={updateState}
                        />
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
                            .then(() => getStudent(newRecord.student))
                            .then(() => {
                                if ("id" in activeCohort) {
                                    getCohort(activeCohort.id)
                                }
                            })
                            .then(() => history.push("/"))
                    }}
                    className="btn btn-primary">Create</button>

            </form>
        </article>
    )
}