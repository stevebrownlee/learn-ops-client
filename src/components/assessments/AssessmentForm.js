import React, { useContext, useState, useEffect, useCallback } from "react"
import { useHistory } from 'react-router-dom'
import { AssessmentContext } from "../assessments/AssessmentProvider.js"


export const AssessmentForm = () => {
    const defaultState = {
        name: "",
        sourceURL: "",
        type: ""
    }
    const { getAssessmentList, allAssessments, saveAssessment } = useContext(AssessmentContext)
    const [assessment, changeAssessment] = useState(defaultState)

    const getData = useCallback(() => {
        getAssessmentList()
    }, [getAssessmentList])

    useEffect(() => {
        getData()
    }, [])

    const updateState = (event) => {
        const copy = { ...assessment }

        const newValue = {
            "string": event.target.value,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(event.target.value)
        }[event.target.attributes.controltype.value]

        copy[event.target.id] = newValue
        changeAssessment(copy)
    }

    const create = (evt) => {
        evt.preventDefault()
        return saveAssessment(assessment).then(getAssessmentList)
    }

    return (
        <article className="container--recordForm">
            <form className="recordForm">
                <h1 className="recordForm__title">New Assessment</h1>
                <fieldset>
                    <div className="form-group">
                        <select id="weight" className="form-control"
                            value={assessment.type}
                            controltype="string"
                            onChange={updateState}>
                            <option value="">Select assessment type</option>
                            <option value="SELF">Self Assessment</option>
                            <option value="ASSIGNED">NSS Formative Assessment</option>
                        </select>
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                        <label htmlFor="name">Name:</label>
                        <input id="name" required className="form-control"
                            type="text"
                            controltype="string"
                            placeholder="Informal assessment name"
                            value={assessment.name}
                            onChange={updateState}
                        />
                    </div>
                </fieldset>

                <fieldset>
                    <div className="form-group">
                        <label htmlFor="sourceURL">Source URL:</label>
                        <input id="sourceURL" required className="form-control"
                            type="text"
                            controltype="string"
                            placeholder="URL of template reposotory"
                            value={assessment.sourceURL}
                            onChange={updateState}
                        />
                    </div>
                </fieldset>

                <div className="recordFormButtons">
                    <button type="submit"
                        onClick={create}
                        className="btn btn-primary">Create</button>
                </div>

            </form>
        </article >
    )
}
