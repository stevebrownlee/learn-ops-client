import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import "./Teams.css"

export const WeeklyTeams = () => {
    const [teamCount, changeCount] = useState(6)
    const { cohortStudents, getCohortStudents } = useContext(PeopleContext)

    useEffect(() => {
        if (localStorage.getItem("activeCohort")) {
            const id = parseInt(localStorage.getItem("activeCohort"))
            getCohortStudents(id)
        }
    }, [])


    const makeTeamBoxes = () => {
        let boxes = []

        for (let i = 1; i <= 6; i++) {
            boxes.push(
                <div id={`teambox--${i}`} key={`teambox--${i}`} className="team"
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                        e.preventDefault()
                        const data = e.dataTransfer.getData("text/plain")
                        e.target.appendChild(document.getElementById(data))

                    }}
                >Team {i}</div>
            )
        }

        return boxes
    }

    return (
        <>
            Weekly Teams

            <div>
                How many teams: <input type="number"
                    value={teamCount}
                    onChange={e => changeCount(parseInt(e.target.value))} />
            </div>
            <div>
                <button onClick={e => {
                    const sorted = cohortStudents.sort((current, next) => next.score - current.score)
                    const studentsPerTeam = Math.floor(cohortStudents.length / 6)

                    let boxNumber = 1
                    sorted.forEach((student, idx) => {
                        const studentBadge = document.getElementById(JSON.stringify(student))

                        try {
                            const box = document.getElementById(`teambox--${boxNumber}`)
                            box.appendChild(studentBadge)

                            const timeToSwitch = (idx + 1) % studentsPerTeam
                            if (idx > 0 && timeToSwitch === 0) {
                                boxNumber += 1
                            }
                        } catch (error) {
                            console.log(error)
                        }
                    });
                }}
                >Assign By Score</button>
            </div>
            <div>
                <button>Create Slack Channels</button>
            </div>

            <article className="teams">
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
        </>
    )
}
