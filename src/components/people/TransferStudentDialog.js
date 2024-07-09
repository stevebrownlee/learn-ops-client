import React, { useContext, useEffect, useState } from "react"
import { Select, Button, Dialog, Text, Flex } from '@radix-ui/themes'
import { TextField } from '@radix-ui/themes'

import { CohortContext } from "../cohorts/CohortProvider.js"
import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"
import { Toast } from "toaster-js"
import { PeopleContext } from "./PeopleProvider.js"

export const TransferStudentDialog = () => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [chosenCohort, chooseCohort] = useState(0)

    const { cohorts, getCohorts, activeCohort } = useContext(CohortContext)
    const { getCohortStudents, activeStudent, getStudent } = useContext(PeopleContext)

    useEffect(() => {
        getCohorts({ active: true})
    }, [])

    const transferStudent = () => {
        fetchIt(`${Settings.apiHost}/students/${activeStudent.id}?soft=true`, {
            method: "DELETE"
        }).then(() => {
            getCohortStudents(activeCohort)
        }).then(() => {
            fetchIt(`${Settings.apiHost}/cohorts/${chosenCohort}/assign`, {
                method: "POST",
                body: JSON.stringify({ person_id: activeStudent.id })
            }).then(() => {
                setDialogOpen(false)
                getStudent(activeStudent.id)
                new Toast("Student transferred", Toast.TYPE_DONE, Toast.TIME_NORMAL)
            })
        })

    }

    return (
        <Dialog.Root open={dialogOpen}>
            <Dialog.Trigger>
                <Button size="1" onClick={() => setDialogOpen(true)} color="cyan">Transfer Student</Button>
            </Dialog.Trigger>

            <Dialog.Content>
                <Dialog.Title>Choose Cohort</Dialog.Title>
                <Dialog.Description size="2" mb="4">
                    Select the cohort to which the student is transferring.
                </Dialog.Description>

                <Flex direction="column" gap="3">
                    <Select.Root onValueChange={chooseCohort} value={chosenCohort}>
                        <Select.Trigger>{activeStudent?.current_cohort?.name}</Select.Trigger>
                        <Select.Content>
                            <Select.Item value=""></Select.Item>
                            {
                                cohorts.map(cohort => <Select.Item key={cohort.id} value={cohort.id}>{cohort.name}</Select.Item>)
                            }
                        </Select.Content>
                    </Select.Root>

                </Flex>

                <Flex gap="3" mt="4" justify="end">
                    <Dialog.Close>
                        <Button variant="soft" color="gray" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    </Dialog.Close>
                    <Dialog.Close>
                        <Button onClick={transferStudent}>Transfer</Button>
                    </Dialog.Close>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    )
}
