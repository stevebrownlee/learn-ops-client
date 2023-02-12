import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import TeamsRepository from "./TeamsRepository"
import { HelpIcon } from "../../svgs/Help"
import slackLogo from "./images/slack.png"
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

    const initialTeamState = new Map([
        [1, new Set()],
        [2, new Set()],
        [3, new Set()],
        [4, new Set()],
        [5, new Set()],
        [6, new Set()]
    ])

    const [teamCount, changeCount] = useState(6)
    const [feedback, setFeedback] = useState("")
    const [weeklyPrefix, setWeeklyPrefix] = useState("")
    const [unassignedStudents, setUnassigned] = useState([])
    const [originalTeam, trackOriginalTeam] = useState(0)
    const [teams, updateTeams] = useState(initialTeamState)

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            activateCohort(id)
            getCohortStudents(id)
            getCohort(id)
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
        if (teamCount > teams.size) {
            const newTeams = new Map(teams)
            newTeams.set(teamCount, new Set())
            updateTeams(newTeams)
        }
        else {
            buildNewTeams()
        }
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
            setUnassigned(cohortStudents)
        }

    }, [cohortStudents])

    const makeSlackChannel = (teamNumber) => {
        // Get students
        let studentIds = Array.from(teams.get(teamNumber))
            .map(JSON.parse)
            .map(student => student.id)

        // Add instructors
        studentIds = [...studentIds, ...activeCohortDetails.coaches.map(c => c.id)]

        // Create channel
        TeamsRepository.createSlackChannel(
            `${weeklyPrefix}-team-${teamNumber}`,
            studentIds
        )
            .then(res => {
                if (res.channel.ok) {
                    setFeedback(`Slack channel ${res.channel.channel.name} successfully created...`)
                }
                else {
                    setFeedback(`Error creating Slack channel: ${res.channel.error}`)
                }
            })
    }

    const createStudentBadge = (student) => {
        return <div key={`studentbadge--${student.id}`}
            id={JSON.stringify(student)}
            onDragStart={e => {
                if ("id" in e.nativeEvent.target.parentElement) {
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
                        }}
                    >
                        Team {teamNumber}
                        <img onClick={() => makeSlackChannel(teamNumber)}
                            className="icon--slack" src={slackLogo} alt="Create Slack team channel" />
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
                    if (tag.tag.name.toLowerCase().includes("team ")) {
                        tagsToDelete.push(untagStudent(tag.id))
                    }
                }
            }
        }

        return Promise.allSettled(tagsToDelete)
    }

    const saveTeams = () => {
        const tagsToAdd = []

        const serializableMap = Array.from(teams)
        const convertible = serializableMap.map(
            ([id, studentSet]) => {
                for (const student of studentSet) {
                    const studentObject = JSON.parse(student)
                    tagsToAdd.push({
                        "student": studentObject.id,
                        "team": `Team ${id}`
                    })
                }

                return {
                    id,
                    students: Array.from(studentSet)
                }
            }
        )

        localStorage.setItem("currentCohortTeams", JSON.stringify(convertible))
        tagStudentTeams(tagsToAdd).then(() => getCohortStudents(activeCohort))
    }

    return (
        <article className="view">
            <h1>Weekly Teams</h1>

            <section className="teamsconfig">
                <div>
                    How many teams: <input type="number"
                        className="teamsconfig__count"
                        value={teamCount}
                        onChange={e => changeCount(parseInt(e.target.value))} />
                </div>
                <div>
                    Slack channel prefix:
                    <HelpIcon tip="The string of '-team-n' will be added after what you specify at the prefix. For example, if your prefix is 'c58-week2' a Slack channel of 'c58-week2-team-1' will be created." />
                    <input type="text"
                        className="teamsconfig__prefix"
                        value={weeklyPrefix}
                        placeholder="e.g. c56"
                        onChange={e => setWeeklyPrefix(e.target.value)} />
                </div>
                <div className="teamsconfig__auto">
                    <button onClick={() => autoAssignStudents()}>
                        Assign By Score
                    </button>
                </div>
                <div className="teamsconfig__auto">
                    <button onClick={() => autoAssignStudents(true)}>
                        Random
                    </button>
                </div>
                <div className="teamsconfig__save">
                    <button onClick={saveTeams}> Save </button>
                </div>
                <div className="teamsconfig__clear">
                    <button onClick={() => {
                        localStorage.removeItem("currentCohortTeams")
                        changeCount(6)
                        buildNewTeams()
                        setUnassigned(cohortStudents)
                        clearTeams().then(() => getCohortStudents(activeCohort))
                    }}>
                        Clear
                    </button>
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
