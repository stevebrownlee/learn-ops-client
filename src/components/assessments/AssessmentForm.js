import React, { useContext, useState, useEffect, useCallback } from "react"
import { useHistory } from 'react-router-dom'
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { CourseContext } from "../course/CourseProvider.js"


export const AssessmentForm = () => {
    const defaultState = {
        name: "",
        sourceURL: "",
        bookId: 0
    }
    const { getAssessmentList, allAssessments, saveAssessment } = useContext(AssessmentContext)
    const { getCourses, courses, getBooks } = useContext(CourseContext)
    const [assessment, changeAssessment] = useState(defaultState)

    const [books, setBooks] = useState([])

    const getData = useCallback(() => {
        getAssessmentList()
        getBooks().then(setBooks)
    }, [getAssessmentList, getBooks])

    useEffect(() => {
        getData()
    }, [])

    useEffect(() => {
        getBooks().then(setBooks)
    }, [allAssessments])

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
        return saveAssessment(assessment).then(getData).then(() => {
            changeAssessment(defaultState)
        })
    }

    return (
        <article className="container--assessmentForm">
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
                                        if (!book.has_assessment) {
                                            return <option key={`book--${book.id}`} value={book.id}>
                                                {book.course.name} - {book.name}
                                            </option>
                                        }
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

                <div className="recordFormButtons">
                    <button type="submit"
                        onClick={create}
                        className="btn btn-primary">Create</button>
                </div>

            </form>
        </article >
    )
}
