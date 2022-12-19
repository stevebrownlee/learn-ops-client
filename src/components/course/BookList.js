import { useHistory } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { CourseContext } from "./CourseProvider"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./Books.css"

export const BookList = () => {
    const { getBooks, getCourses } = useContext(CourseContext)
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const [course, setCourse] = useState(0)
    const [filteredBooks, setFilteredBooks] = useState([])
    const history = useHistory()

    useEffect(() => {
        getBooks().then(setBooks)
        getCourses().then(setCourses)
    }, [])

    useEffect(() => {
        /* eslint-disable no-undef */
        let copy = structuredClone(books)
        copy = copy.sort((c,n) => c.index - n.index)
        setFilteredBooks(copy)
    }, [books])

    useEffect(() => {
        if (course !== 0) {
            /* eslint-disable no-undef */
            let copy = structuredClone(books)
            copy = copy.filter(book => book.course.id === course).sort((c,n) => c.index - n.index)
            setFilteredBooks(copy)
        }
        else {
            setFilteredBooks(books)
        }
    }, [course])


    return <article className="container--bookList">
        <header className="book__header">
            <button className="button button--isi button--border-thick button--round-l button--size-s"
                onClick={() => history.push("/books/new")}>
                <i className="button__icon icon icon-book"></i>
                <span>Create Book</span>
            </button>

            <div className="book__filter">
                <select id="course" className="form-control"
                    value={course}
                    controltype="number"
                    onChange={(e) => setCourse(parseInt(e.target.value))}>
                    <option value="0">Filter by course...</option>
                    {
                        courses.map(course => {
                            return <option key={`course--${course.id}`} value={course.id}>
                                {course.name}
                            </option>
                        })
                    }
                </select>
            </div>
        </header>
        <div className="books">

            {
                filteredBooks.map(book => {
                    return <section key={`book--${book.id}`} className="book">
                        <h3 className="book__header">{book.name}</h3>

                        <div className="book__info">
                            <div>Course: {book.course.name}</div>
                            <div className="book__description">{book.description}</div>
                        </div>

                        <footer className="book__footer">
                            <EditIcon clickFunction={() => history.push(`/books/edit/${book.id}`)} />

                            <DeleteIcon clickFunction={() => deleteBook(book.id)
                                .then(getBooks)
                                .then(setBooks)} />
                        </footer>
                    </section>
                })
            }
        </div>
    </article>
}
