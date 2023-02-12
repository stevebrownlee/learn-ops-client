import React, { useContext, useState, useEffect, useCallback } from "react"
import { useHistory, useParams } from "react-router-dom"
import { AssessmentContext } from "../assessments/AssessmentProvider"
import { CourseContext } from "../course/CourseProvider"
import { stateCheckboxSync, stateSync } from "../utils/StateSync"
import "./Assessments.css"

export const AssessmentForm = () => {
    const defaultState = {
        name: "",
        sourceURL: "",
        bookId: 0
    }
    const [assessment, changeAssessment] = useState(defaultState)
    const [books, setBooks] = useState([])
    const [learningObjectives, setObjectives] = useState(new Set())

    const { allAssessments, saveAssessment, getAssessment, editAssessment } = useContext(AssessmentContext)
    const { getBooks, objectives, getLearningObjectives } = useContext(CourseContext)

    const { assessmentId } = useParams()

    const history = useHistory()

    useEffect(() => {
        getBooks().then(setBooks)

        if (!objectives.length) {
            getLearningObjectives()
        }

        if (assessmentId) {
            getAssessment(assessmentId).then(data => {
                changeAssessment({
                    ...data,
                    bookId: data.assigned_book.id,
                    sourceURL: data.source_url
                })

                const objectives = new Set(data.objectives.map(o => o.id))
                setObjectives(objectives)
            })
        }
    }, [])

    const updateState = (event) => stateSync(event, assessment, changeAssessment)

    const create = (evt) => {
        evt.preventDefault()

        if (assessmentId) {
            return editAssessment({ ...assessment, objectives: Array.from(learningObjectives) })
            .then(() => history.push("/assessments"))

        }
        else {
            return saveAssessment({ ...assessment, objectives: Array.from(learningObjectives) })
            .then(() => history.push("/assessments"))

        }
    }

    return <article className="container--assessmentForm">
        <form className="recordForm">
            <h1 className="recordForm__title">New Assessment</h1>
            <fieldset>
                <div className="form-group">
                    <select id="bookId" className="form-control"
                        value={assessment.bookId}
                        controltype="number"
                        onChange={updateState}>
                        <option value="0">Select book...</option>
                        {
                            books.map(book => {
                                return <option key={`book--${book.id}`} value={book.id}>
                                    {book.course.name} - {book.name}
                                </option>
                            })
                        }
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

            <div className="assessment__objectives">
            {
                objectives.map(objective => {
                    const identifier = `objective--${objective.id}`

                    return <div className="assessment__objective" key={identifier}>
                        <input type="checkbox" id={identifier}
                            checked={learningObjectives.has(objective.id)}
                            onClick={() => stateCheckboxSync(learningObjectives, setObjectives, objective.id)}
                            style={{ margin: "0.2rem 0.2rem" }}
                        />
                        <label htmlFor={identifier}>{objective.label}</label>
                    </div>
                })
            }
            </div>

            <div className="recordFormButtons">
                <button type="submit"
                    onClick={create}
                    className="btn btn-primary">Create</button>
            </div>

        </form>
    </article >
}
