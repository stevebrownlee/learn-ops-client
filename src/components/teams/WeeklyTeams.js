import React, { useContext, useEffect, useRef, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import "./Teams.css"
import slackLogo from "./images/slack.png"

export const WeeklyTeams = () => {
    const [teamCount, changeCount] = useState(6)
    const teamBoxes = useRef()
    const [weeklyPrefix, setWeeklyPrefix] = useState("C54")
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohortStudents(id)
        }
    }, [])

    const clearTeams = () => {
        teamBoxes.current.innerHTML = ""
    }


    const makeTeamBoxes = () => {
        let boxes = []

        for (let i = 1; i <= teamCount; i++) {
            boxes.push(
                <div id={`teambox--${i}`} key={`teambox--${i}`} className="team"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                        e.preventDefault()
                        const data = e.dataTransfer.getData("text/plain")
                        e.target.appendChild(document.getElementById(data))
                    }}
                >
                    Team {i}
                    <img className="icon--slack" src={slackLogo} alt="Create Slack team channel" />
                </div>
            )
        }

        return boxes
    }

    const autoAssignStudents = () => {
        cohortStudents.sort((current, next) => next.score - current.score)
        const studentsPerTeam = Math.floor(cohortStudents.length / teamCount)
        let remainingStudents = cohortStudents.length - (studentsPerTeam * teamCount)

        let boxNumber = 1
        let studentIndex = 0
        for (let i = 1; i <= teamCount; i++) {

            let studentsToAddToBox = studentsPerTeam
            if (boxNumber <= remainingStudents) {
                studentsToAddToBox = studentsPerTeam + 1
            }
            for (let j = 0; j < studentsToAddToBox; j++) {
                const student = cohortStudents[studentIndex]
                const studentBadge = document.getElementById(JSON.stringify(student))
                const box = document.getElementById(`teambox--${boxNumber}`)
                box.appendChild(studentBadge)
                studentIndex++
            }

            boxNumber += 1
        }
    }

    return (
        <article className="teamView">
            <h1>Weekly Teams</h1>

            <section className="teamsconfig">
                <div>
                    How many teams: <input type="number"
                        className="teamsconfig__count"
                        value={teamCount}
                        onChange={e => changeCount(parseInt(e.target.value))} />
                </div>
                <div>
                    Slack channel prefix: <input type="text"
                        className="teamsconfig__prefix"
                        value={weeklyPrefix}
                        onChange={e => changeCount(parseInt(e.target.value))} />
                </div>
                <div className="teamsconfig__auto">
                    <button onClick={autoAssignStudents}>
                        Assign By Score
                    </button>
                </div>
                <div className="teamsconfig__reset">
                    <button onClick={() => {
                       clearTeams()
                       changeCount(5)
                    }}>
                        Reload
                    </button>
                </div>
            </section>

            <hr />

            <article className="teams" ref={teamBoxes}>
                {makeTeamBoxes()}
            </article>
            <article className="students--teambuilder">
                {
                    cohortStudents
                        .sort((current, next) => next.score - current.score)
                        .map(s => (
                            <div key={`studentbadge--${s.id}`}
                                id={JSON.stringify(s)}
                                onDragStart={e => {
                                    e.dataTransfer.setData("text/plain", e.target.id)
                                }}
                                draggable={true} className="student--badge">
                                {s.name}
                            </div>
                        ))
                }
            </article>
        </article>
    )
}
