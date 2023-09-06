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
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"
import "toaster-js/default.css"
import "./Dashboard.css"
import { Shortcuts } from "./Shortcuts.js"

export const StandupContext = createContext()

export const Dashboard = () => {

    let non_state_show_tags = true
    let non_state_show_avatars = true

    let settings = localStorage.getItem("lp_settings")
    if (settings) {
        settings = JSON.parse(settings)
        if ("tags" in settings) {
            non_state_show_tags = settings.tags
        }
        if ("avatars" in settings) {
            non_state_show_avatars = settings.avatars
        }
    }

    const [searchTerms, setSearchTerms] = useState("")
    const [mvps, setMVPs] = useState(0)
    const [showAllProjects, toggleAllProjects] = useState(false)
    const [showTags, toggleTags] = useState(non_state_show_tags)
    const [showAvatars, toggleAvatars] = useState(non_state_show_avatars)
    const [draggedStudent, dragStudent] = useState(null)

    const { activeCohort } = useContext(CohortContext)
    const { activeCourse, capstoneSeason } = useContext(CourseContext)
    const { cohortStudents } = useContext(PeopleContext)

    const history = useHistory()

    const persistSettings = (setting, value) => {
        let settings = localStorage.getItem("lp_settings")

        if (settings) {
            settings = JSON.parse(settings)
            settings[setting] = value
            localStorage.setItem("lp_settings", JSON.stringify(settings))
        }
        else {
            localStorage.setItem("lp_settings", JSON.stringify({[setting]:value}))
        }
    }

    const toggleTagsShortcut = useKeyboardShortcut('t', 'g', () => {
        non_state_show_tags = !non_state_show_tags
        toggleTags(non_state_show_tags)
        persistSettings('tags', non_state_show_tags)
    })

    const toggleAvatarsShortcut = useKeyboardShortcut('t', 'a', () => {
        non_state_show_avatars = !non_state_show_avatars
        toggleAvatars(non_state_show_avatars)
        persistSettings('avatars', non_state_show_avatars)
    })

    useEffect(() => {
        document.addEventListener("keyup", toggleTagsShortcut)
        document.addEventListener("keyup", toggleAvatarsShortcut)
        return () => {
            document.removeEventListener("keyup", toggleTagsShortcut)
            document.removeEventListener("keyup", toggleAvatarsShortcut)
        }
    }, [])


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
            draggedStudent, showTags, showAvatars
        }}>
            {
                capstoneSeason.active && capstoneSeason.id === activeCohort
                    ? <StudentCapstoneList searchTerms={searchTerms} />
                    : <><StudentCardList searchTerms={searchTerms} /><Shortcuts /></>
            }
        </StandupContext.Provider>


    </main>
}
