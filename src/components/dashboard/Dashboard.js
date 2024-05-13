import React, { createContext, useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CourseContext } from "../course/CourseProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { StudentCardList } from "../cohorts/StudentCardList"
import { CohortSearchField } from "../cohorts/CohortSearchField"
import { StudentSearch } from "../people/StudentSearch"
import { StudentCapstoneList } from "../cohorts/StudentCapstoneList.js"
import { PeopleIcon } from "../../svgs/PeopleIcon.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { Shortcuts } from "./Shortcuts.js"
import "toaster-js/default.css"
import "./Dashboard.css"
import { ActiveCohortStrip } from "./CohortStrip.js"

export const StandupContext = createContext()

export const Dashboard = () => {
    const [mvps, setMVPs] = useState(0)
    const [searchTerms, setSearchTerms] = useState("")
    const [draggedStudent, dragStudent] = useState(null)
    const [showAllProjects, toggleAllProjects] = useState(false)
    const [enteringNote, setEnteringNote] = useState(false)

    const { activeCohort } = useContext(CohortContext)
    const { activeCourse, capstoneSeason } = useContext(CourseContext)
    const { cohortStudents } = useContext(PeopleContext)
    const { getStatuses, statuses } = useContext(AssessmentContext)

    const history = useHistory()

    useEffect(() => {
        if (statuses.length === 0) {
            getStatuses()
        }
    }, [])


    useEffect(() => {
        if (capstoneSeason.includes(activeCohort)) {
            if (cohortStudents.length > 0) {
                const mvpReached = cohortStudents.reduce((count, student) => {
                    return student.proposals.find(p => p?.status === "MVP" && p.course_name === activeCourse.name) ? ++count : count
                }, 0)

                setMVPs(mvpReached)
            }
        }
    }, [cohortStudents, activeCourse])

    const mvpCountBadge = () => {
        if (capstoneSeason.includes(activeCohort)) {
            return <section className="capstonePercent">
                <div>{mvps} / {cohortStudents.length} @ MVP</div>
            </section>
        }
    }

    return <main className="dashboard">

        <StandupContext.Provider value={{
            showAllProjects, toggleAllProjects, dragStudent, draggedStudent,
            enteringNote, setEnteringNote
        }}>
            <section className="cohortActions">
                <ActiveCohortStrip />
                <StudentSearch setSearchTerms={setSearchTerms} searchTerms={searchTerms} />
                { mvpCountBadge() }

            </section>
            {
                capstoneSeason.includes(activeCohort)
                    ? <StudentCapstoneList searchTerms={searchTerms} />
                    : <><StudentCardList searchTerms={searchTerms} /><Shortcuts /></>
            }
        </StandupContext.Provider>
    </main>
}
