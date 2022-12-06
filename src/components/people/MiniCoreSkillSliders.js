import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "./PeopleProvider"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import "./CoreSkills.css"
import { HumanDate } from "../utils/HumanDate"

export const MiniCoreSkillSliders = () => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const [changedRecord, updateChangedRecord] = useState(0)
    const [skillRecords, setSkillRecords] = useState([])

    return <>
        <div className="sliders">
            {
                activeStudent.core_skill_records.length
                    ? activeStudent.core_skill_records.map(
                        record => <section className="slider" key={`coreskill--${record.id}`}>

                            <h4 className="slider__header">{record.skill.label} ({record.level})</h4>
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
                                    })
                                }
                            }
                        }
                    } />
            </div>
        </dialog>

        <dialog style={{ paddingTop: "1rem"}} id="dialog--coreskillHistory" className="dialog--coreskillHistory">
            {
                skillRecords.reverse().map(
                    note => {
                        return <React.Fragment key={`skillNote--${note.id}`}>
                            <div className="status">
                                <div className="status__note"> {note.note} </div>
                                <div className="status__date">
                                    Recorded on <HumanDate date={note.recorded_on.split("T")[0]} /> by {note.instructor}
                                </div>
                            </div>
                            <div className="status__separator"></div>
                        </React.Fragment>
                    }
                )
            }
            <button className="fakeLink" style={{
                position: "absolute",
                top: "0.33em",
                right: "0.5em",
                fontSize: "0.75rem"
            }}
                id="closeBtn"
                onClick={toggleSkillHistory}>[ close ]</button>
        </dialog>


    </>
}
