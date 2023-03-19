import React, { createContext, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { FeedbackDialog } from "./FeedbackDialog"
import { StudentCardList } from "../cohorts/StudentCardList"
import { CohortSearchField } from "../cohorts/CohortSearchField"
import { StudentSearch } from "../people/StudentSearch"
import { EyeIcon } from "../../svgs/EyeIcon"
import "toaster-js/default.css"
import "./Dashboard.css"

export const StandupContext = createContext()

export const Dashboard = () => {
    const [searchTerms, setSearchTerms] = useState([])
    const [mvps, setMVPs] = useState(0)
    const [showAllProjects, toggleAllProjects] = useState(false)

    const { getLearningObjectives, activeCourse } = useContext(CourseContext)
    const { cohortStudents } = useContext(PeopleContext)

    const history = useHistory()

    useEffect(() => {
        getLearningObjectives()
    }, [])

    useEffect(() => {
        if (cohortStudents.length > 0 && "id" in activeCourse) {
            const mvpReached = cohortStudents.reduce((count, student) => {
                return student.proposals.find(p => p.status === "mvp" && p.course === activeCourse.id) ? ++count : count
            }, 0)

            setMVPs(mvpReached)
        }
    }, [cohortStudents, activeCourse])

    return <main className="dashboard">
        <section className="cohortActions">
            <CohortSearchField />
            <StudentSearch setSearchTerms={setSearchTerms} searchTerms={searchTerms} />
            <button className={`fakeLink toggle--projects ${showAllProjects ? "on" : "off"}`}
                onClick={() => toggleAllProjects(!showAllProjects)}>StandUp Mode</button>
            <section className="capstonePercent">
                <div>{mvps} / {cohortStudents.length}</div>
            </section>
        </section>

        <StandupContext.Provider value={ showAllProjects }>
            <StudentCardList searchTerms={searchTerms} />
        </StandupContext.Provider>

        <FeedbackDialog />


    </main>
}
