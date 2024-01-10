import React, { useContext, useEffect, useRef, useState } from "react"

import * as Popover from '@radix-ui/react-popover'
import { FilePlusIcon, Pencil1Icon } from '@radix-ui/react-icons'

import { PeopleContext } from "./PeopleProvider"
import { CourseContext } from "../course/CourseProvider"
import { StandupContext } from "../dashboard/Dashboard"

import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"


export const StudentNotePopup = ({ student }) => {
    const {
        activateStudent, getCohortStudents, untagStudent,
        getStudentNotes, getStudentCoreSkills, getStudentProposals,
        getStudentLearningRecords
    } = useContext(PeopleContext)
    const { enteringNote, setEnteringNote } = useContext(StandupContext)

    const [note, setNote] = useState("")
    const [open, setOpen] = useState(false)

    const createStudentNote = (e) => {
        return fetchIt(`${Settings.apiHost}/notes`, {
            method: "POST",
            body: JSON.stringify({ note, studentId: student.id })
        })
    }

    const completeNoteCreation = () => {
        createStudentNote()
            .then(() => getStudentNotes(student.id))
            .then(() => setNote(""))
            .then(() => setOpen(false))
    }

    return (
        <Popover.Root open={open} onOpenChange={isOpen => {
            setOpen(isOpen)
            setEnteringNote(isOpen)
        }}>
            <Popover.Trigger asChild>
                <button className="NoteIconButton" aria-label="Add student note" onClick={() => {
                    setOpen(true)
                    setEnteringNote(true)
                }}>
                    <Pencil1Icon />
                </button>
            </Popover.Trigger>
            <Popover.Portal>
                <Popover.Content className="PopoverContent" sideOffset={5}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <p className="Text" style={{ marginBottom: 10 }}>
                            Note for {student.name}
                        </p>
                        <fieldset className="Fieldset">
                            <textarea className="Input" id="width" value={note}
                                onChange={e => setNote(e.target.value)}
                                onKeyDown={
                                    e => {
                                        if (e.key === "Enter") {
                                            completeNoteCreation()
                                        }
                                    }
                                } />
                        </fieldset>
                    </div>
                    <Popover.Arrow className="PopoverArrow" />

                    <div style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
                        <button
                            onClick={completeNoteCreation}
                            style={{ marginLeft: "auto" }} className="isometric-button blue small">Save</button>
                    </div>
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}
