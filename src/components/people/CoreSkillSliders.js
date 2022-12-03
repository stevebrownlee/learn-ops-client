import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "./PeopleProvider"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import "./CoreSkills.css"
import { HumanDate } from "../utils/HumanDate"
import { HelpIcon } from "../../svgs/Help"

export const CoreSkillSliders = () => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const [note, setNote] = useState("")
    const [changedRecord, updateChangedRecord] = useState(0)
    const [skillRecords, setSkillRecords] = useState([])
    const [chosenCoreSkill, setChosenCoreSkill] = useState(0)
    let { toggleDialog: toggleCoreSkillNote } = useModal("#dialog--coreskillNote")
    let { toggleDialog: toggleSkillHistory } = useModal("#dialog--coreskillHistory")

    const coreSkillTips = [
        "Once a problem is analyzed, understood, and deconstructed into functional units, algorithmic thinking develops a logical, efficient series of steps required to solve each unit. Each functional unit is broken down into basic operations (BO) or elementary operations (EO).",
        "Use objective, logic-based approach to identify the functional units of a problem. Detect patterns, and using them to think creativity when presented with new challenges.",
        "Communicate effectivly with both technical and non-technical language. Master complex communication during group-based work. Use correct vocabulary when describing technical concepts. Know how, and when to ask for help from a senior technical resource.",
        "Efficient learners take the time to use every resource available to learn a new skill, or implement a non-mastered skill in a new context. Debugger, dev tools, web searches, and evaluating those search results."
    ]

    const reset = () => {
        setNote("")
        toggleCoreSkillNote()
    }

    useEffect(() => {
        if (chosenCoreSkill !== 0) {
            const coreSkill = activeStudent.core_skill_records
                .find(record => record.id === chosenCoreSkill)

            setSkillRecords(coreSkill.notes.map(n => ({ ...n })).reverse())
        }

    }, [chosenCoreSkill])

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
                    ? activeStudent.core_skill_records
                        .sort((thisOne, nextOne) => thisOne.skill.label > nextOne.skill.label ? 1 : -1)
                        .map(
                            (record, index) => <section className="slider" key={`coreskill--${record.id}`}>
                                <i className="icon icon-eye icon--more"
                                    onClick={e => {
                                        setChosenCoreSkill(record.id)
                                        toggleSkillHistory()
                                    }}
                                ></i>
                                <h4 className="slider__header">{record.skill.label} ({record.level})</h4>
                                <HelpIcon tip={coreSkillTips[index]} />
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

        <dialog style={{ paddingTop: "1rem" }} id="dialog--coreskillHistory" className="dialog--coreskillHistory">
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
