import React, { useContext, useEffect, useRef, useState } from "react"

import { FilePlusIcon, Pencil1Icon } from '@radix-ui/react-icons'
import { Button, TextField, Popover, Text, TextArea, Checkbox, Box, Flex, Avatar, IconButton } from '@radix-ui/themes'

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
            .then(() => setEnteringNote(false))
    }

    return (
        <Popover.Root open={open} onOpenChange={isOpen => {
            setOpen(isOpen)
            setEnteringNote(isOpen)
        }}>
            <Popover.Trigger asChild>
                <IconButton style={{
                    color: "black",
                    backgroundColor: "transparent",
                    position: "absolute",
                    bottom: "0.1rem",
                    right: 0,
                    margin: 0,
                    padding: 0,
                    alignItems: "flex-end"
                }}
                    className="NoteIconButton"
                    onClick={() => {
                        setOpen(true)
                        setEnteringNote(true)
                    }}>
                    <Pencil1Icon width="16" height="16" />
                </IconButton>
            </Popover.Trigger>
            <Popover.Content>
                <Flex gap="3">
                    <Avatar
                        size="2"
                        src={student.avatar}
                        fallback="A"
                        radius="full"
                    />
                    <Box grow="1">
                        <TextArea value={note}
                            onChange={e => setNote(e.target.value)}
                            placeholder="Enter evaluation note…" style={{ height: 80 }}
                            onKeyDown={
                                e => e.key === "Enter" && completeNoteCreation()
                            } />
                        <Flex gap="3" mt="3" justify="between">
                            <Popover.Close>
                                <Button size="1" onClick={completeNoteCreation}>Save</Button>
                            </Popover.Close>
                        </Flex>
                    </Box>
                </Flex>
            </Popover.Content>
        </Popover.Root>
    )
}
