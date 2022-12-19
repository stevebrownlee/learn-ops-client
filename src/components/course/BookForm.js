import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const BookForm = () => {
    const [courses, setCourses] = useState([])
    const [mode, setMode] = useState("create")
    const { getCourses, getBook, editBook } = useContext(CourseContext)
    const [book, updateBook] = useState({
        name: "",
        description: "",
        course: 0,
        index: 0
    })
    const history = useHistory()
    const { bookId } = useParams()

    useEffect(() => {
        getCourses().then(setCourses)
    }, [])

    useEffect(() => {
        if (bookId) {
            getBook(bookId).then(data => {
                data.course = data.course.id
                updateBook(data)
            })
            setMode("edit")
        }
    }, [bookId])

    const constructNewBook = () => {
        fetchIt(`${Settings.apiHost}/books`, { method: "POST", body: JSON.stringify(book) })
            .then(() => history.push("/books"))
    }

    const updateState = (event) => {
        const copy = { ...book }

        const newValue = {
            "string": event.target.value,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(event.target.value)
        }[event.target.attributes.controltype.value]

        copy[event.target.id] = newValue
        updateBook(copy)
    }

    return (
        <>
            <form className="projectForm view">
                <h2 className="projectForm__title">New Book</h2>
                <div className="form-group">
                    <label htmlFor="name"> Book name </label>
                    <input onChange={updateState}
                        value={book.name}
                        type="text" required autoFocus
                        controltype="string"
                        id="name" className="form-control"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="name"> Description </label>
                    <input onChange={updateState}
                        value={book.description}
                        type="text" required
                        controltype="string"
                        id="description" className="form-control"
                    />
                </div>

                <fieldset>
                    <div className="form-group">
                        <label htmlFor="course"> Course </label>
                        <select id="course" className="form-control"
                            value={book.course}
                            controltype="number"
                            onChange={updateState}>
                            <option value="0">Select course...</option>
                            {
                                courses.map(course => {
                                    return <option key={`course--${course.id}`} value={course.id}>
                                        {course.name}
                                    </option>
                                })
                            }
                        </select>
                    </div>
                </fieldset>

                <div className="form-group">
                    <label htmlFor="index">
                        Position in course
                        <HelpIcon tip="Order in course staring at 0" />
                    </label>
                    <input onChange={updateState}
                        value={book.index}
                        type="number" required
                        controltype="number"
                        id="index" className="form-control"
                        style={{ maxWidth: "4rem" }}
                    />
                </div>


                <button type="submit"
                    onClick={
                        evt => {
                            evt.preventDefault()

                            if (mode === "create") {
                                constructNewBook()
                            }
                            else {
                                editBook(book).then(() => history.push("/books"))
                            }
                        }
                    }
                    className="btn btn-primary"> Save </button>
            </form>
        </>
    )
}
