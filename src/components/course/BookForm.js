import React, { useContext, useEffect, useState } from "react"
import { useHistory, useParams } from "react-router-dom"

import { Button } from "@radix-ui/themes"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help.js"
import { CourseContext } from "./CourseProvider.js"


export const BookForm = () => {
    const { getCourses, getBook, editBook, activeCourse } = useContext(CourseContext)
    const initialBookState = {
        name: "",
        description: "",
        course: 0,
        index: 0
    }
    const [courses, setCourses] = useState([])
    const [mode, setMode] = useState("create")
    const [book, updateBook] = useState(initialBookState)

    const history = useHistory()
    const { bookId, courseId } = useParams()

    useEffect(() => {
        if (!(activeCourse && activeCourse.id === courseId)) {
            localStorage.setItem("activeCourse", courseId)
            getCourses().then(setCourses)
        }
    }, [])

    useEffect(() => {
        if (activeCourse) {
            updateBook({
                ...book,
                course: activeCourse.id,
                index: "id" in activeCourse && activeCourse.books.length
                    ? activeCourse.books[activeCourse.books.length - 1].index + 1
                    : 0
            })
        }
    }, [activeCourse])

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
            .then(() => history.push(`/courses/${book.course}`))
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
                {
                    courseId
                        ? <h2 className="projectForm__title">New Book for {activeCourse?.name} Course</h2>
                        : <h2 className="projectForm__title">Update Book</h2>
                }

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

                <Button style={{ marginTop: "2rem", marginLeft: "auto" }} color="blue"
                    onClick={evt => {
                        evt.preventDefault()

                        if (mode === "create") {
                            constructNewBook()
                        }
                        else {
                            editBook(book).then(() => history.push(`/courses/${book.course}`))
                        }
                    }}>Save</Button>

                <Button style={{ margin: "2rem 0 0 1rem" }} color="crimson"
                    onClick={evt => {
                        evt.preventDefault()
                        history.push(`/courses/${book.course}`)
                    }}>Cancel</Button>
            </form>
        </>
    )
}
