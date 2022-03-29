import React, { useContext } from "react"
import { PeopleContext } from "./PeopleProvider"
import { fetchIt } from "../utils/Fetch"
import Settings from "../Settings"
import { useHistory } from "react-router-dom"
import "./CoreSkills.css"

export const CoreSkillSliders = () => {
    const { activeStudent, getStudent } = useContext(PeopleContext)

    return <>
        {
            activeStudent.core_skill_records.length
                ? activeStudent.core_skill_records.map(
                    record => <section key={`coreskill--${record.id}`}>
                        <h4>{record.skill.label} ({record.level})</h4>
                        <div className="slidecontainer">
                            <input type="range" min="1" max="10" defaultValue={record.level}
                                className="slider slider--coreSkill"
                                id={`record--${record.id}`}
                                onMouseUp={(e) => {
                                    const updatedRecord = {
                                        student_id: activeStudent.id,
                                        skill_id: record.skill.id,
                                        level: parseInt(e.target.value)
                                    }
                                    fetchIt(`${Settings.apiHost}/coreskillrecords/${record.id}`, {
                                        method: "PUT",
                                        body: JSON.stringify(updatedRecord)
                                    }).then(getStudent)
                                }}
                            />
                        </div>
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
                                                    "student": activeStudent.id,
                                                    "skill": skill.id,
                                                    "note": "Initial record",
                                                    "level": 1
                                                })
                                            })
                                        )
                                    }
                                    Promise.all(newRecordRequests).then(getStudent)
                                })
                        }}>
                        <i className="button__icon icon icon-book"></i>
                        <span>Start Tracking Core Skills</span>
                    </button>
                </>
        }
    </>
}


/*
    {
        "student": 17,
        "skill": 4,
        "note": "First evaluation",
        "level": 7
    }
*/