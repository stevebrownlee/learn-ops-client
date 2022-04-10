import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "./PeopleProvider"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import "./CoreSkills.css"

export const CoreSkillSliders = () => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const [note, setNote] = useState("")
    const [changedRecord, updateChangedRecord] = useState(0)
    let { toggleDialog: toggleCoreSkillNote } = useModal("#dialog--coreskillNote")

    const reset = () => {
        setNote("")
        toggleCoreSkillNote()
    }

    useEffect(() => {
        if (changedRecord > 0) {
            toggleCoreSkillNote()
            document.getElementById("coreskillNoteText").focus()
        }
    }, [changedRecord])

    return <>
        <div className="sliders">
            {
                activeStudent.core_skill_records.length
                    ? activeStudent.core_skill_records.map(
                        record => <section className="slider" key={`coreskill--${record.id}`}>
                            <i className="icon icon-eye icon--more"></i> <h4 className="slider__header">{record.skill.label} ({record.level})</h4>
                            <input type="range" min="1" max="10" defaultValue={record.level}
                                className="slider__range slider--coreSkill"
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
                                    }).then(() => {
                                        updateChangedRecord(record.id)
                                        // getStudent()
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




        <dialog id="dialog--coreskillNote" className="dialog--coreskillNote">
            <div className="form-group">
                <label htmlFor="name">Why are you changing core skill?</label>
                <input type="text" id="coreskillNoteText"
                    className="form-control form-control--dialog"
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    onKeyDown={
                        e => {
                            if (e.key === "Enter") {
                                if (e.target.value !== "") {
                                    fetchIt(`${Settings.apiHost}/coreskillrecords/entries`, {
                                        method: "POST",
                                        body: JSON.stringify({ record: changedRecord, note })
                                    }).then(() => {
                                        getStudent()
                                        reset()
                                    })
                                }
                                else {
                                    reset()
                                }
                            }
                            else if (e.key === "Escape") {
                                reset()
                            }
                        }
                    } />
            </div>
        </dialog>
    </>
}
