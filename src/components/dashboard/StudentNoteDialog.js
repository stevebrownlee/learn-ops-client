import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, DropdownMenu } from '@radix-ui/themes'
import { DropdownMenuIcon } from '@radix-ui/react-icons'

import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import { PeopleContext } from "../people/PeopleProvider"
import { StudentNoteList } from "../people/StudentNoteList"

import "./student/StudentNotes.css"

export const StudentNoteDialog = ({ toggleNote, noteIsOpen }) => {
    const { activeStudent, getStudentNotes } = useContext(PeopleContext)
    const [message, setMessage] = useState("")
    const [notes, setNotes] = useState([])
    const [filteredNotes, setFilteredNotes] = useState([])
    const [noteType, setNoteType] = useState(2)
    const [studentNoteTypes, setStudentNoteTypes] = useState([])
    const [noteLabel, setNoteLabel] = useState("General Progress")
    const note = useRef(null)

    useEffect(() => {
        setFilteredNotes(notes)
    }, [notes])

    useEffect(() => {
        if (note && note.current && noteIsOpen) {
            note.current.focus()
        }
        if (noteIsOpen && activeStudent && "id" in activeStudent) {
            getNotes()
            fetchIt(`${Settings.apiHost}/notetypes`).then((res) => setStudentNoteTypes(res.results))
        }
    }, [noteIsOpen])

    const getNotes = () => {
        getStudentNotes(activeStudent.id).then(setNotes).then(() => note.current.focus())
    }

    const createStudentNote = (e) => {
        return fetchIt(`${Settings.apiHost}/notes`, {
            method: "POST",
            body: JSON.stringify({
                note: message,
                studentId: activeStudent.id,
                type: noteType
            })
        })
    }

    const deleteStudentNote = (noteId) => {
        fetchIt(`${Settings.apiHost}/notes/${noteId}`, { method: "DELETE" })
            .then(() => getStudentNotes(activeStudent.id).then(setNotes).then(() => note.current.focus()))
    }

    const showNoteTypeButtons = () => {
        const buttons = []
        for (let type of studentNoteTypes) {
            buttons.push(<Button key={`nt-btn--${type.id}`} color={`${noteType === type.id ? "lime" : "grass"}`} size="2" style={{
                margin: "0 0.2rem"
            }}
                onClick={() => {
                    setNoteType(type.id)
                    setNoteLabel(type.label)
                }}>{type.label}</Button>)
        }
        return buttons
    }

    const showFilterDropdownItems = () => {
        const buttons = []
        for (let type of studentNoteTypes) {
            buttons.push(<DropdownMenu.Item key={`dd-nt--${type.id}`} onClick={() => {
                setFilteredNotes(notes.filter(note => note.note_type.id === type.id))
            }}>{type.label}</DropdownMenu.Item>)
        }
        return buttons
    }

    const closeDialog = () => {
        toggleNote()
        setNotes([])
    }

    const handleNoteKeyDown = (e) => {
        if (e.key === "Enter") {
            if (noteType === 0) {
                return window.alert("Please choose a note type.")
            }
            createStudentNote().then(getNotes).then(() => setMessage(""))
        } else if (e.key === "Escape") {
            closeDialog()
        }
    }

    return <dialog id="dialog--note" className="dialog--note" open={noteIsOpen}>
        <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="form-group">{showNoteTypeButtons()}</div>

            <div className="form-group">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                        <Button variant="soft">
                            Filter notes
                            <DropdownMenuIcon/>
                        </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content>
                        {showFilterDropdownItems()}
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item onClick={() => setFilteredNotes(notes)}>Show all</DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
            </div>
        </div>

        <div className="form-group">
            <label>Add {noteLabel} Note:</label>
            <input type="text" id="statusText"
                className="form-control form-control--dialog"
                ref={note}
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleNoteKeyDown}
            />
        </div>

        <button className="fakeLink noteDialog__close" id="closeBtn" onClick={closeDialog}>[ close ]</button>
        <StudentNoteList notes={filteredNotes} deleteStudentNote={deleteStudentNote} />
    </dialog>
}
