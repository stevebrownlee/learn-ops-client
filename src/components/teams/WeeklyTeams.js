import React, { useContext, useEffect, useState } from "react"
import { Select, Button } from '@radix-ui/themes'
import { Toast } from "toaster-js"

import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help"
import { Loading } from "../Loading.js"

import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import { CourseContext } from "../course/CourseProvider.js"

import "./Teams.css"

export const WeeklyTeams = () => {
    const {
        cohortStudents, getCohortStudents, tagStudentTeams,
        untagStudent
    } = useContext(PeopleContext)
    const {
        activeCohort, activateCohort, getCohort,
        activeCohortDetails
    } = useContext(CohortContext)
    const { getGroupProjects } = useContext(CourseContext)

    const [activeTeams, setActiveTeams] = useState(false)
    const [teamCount, changeCount] = useState(0)
    const [teams, setTeams] = useState(new Map())
    const [unassignedStudents, setUnassigned] = useState([])

    const [feedback, setFeedback] = useState("")
    const [weeklyPrefix, setWeeklyPrefix] = useState("")
    const [originalTeam, trackOriginalTeam] = useState(0)
    const [groupProjects, setGroupProjects] = useState([])
    const [chosenProject, setChosenProject] = useState("none")
    const [loading, setLoading] = useState(true)


    useEffect(() => {
        if (!activeCohort) {
            console.log("No active cohort")
            if (localStorage.getItem("activeCohort")) {
                const id = parseInt(localStorage.getItem("activeCohort"))
                activateCohort(id)
            }
        }

        /*
            TODO: Update the API to return only active group projects by supporting query params
        */
        getGroupProjects().then(
            (projects) => setGroupProjects(projects.filter(p => p.is_group_project && p.active))
        )
    }, [])


    useEffect(() => {
        if (feedback !== "") {
            setTimeout(() => setFeedback(""), 3000);
        }
    }, [feedback])

    useEffect(() => { activeCohort && retrieveTeams() }, [activeCohort])
    useEffect(() => { teamCount > 0 && !activeTeams && buildEmptyTeams(teamCount) }, [teamCount])
    useEffect(() => { console.log(teamCount) }, [teamCount])
    useEffect(() => { console.log(teams) }, [teams])

    const buildEmptyTeams = () => {
        const newTeams = new Map()
        for (let i = 1; i <= teamCount; i++) {
            newTeams.set(i, new Set())
        }
        setTeams(newTeams)
    }

    const resetToEmptyTeams = () => {

        const renderConstructionUI = (cohortStudents) => {
            const numberOfTeams = Math.ceil(cohortStudents.length / 4)
            buildEmptyTeams()

            setActiveTeams(false)
            setUnassigned(cohortStudents)
            setLoading(false)
            changeCount(numberOfTeams)
        }

        if (cohortStudents.length === 0) {
            getCohortStudents(activeCohort).then((students) => {
                renderConstructionUI(students)
            })
        }
        else {
            renderConstructionUI(cohortStudents)
        }

    }

    const retrieveTeams = async () => {
        const teams = await fetchIt(`${Settings.apiHost}/teams?cohort=${activeCohort}`)

        if (teams.length) {
            const teamMap = new Map()

            teams.forEach((team, index) => {
                teamMap.set(index + 1, new Set(team.students.map(s => JSON.stringify(s))))
            })

            setTeams(teamMap)
            setLoading(false)
            setActiveTeams(true)
            changeCount(teams.length)
        }
        else {
            resetToEmptyTeams()
        }
    }

    const createStudentBadge = (student) => {
        return <div key={`studentbadge--${student.id}`}
            id={JSON.stringify(student)}
            onDragStart={e => {
                if ("id" in e.nativeEvent.target.parentElement && e.nativeEvent.target.parentElement.id !== "") {
                    trackOriginalTeam(parseInt(e.nativeEvent.target.parentElement.id.split("--")[1]))
                }
                else {
                    trackOriginalTeam(0)
                }
                e.dataTransfer.setData("text/plain", e.target.id)
            }}
            draggable={true} className="student--badge">
            {student.name}
        </div>
    }

    const makeTeamBoxes = () => {
        let boxes = []

        try {
            for (let teamNumber = 1; teamNumber <= teamCount; teamNumber++) {
                boxes.push(
                    <div id={`teambox--${teamNumber}`} key={`teambox--${teamNumber}`} className="team"
                        onDragOver={e => e.preventDefault()}
                        onDrop={e => {
                            e.preventDefault()
                            const data = e.dataTransfer.getData("text/plain")
                            const rawStudent = JSON.parse(data)

                            if (teamNumber !== originalTeam) {
                                // Add div to new team Set
                                const copy = new Map(teams)
                                copy.get(teamNumber).add(data)

                                const idx = unassignedStudents.findIndex(s => s.id === rawStudent.id)
                                const unassignedCopy = unassignedStudents.map(s => ({ ...s }))
                                unassignedCopy.splice(idx, 1)
                                setUnassigned(unassignedCopy)

                                // If dragged from another team, remove from original
                                if (originalTeam !== 0) {
                                    copy.get(originalTeam).delete(data)
                                }

                                setTeams(copy)
                            }
                        }}
                    >
                        Team {teamNumber}
                        {
                            Array.from(teams.get(teamNumber)).map(
                                (studentJSON) => {
                                    const student = JSON.parse(studentJSON)
                                    return createStudentBadge(student)
                                }
                            )
                        }
                    </div>
                )
            }

        } catch (error) {
            console.log("State out of sync. Waiting....")
        }

        return boxes
    }

    const autoAssignStudents = (random = false) => {
        const students = cohortStudents.map(s => ({ ...s }))

        if (random) {
            for (let i = students.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [students[i], students[j]] = [students[j], students[i]];
            }
        }
        else {
            students.sort((current, next) => next.score - current.score)
        }

        const teamsCopy = new Map(teams)
        const studentsPerTeam = Math.floor(students.length / teamCount)
        let remainingStudents = students.length - (studentsPerTeam * teamCount)

        let boxNumber = 1
        let studentIndex = 0
        for (let i = 1; i <= teamCount; i++) {
            teamsCopy.get(boxNumber).clear()

            let studentsToAddToBox = studentsPerTeam
            if (boxNumber <= remainingStudents) {
                studentsToAddToBox = studentsPerTeam + 1
            }
            for (let j = 0; j < studentsToAddToBox; j++) {
                const student = students[studentIndex]
                teamsCopy.get(boxNumber).add(JSON.stringify(student))
                studentIndex++
            }

            boxNumber += 1
        }

        setUnassigned([])
        setTeams(teamsCopy)
    }

    const clearTeams = () => {
        const tagsToDelete = []

        for (const student of cohortStudents) {
            if (student.tags.length) {
                for (const tag of student.tags) {
                    if (tag.tag.toLowerCase().startsWith("team ")) {
                        tagsToDelete.push(untagStudent(tag.id))
                    }
                }
            }
        }

        return Promise.allSettled(tagsToDelete)
    }

    const saveTeams = async () => {
        // Check if any of the team Map values are empty
        for (const [key, value] of teams) {
            if (value.size === 0) {
                setFeedback("Error: One or more teams are empty")
                console.log(teams)
                return
            }
        }

        // Number of teams cannot be 0
        if (teamCount === 0) {
            setFeedback("Error: Number of teams cannot be 0")
            return
        }

        if (weeklyPrefix !== "") {
            // Create an array to hold each of the fetch promises defined below
            const fetchPromises = []

            for (const [key, studentSet] of teams) {
                let studentArray = Array.from(studentSet).map(s => JSON.parse(s).id)
                const coaches = activeCohortDetails.coaches.map(c => c.id)
                // studentArray = coaches  // Use this to add coaches to the team only for testing
                studentArray = [...studentArray, ...coaches]

                fetchPromises.push(
                    fetchIt(`http://localhost:8000/teams`, {
                        method: "POST",
                        body: JSON.stringify({
                            cohort: activeCohort,
                            students: studentArray,
                            weeklyPrefix,
                            teamIndex: key,
                            groupProject: chosenProject !== "none" ? chosenProject : null,
                        })
                    })
                )
            }

            // Wait for all fetch promises to resolve. If a 201 is not returned from any of the fetches, set feedback to error
            fetchPromises.length > 0 && Promise.allSettled(fetchPromises)
                .then((results) => {
                    const failed = results.filter(r => r.status === "rejected")
                    if (failed.length) {
                        return setFeedback("Error: Unable to save teams")
                    }
                    setFeedback("Teams saved")
                    retrieveTeams()
                })

        }
        else {
            setFeedback("Error: Please provide a Slack channel prefix")
        }
    }

    if (loading) {
        return <Loading />
    }

    return (
        <article className="view">
            <div style={{
                border: "1px solid #ddd",
                padding: "1rem",
                margin: "1rem 0",
                backgroundColor: "#f4f4f4",
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
                color: "#555"
            }}>📝 Use this tool to design weekly student teams for the client-side course,
                or for constructing teams for a specific group project. If building weekly
                teams, leave N/A chosen in the group project select.</div>

            <section className="teamsconfig">
                {
                    activeTeams
                        ? <div className="teamsconfig__clear">
                            <Button color="red" onClick={() => {
                                fetchIt(`${Settings.apiHost}/teams/reset?cohort=${activeCohort}`, {
                                    method: "DELETE"
                                })
                                    .then(() => {
                                        resetToEmptyTeams()
                                        setFeedback("Teams deleted")
                                    })
                            }}>
                                Delete Current Teams
                            </Button>
                        </div>
                        : <>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "0 2rem 0 0"
                            }}>
                                <div>How many teams:</div>
                                <div><input type="number"
                                    className="teamsconfig__count"
                                    value={teamCount}
                                    onChange={e => changeCount(parseInt(e.target.value))} /></div>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "column",
                                margin: "0 2rem 0 0"
                            }}>
                                <div>Slack channel prefix:</div>
                                <div>
                                    <input type="text"
                                        className="teamsconfig__prefix"
                                        value={weeklyPrefix}
                                        placeholder=""
                                        onChange={e => setWeeklyPrefix(e.target.value)} />
                                </div>
                            </div>
                            <div style={{
                                display: "flex",
                                flexDirection: "column"
                            }}>
                                <div>Choose Group Project</div>
                                <Select.Root onValueChange={setChosenProject} value={chosenProject}>
                                    <Select.Trigger />
                                    <Select.Content>
                                        <Select.Item value="none">N/A</Select.Item>
                                        {
                                            groupProjects.map(project => <Select.Item
                                                key={`project--${project.id}`}
                                                value={project.id}>{project.name}</Select.Item>)
                                        }
                                    </Select.Content>
                                </Select.Root>
                            </div>
                            <div className="teamsconfig__auto teamsconfig__random">
                                <Button color="amber" onClick={() => autoAssignStudents(true)}>
                                    Random
                                </Button>
                            </div>
                            <div className="teamsconfig__save">
                                <Button color="blue" onClick={async () => await saveTeams()}> Save </Button>
                            </div>
                            <div className="teamsconfig__clear">
                                <Button color="ruby" onClick={() => {
                                    resetToEmptyTeams()
                                }}>
                                    Reset
                                </Button>
                            </div>
                        </>
                }
            </section>

            <hr />

            <div className={`${feedback === "" ? "invisible" : "visible"} ${feedback === "" ? "" : feedback.includes("Error") ? "error" : "feedback"} `}>
                {feedback}
            </div>

            <article className="teams">
                {makeTeamBoxes()}
            </article>
            <article className="students--teambuilder">
                {
                    unassignedStudents
                        .sort((current, next) => next.score - current.score)
                        .map(createStudentBadge)
                }
            </article>
        </article>
    )
}
