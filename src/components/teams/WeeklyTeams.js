import React, { useContext, useEffect, useState } from "react"
import { Select, Button } from '@radix-ui/themes'
import { Toast } from "toaster-js"

import { fetchIt } from "../utils/Fetch.js"
import { HelpIcon } from "../../svgs/Help"

import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import { CourseContext } from "../course/CourseProvider.js"
import "./Teams.css"
import Settings from "../Settings.js"

export const WeeklyTeams = () => {
    const {
        cohortStudents, getCohortStudents, tagStudentTeams,
        untagStudent
    } = useContext(PeopleContext)
    const {
        activeCohort, activateCohort, getCohort,
        activeCohortDetails
    } = useContext(CohortContext)
    const {
        getProjects
    } = useContext(CourseContext)

    const [teamCount, changeCount] = useState(3)
    const [feedback, setFeedback] = useState("")
    const [weeklyPrefix, setWeeklyPrefix] = useState("")
    const [unassignedStudents, setUnassigned] = useState([])
    const [originalTeam, trackOriginalTeam] = useState(0)
    const [teams, updateTeams] = useState(new Map())
    const [groupProjects, setGroupProjects] = useState([])
    const [chosenProject, setChosenProject] = useState("none")
    const [activeTeams, setActiveTeams] = useState(false)

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            activateCohort(id)
            if (cohortStudents.length === 0) getCohortStudents(id)
            getCohort(id)
            fetchIt(`${Settings.apiHost}/teams?cohort=${id}`)
            getProjects().then(
                (projects) => setGroupProjects(projects.filter(p => p.is_group_project && p.active))
            )
        }
    }, [])

    useEffect(() => {
        if (feedback !== "") {
            setTimeout(() => {
                setFeedback("")
            }, 3000);
        }
    }, [feedback])

    const buildNewTeams = () => {
        const newTeams = new Map()

        for (let i = 1; i <= teamCount; i++) {
            newTeams.set(i, new Set())
        }

        setUnassigned(cohortStudents)
        updateTeams(newTeams)
    }

    useEffect(() => {
        buildNewTeams()
    }, [teamCount])

    useEffect(() => {
        if (activeCohort) {
            fetchIt(`${Settings.apiHost}/teams?cohort=${activeCohort}`)
                .then((teams) => {
                    if (teams.length) {
                        const teamMap = new Map()

                        teams.forEach((team, index) => {
                            teamMap.set(index + 1, new Set(team.students.map(s => JSON.stringify(s))))
                        })

                        changeCount(teamMap.size)
                        updateTeams(teamMap)
                        setActiveTeams(true)
                    }
                    else {
                        changeCount(Math.ceil(cohortStudents.length / 4))
                        setActiveTeams(false)
                    }
                })
        }
    }, [cohortStudents])

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

                                updateTeams(copy)
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
        updateTeams(teamsCopy)
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

    const saveTeams = () => {
        // Check if any of the team Map values are empty
        for (const [key, value] of teams) {
            if (value.size === 0) {
                setFeedback("Error: One or more teams are empty")
                return
            }
        }

        // Number of teams cannot be 0
        if (teamCount === 0) {
            setFeedback("Error: Number of teams cannot be 0")
            return
        }

        if (weeklyPrefix !== "") {
            for (const [key, studentSet] of teams) {
                let studentArray = Array.from(studentSet).map(s => JSON.parse(s).id)
                const coaches = activeCohortDetails.coaches.map(c => c.id)
                studentArray = coaches  // Use this to add coaches to the team only for testing
                // studentArray = [...studentArray, ...coaches]

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
            }
        }
        else {
            setFeedback("Error: Please provide a Slack channel prefix")
        }
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
                <div className="teamsconfig__auto"> </div>

                {
                    activeTeams
                        ? <div className="teamsconfig__clear">
                            <Button color="red" onClick={() => {
                                fetchIt(`${Settings.apiHost}/teams/1?cohort=${activeCohort}`, {
                                    method: "DELETE"
                                })
                                    .then(() => {
                                        changeCount(Math.ceil(cohortStudents.length / 4))
                                        buildNewTeams()
                                        setUnassigned(cohortStudents)
                                        setActiveTeams(false)
                                        setFeedback("Teams deleted")
                                    })
                            }}>
                                Delete Current Teams
                            </Button>
                        </div>
                        : <>
                            <div className="teamsconfig__auto teamsconfig__random">
                                <Button color="amber" onClick={() => autoAssignStudents(true)}>
                                    Random
                                </Button>
                            </div>
                            <div className="teamsconfig__save">
                                <Button color="blue" onClick={saveTeams}> Save </Button>
                            </div>
                            <div className="teamsconfig__clear">
                                <Button color="ruby" onClick={() => {
                                    changeCount(Math.ceil(cohortStudents.length / 4))
                                    buildNewTeams()
                                    setUnassigned(cohortStudents)
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
