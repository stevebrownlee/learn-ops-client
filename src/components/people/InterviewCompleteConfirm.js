import React, { useEffect, useContext } from "react"
import { Badge, Button, Dialog, TextArea, Text, Flex } from '@radix-ui/themes'

import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { PeopleContext } from "./PeopleProvider.js"
import { CohortContext } from "../cohorts/CohortProvider.js"

export const InterviewCompleteConfirm = ({ dialogOpen, setDialogOpen }) => {

    const [complete, setComplete] = React.useState('')
    const { activeStudent, getCohortStudents } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)

    const updateStudentInterviewStatus = () => {
        fetchIt(`${Settings.apiHost}/interviews`, {
            method: "POST",
            body: JSON.stringify({ student_id: activeStudent.id })
        })
        .then(() => {
            getCohortStudents(activeCohort)
        })
    }

    return <Dialog.Root open={dialogOpen}>
        <Dialog.Content>
            <Dialog.Title>Technical Interview</Dialog.Title>
            <Dialog.Description size="2" mb="4">
                Confirm that you have performed a practice technical interview with this student for this book and provided feedback.
            </Dialog.Description>

            <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button onClick={() => {
                        setDialogOpen(false)
                        updateStudentInterviewStatus()
                    }}>Yes</Button>
                </Dialog.Close>
                <Dialog.Close>
                    <Button variant="soft" color="gray" onClick={() => { setDialogOpen(false) }}>Cancel</Button>
                </Dialog.Close>
            </Flex>
        </Dialog.Content>
    </Dialog.Root >
}