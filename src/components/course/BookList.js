import { useHistory } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { CourseContext } from "./CourseProvider"
import { DeleteIcon } from "../../svgs/DeleteIcon"
import { EditIcon } from "../../svgs/EditIcon"
import "./Books.css"

export const BookList = () => {
    const { getBooks, getCourses, deleteBook } = useContext(CourseContext)
    const [books, setBooks] = useState([])
    const [courses, setCourses] = useState([])
    const [selectedCourseId, setCourse] = useState(0)
    const [filteredBooks, setFilteredBooks] = useState([])
    const history = useHistory()

    const groupBooks = () => {
        /* eslint-disable no-undef */
        let copy = structuredClone(books)

        const groupedBooks = copy.reduce(
            (grouped, current) => {
                grouped.has(current.course.name)
                    ? grouped.set(current.course.name, [...grouped.get(current.course.name), current])
                    : grouped.set(current.course.name, [current])
                return grouped
            },
            new Map()
        )

        return groupedBooks
    }

    useEffect(() => {
        getBooks().then(setBooks)
        getCourses().then(setCourses)
    }, [])

    useEffect(() => {
        setFilteredBooks(Array.from(groupBooks().entries()))
    }, [books])

    useEffect(() => {
        if (selectedCourseId !== 0) {
            const courseArray = Array.from(groupBooks().entries())
            const copy = courseArray.filter(course => course[0] === courses.find(c => c.id === selectedCourseId).name)
                .sort((c, n) => c.index - n.index)
            setFilteredBooks(copy)
        }
        else {
            setFilteredBooks(Array.from(groupBooks().entries()))
        }
    }, [selectedCourseId])


    return <article className="container--bookList">
        <header className="book__header">
            <button className="button button--isi button--border-thick button--round-l button--size-s"
                onClick={() => history.push("/books/new")}>
                <i className="button__icon icon icon-book"></i>
                <span>Create Book</span>
            </button>

            <div className="book__filter">
                <select id="course" className="form-control"
                    value={selectedCourseId}
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
            <button className="fakeLink" onClick={() => setCourse(0)}>Clear</button>
        </header>

        {
            filteredBooks.map((course, idx) => {
                return <React.Fragment key={`course--${idx}`}>
                    <h2>{course[0]}</h2>
                    <div className="books">
                        {
                            course[1].map(book => {
                                return <section key={`book--${book.id}`} className="book">
                                    <h3 className="book__header">{book.name}</h3>

                                    <div className="book__info">
                                        <div className="book__description">{book.description}</div>
                                    </div>

                                    <footer className="book__footer">
                                        <EditIcon clickFunction={() => history.push(`/books/edit/${book.id}`)} />

                                        <DeleteIcon clickFunction={() => deleteBook(book.id)
                                            .then(getBooks)
                                            .then(setBooks)} />

                                        <div className="book__index">Index: {book.index}</div>
                                    </footer>
                                </section>

                            })
                        }
                    </div>
                </React.Fragment>

            })
        }
    </article>
}
