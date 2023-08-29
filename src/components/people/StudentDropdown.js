import React, { useContext, useEffect, useRef, useState } from "react"
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import {
    DotFilledIcon,
    CheckIcon,
    ChevronRightIcon,
    DropdownMenuIcon,
    CaretDownIcon,
} from '@radix-ui/react-icons'
import { PeopleContext } from "./PeopleProvider.js"
import { CourseContext } from "../course/CourseProvider.js"
import useKeyboardShortcut from "../ui/useKeyboardShortcut.js"

export const StudentDropdown = ({
    toggleStatuses, student,
    getStudentNotes, toggleNote,
    toggleTags, assignStudentToProject
}) => {
    const { activateStudent, activeStudent } = useContext(PeopleContext)
    const { getCourses, activeCourse, getActiveCourse } = useContext(CourseContext)
    const [bookmarksChecked, setBookmarksChecked] = React.useState(true)
    const [urlsChecked, setUrlsChecked] = React.useState(false)
    const [person, setPerson] = React.useState('')

    const switcher = (e) => {
        switch (e.key) {
            case "n":
                toggleNote()
                break;
            case "a":
                toggleStatuses()
                break;

            default:
                break;
        }
    }

    return (
        <DropdownMenu.Root onOpenChange={(open) => {
            if (open) {
                activateStudent(student)
                document.addEventListener("keyup", switcher)
            }
            else {
                document.removeEventListener("keyup", switcher)
            }
        }}>
            <DropdownMenu.Trigger asChild >
                <button className="IconButton" aria-label="Student options">
                    <CaretDownIcon />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content className="DropdownMenuContent" sideOffset={5}>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => {
                        toggleNote()
                    }}>
                        Add Note
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="DropdownMenuItem" onClick={() => {
                        toggleTags()
                    }}>
                        Add Tag
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />
                    <DropdownMenu.Label className="DropdownMenuLabel">Book Assessment</DropdownMenu.Label>
                    <DropdownMenu.Item className="DropdownMenuItem">
                        Send Link
                    </DropdownMenu.Item>

                    <DropdownMenu.Item className="DropdownMenuItem"
                        onClick={() => {
                            toggleStatuses()
                        }}>
                        Set status
                    </DropdownMenu.Item>

                    <DropdownMenu.Separator className="DropdownMenuSeparator" />
                    <DropdownMenu.Label className="DropdownMenuLabel">Progress Tracking</DropdownMenu.Label>

                    <DropdownMenu.Sub>
                        <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                            Assign to project
                            <div className="RightSlot">
                                <ChevronRightIcon />
                            </div>
                        </DropdownMenu.SubTrigger>
                        <DropdownMenu.Portal>
                            <DropdownMenu.SubContent
                                className="DropdownMenuSubContent"
                                sideOffset={2}
                                alignOffset={-5}
                            >
                                {
                                    activeCourse.books.map(book => {
                                        if (book.index >= student.book.index) {
                                            return <DropdownMenu.Sub key={`subbook--${book.id}`}>
                                                <DropdownMenu.SubTrigger className="DropdownMenuSubTrigger">
                                                    {book.name}
                                                    <div className="RightSlot"> <ChevronRightIcon /> </div>
                                                </DropdownMenu.SubTrigger>
                                                <DropdownMenu.SubContent
                                                    className="DropdownMenuSubContent"
                                                    sideOffset={2}
                                                    alignOffset={-5}
                                                >
                                                    {
                                                        book.projects.map(project => {
                                                            return <DropdownMenu.Item key={`subproject--${project.id}`}
                                                                onClick={() => assignStudentToProject(student.id, project.id)}
                                                                className="DropdownMenuItem">
                                                                {project.name}
                                                            </DropdownMenu.Item>
                                                        })
                                                    }
                                                </DropdownMenu.SubContent>
                                            </DropdownMenu.Sub>
                                        }
                                    })
                                }
                            </DropdownMenu.SubContent>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Sub>

                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    )
}
