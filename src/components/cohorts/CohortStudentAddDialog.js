import React, { useContext, useEffect, useState } from "react"
import { Badge, Button, Dialog, TextArea, Text, Flex, MagnifyingGlassIcon } from '@radix-ui/themes'
import { TextField } from '@radix-ui/themes'

import { CohortContext } from "./CohortProvider.js"
import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"
import { Toast } from "toaster-js"

export const CohortStudentAddDialog = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [studentName, setStudentName] = useState("")
    const [foundStudents, setFoundStudents] = useState([])

    const {
        activeCohort, activeCohortDetails, getCohort,
        getCohortInfo, saveCohortInfo, updateCohortInfo,
        updateCohort
    } = useContext(CohortContext)

    useEffect(() => {
        if (studentName.length >= 2) {
            fetchIt(`${Settings.apiHost}/students?lastname_like=${studentName}`)
                .then(data => setFoundStudents(data))
        }
        else {
            setFoundStudents([])
        }
    }, [studentName])

    const transferStudent = (id) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${activeCohortDetails.id}/assign`, {
            method: "POST",
            body: JSON.stringify({
                person_id: id
            })
        }).then(() => {
            setDialogOpen(false)
            getCohortInfo(activeCohortDetails.info)
            new Toast("Student transferred to cohort", Toast.TYPE_DONE, Toast.TIME_NORMAL)
        })
    }

    return (
        <Dialog.Root open={dialogOpen}>
            <Dialog.Trigger>
                <Button onClick={() => setDialogOpen(true)} color="blue">Transfer Student to Cohort</Button>
            </Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Find Student</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Search for the student by their last name.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <label>
                        <TextField.Root>
                            <TextField.Slot> 🔍 </TextField.Slot>
                            <TextField.Input value={studentName}
                                onChange={(e) => setStudentName(e.target.value ?? "")}
                                placeholder="Student last name" />
                        </TextField.Root>
                    </label>
                </Flex>

                <Flex gap="1" direction="column">
                    <h3>Results</h3>
                    <Text>{foundStudents.length
                        ? foundStudents.map(s => <div key={`fs--${s.id}`} className="student--found"
                            onClick={() => transferStudent(s.id)}>
                                {s.name}
                            </div>)
                        : "None"}</Text>
                </Flex>


                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={() => { }}>Add</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
