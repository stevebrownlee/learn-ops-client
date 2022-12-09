import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "./PeopleProvider"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import "./CoreSkills.css"
import { HumanDate } from "../utils/HumanDate"

export const CoreSkillSliders = ({ hideOverlay }) => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const [note, setNote] = useState("")
    const [skillRecords, setSkillRecords] = useState([])
    const [chosenCoreSkill, setChosenCoreSkill] = useState(0)
    let { toggleDialog: toggleSkillHistory } = useModal("#dialog--coreskillHistory")

    useEffect(() => {
        if (chosenCoreSkill !== 0) {
            const coreSkill = activeStudent.core_skill_records
                .find(record => record.id === chosenCoreSkill)

            setSkillRecords(coreSkill.notes.map(n => ({ ...n })).reverse())
        }

    }, [chosenCoreSkill])

    return <>
        <div className="sliders">
            {
                activeStudent?.core_skill_records?.length
                    ? activeStudent.core_skill_records.map(
                        record => <section className="slider" key={`coreskill--${record.id}`}>
                            <h4 className="slider__header">{record.skill.label} ({record.level})</h4>
                            <input type="range" min="1" max="10" defaultValue={record.level}
                                className="slider__range slider--coreSkill"
                                id={`record--${record.id}`}
                                onClick={e => e.stopPropagation()}
                                onMouseUp={(e) => {
                                    const updatedRecord = {
                                        student_id: activeStudent.id,
                                        skill_id: record.skill.id,
                                        level: parseInt(e.target.value)
                                    }
                                    fetchIt(`${Settings.apiHost}/coreskillrecords/${record.id}`, {
                                        method: "PUT",
                                        body: JSON.stringify(updatedRecord)
                                    })
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
        </div>
    </>
}
