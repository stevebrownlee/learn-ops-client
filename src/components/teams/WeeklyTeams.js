import React, { useContext, useEffect, useState } from "react"
import { Select, Button } from '@radix-ui/themes'

import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import { CourseContext } from "../course/CourseProvider.js"
import TeamsRepository from "./TeamsRepository"
import { HelpIcon } from "../../svgs/Help"
import slackLogo from "./images/slack.png"
import "./Teams.css"
import { fetchIt } from "../utils/Fetch.js"

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

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            activateCohort(id)
            getCohortStudents(id)
            getCohort(id)
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
        if (localStorage.getItem("currentCohortTeams")) {
            const storage = JSON.parse(localStorage.getItem("currentCohortTeams"))
            const teamMap = new Map()

            storage.forEach(team => {
                teamMap.set(team.id, new Set(team.students))
            })

            changeCount(Array.from(teamMap.entries()).length)
            updateTeams(teamMap)
            setUnassigned([])
        }
        else {
            changeCount(Math.floor(cohortStudents.length / 4))
            setUnassigned(cohortStudents)
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
        if (weeklyPrefix !== "") {
            for (const [key, studentSet] of teams) {
                let studentArray = Array.from(studentSet).map(s => JSON.parse(s).id)
                // studentArray = activeCohortDetails.coaches.map(c => c.id)
                studentArray = [...studentArray, ...activeCohortDetails.coaches.map(c => c.id)]

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
            window.alert("Please provide a weekly team prefix")
        }
    }

    return (
        <article className="view">
            <h1>Weekly Teams</h1>

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
                            placeholder="e.g. c56"
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
                <div className="teamsconfig__auto">
                    <Button color="amber" onClick={() => autoAssignStudents()}>
                        Assign By Score
                    </Button>
                </div>
                <div className="teamsconfig__random">
                    <Button color="amber" onClick={() => autoAssignStudents(true)}>
                        Random
                    </Button>
                </div>
                <div className="teamsconfig__save">
                    <Button className="isometric-Button blue" onClick={saveTeams}> Save </Button>
                </div>
                <div className="teamsconfig__clear">
                    <Button color="red" onClick={() => {
                        localStorage.removeItem("currentCohortTeams")
                        changeCount(Math.floor(cohortStudents.length / 4))
                        buildNewTeams()
                        setUnassigned(cohortStudents)
                        clearTeams().then(() => getCohortStudents(activeCohort))
                    }}>
                        Clear
                    </Button>
                </div>
            </section>

            <hr />

            <div className={`${feedback.includes("Error") ? "error" : "feedback"} ${feedback === "" ? "invisible" : "visible"}`}>
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
