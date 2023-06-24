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
import { StudentCapstoneList } from "../cohorts/StudentCapstoneList.js"

export const StandupContext = createContext()

export const Dashboard = () => {
    const [searchTerms, setSearchTerms] = useState("")
    const [mvps, setMVPs] = useState(0)
    const [showAllProjects, toggleAllProjects] = useState(false)

    const [draggedStudent, dragStudent] = useState(null)

    const { activeCourse, capstoneSeason } = useContext(CourseContext)
    const { cohortStudents } = useContext(PeopleContext)

    const history = useHistory()

    useEffect(() => {
        if (cohortStudents.length > 0 && "id" in activeCourse) {
            const mvpReached = cohortStudents.reduce((count, student) => {
                return student.proposals.find(p => p?.current_status === "MVP" && p.course_name === activeCourse.name) ? ++count : count
            }, 0)

            setMVPs(mvpReached)
        }
    }, [cohortStudents, activeCourse])

    return <main className="dashboard">
        <section className="cohortActions">
            <CohortSearchField />
            <StudentSearch setSearchTerms={setSearchTerms} searchTerms={searchTerms} />
            <section className="capstonePercent">
                <div>{mvps} / {cohortStudents.length} @ MVP</div>
            </section>
        </section>

        <StandupContext.Provider value={{
            showAllProjects, toggleAllProjects, dragStudent,
            draggedStudent
        }}>
            {
                capstoneSeason
                    ? <StudentCapstoneList searchTerms={searchTerms} />
                    : <StudentCardList searchTerms={searchTerms} />
            }
        </StandupContext.Provider>

        <FeedbackDialog />
    </main>
}
