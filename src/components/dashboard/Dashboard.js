import React, { createContext, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { StudentCardList } from "../cohorts/StudentCardList"
import { CohortSearchField } from "../cohorts/CohortSearchField"
import { StudentSearch } from "../people/StudentSearch"
import { EyeIcon } from "../../svgs/EyeIcon"
import { StudentCapstoneList } from "../cohorts/StudentCapstoneList.js"
import { PeopleIcon } from "../../svgs/PeopleIcon.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import "toaster-js/default.css"
import "./Dashboard.css"

export const StandupContext = createContext()

export const Dashboard = () => {
    const [searchTerms, setSearchTerms] = useState("")
    const [mvps, setMVPs] = useState(0)
    const [showAllProjects, toggleAllProjects] = useState(false)

    const [draggedStudent, dragStudent] = useState(null)

    const { activeCohort } = useContext(CohortContext)
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
                capstoneSeason.active && capstoneSeason.id === activeCohort
                    ? <StudentCapstoneList searchTerms={searchTerms} />
                    : <StudentCardList searchTerms={searchTerms} />
            }
        </StandupContext.Provider>
    </main>
}
