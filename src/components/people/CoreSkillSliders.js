import React, { useContext, useEffect } from "react"
import { PeopleContext } from "./PeopleProvider"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import { HelpIcon } from "../../svgs/Help"
import "./CoreSkills.css"

export const CoreSkillSliders = ({ hideOverlay }) => {
    const {
        activeStudent, activateStudent,
        getStudent, coreSkills, cohortStudents,
        getStudentCoreSkills
    } = useContext(PeopleContext)

    const coreSkillTips = [
        "Once a problem is understood, analyzed, and deconstructed into functional units, algorithmic thinking develops a logical, efficient series of steps required to solve each unit. Each functional unit is broken down into basic operations (BO) or elementary operations (EO).",
        "Use objective, logic-based approach to identify the functional units of a problem. Detect patterns, and using them to think creativity when presented with new challenges.",
        "Communicate effectively with both technical and non-technical language. Master complex communication during group-based work. Use correct vocabulary when describing technical concepts. Know how, and when to ask for help from a senior technical resource.",
        "Efficient learners take the time to use every resource available to learn a new skill, or implement a non-mastered skill in a new context. Debugger, dev tools, referencing previous solutions, searching the Web for resources and evaluating those search results."
    ]

    useEffect(() => {
        if (activeStudent && "id" in activeStudent) {
            const student = cohortStudents.find(student => student.id === activeStudent.id)
            activateStudent(student)
        }
    }, [cohortStudents])


    return <>
        <div className="sliders">
            {
                coreSkills.length
                    ? coreSkills.map(
                        (record, index) => <section className="slider" key={`coreskill--${record.id}`}>
                            <h4 className="slider__header">{record.skill.label} ({record.level})</h4>
                            <HelpIcon tip={coreSkillTips[index]} />
                            <input type="range" min="1" max="10" defaultValue={record.level}
                                className="slider__range"
                                id={`record--${record.id}`}
                                onClick={e => e.stopPropagation()}
                                onMouseUp={(e) => {
                                    const updatedRecord = {
                                        student_id: activeStudent?.id,
                                        skill_id: record.skill.id,
                                        level: parseInt(e.target.value)
                                    }
                                    fetchIt(`${Settings.apiHost}/coreskillrecords/${record.id}`, {
                                        method: "PUT",
                                        body: JSON.stringify(updatedRecord)
                                    })
                                        .then(() => getStudentCoreSkills(activeStudent?.id))
                                }}
                            />
                        </section>
                    )
                    : <>
                        <button className="button button--isi button--border-thick button--round-l button--size-s button--assessment"
                            onClick={() => {
                                fetchIt(`${Settings.apiHost}/coreskills`)
                                    .then(skills => {
                                        const newRecordRequests = []

                                        for (const skill of skills.results) {
                                            newRecordRequests.push(
                                                fetchIt(`${Settings.apiHost}/coreskillrecords`, {
                                                    method: "POST",
                                                    body: JSON.stringify({
                                                        "student": activeStudent?.id,
                                                        "skill": skill.id,
                                                        "note": "Initial record",
                                                        "level": 1
                                                    })
                                                })
                                            )
                                        }
                                        Promise.all(newRecordRequests).then(() => getStudentCoreSkills(activeStudent?.id))
                                    })
                            }}>
                            <i className="button__icon icon icon-book"></i>
                            <span>Start Tracking Core Skills</span>
                        </button>
                    </>
            }
        </div>
    </>
}
