import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const CourseContext = React.createContext()

export const CourseProvider = (props) => {
    const [courses, setCourses] = useState([])
    const [objectives, setObjectives] = useState([])
    const [course, setCourse] = useState({})
    const [activeCourse, setActiveCourse] = useState({})

    const getCourses = useCallback(
        () => fetchIt(`${Settings.apiHost}/courses`).then((data) => {
            setCourses(data)

            if (localStorage.getItem("activeCourse")) {
                const course = data.find(c => c.id === parseInt(localStorage.getItem("activeCourse")))
                setActiveCourse(course)
            }
        }),
        [setCourses, setActiveCourse]
    )

    const getCourse = useCallback(
        (id) => fetchIt(`${Settings.apiHost}/courses/${id}`).then(setCourse),
        [setCourses]
    )

    const getLearningObjectives = useCallback(
        (id) => fetchIt(`${Settings.apiHost}/weights?tiermin=1&tiermax=3`).then(setObjectives),
        [setCourses]
    )

    return (
        <CourseContext.Provider value={{
            getCourses, courses, activeCourse, setActiveCourse,
            getCourse, getLearningObjectives, objectives
        }} >
            {props.children}
        </CourseContext.Provider>
    )
}
