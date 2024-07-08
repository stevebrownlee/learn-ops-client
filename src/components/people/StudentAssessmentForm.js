import React, { useEffect, useContext } from "react"
import { Badge, Button, Dialog, TextArea, Text, Flex } from '@radix-ui/themes'

import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { PeopleContext } from "./PeopleProvider.js"

export const StudentAssessmentForm = ({ dialogOpen, setDialogOpen }) => {

    const [feedback, setFeedback] = React.useState('')
    const [validationMessage, setValidationMessage] = React.useState('')
    const [currentAssessment, setCurrentAssessment] = React.useState({ assessment: { objectives: [] } })
    const [assessmentObjectives, setAssessmentObjectives] = React.useState(new Set())
    const [learningObjectivesMet, setLearningObjectivesMet] = React.useState(new Set())

    const { studentAssessments } = useContext(AssessmentContext)
    const { activeStudent, getCohortStudents } = useContext(PeopleContext)

    const validateFeedback = () => {
        if (!learningObjectivesMet.isSupersetOf(assessmentObjectives)) {
            setValidationMessage(`Please validate that ${activeStudent.name} has met all objectives before saving.`)

            setTimeout(() => {
                setValidationMessage('')
            }, 3000)

            return
        }

        if (feedback !== '') {
            fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/assess`, {
                method: "PUT",
                body: JSON.stringify({
                    statusId: 4,
                    instructorNotes: feedback
                })
            })
                .then(() => {
                    setDialogOpen(false)

                    const cohortId = JSON.parse(localStorage.getItem("activeCohort"))
                    getCohortStudents(cohortId)
                })
        }
        else {
            setValidationMessage("Please provide feedback before saving.")
        }
    }

    useEffect(() => {
        if (studentAssessments.length > 0) {
            const currentAssessment = studentAssessments[0]
            const defaultObjectivesSet = new Set(currentAssessment.assessment.objectives.map(o => o.id))
            setAssessmentObjectives(defaultObjectivesSet)
            setCurrentAssessment(studentAssessments[0])
        }
    }, [studentAssessments])

    useEffect(() => {
        if (validationMessage !== '' && feedback !== '') {
            setTimeout(() => {
                setValidationMessage('')
            }, 1000)
        }
    }, [feedback])


    return <Dialog.Root open={dialogOpen}>
        <Dialog.Content>
            <Dialog.Title>Assessment Evaluation</Dialog.Title>
            <Dialog.Description size="2" mb="4">
                Verify that the student has demonstrated understanding of the following concepts. Then provide feedback on their vocabulary.
            </Dialog.Description>

            <Text>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem",
                    margin: "1rem 0"
                }}>
                    {
                        currentAssessment.assessment.objectives.map(
                            objective => <Badge key={`objective--${objective.id}`} color="plum">
                                <input type="checkbox"
                                    id={`objective--${objective.id}`}
                                    name={`objective--${objective.id}`}
                                    onChange={(e) => {
                                        const copy = new Set(learningObjectivesMet)
                                        if (e.target.checked) {
                                            copy.add(objective.id)
                                        } else {
                                            copy.delete(objective.id)
                                        }
                                        setLearningObjectivesMet(copy)
                                    }}
                                /> {objective.label}
                            </Badge>
                        )
                    }
                </div>
            </Text>

            <Flex direction="column" gap="3">
                <label>
                    <Text as="div" size="2" mb="1" weight="bold">
                        Feedback
                    </Text>
                    <TextArea value={feedback} onChange={(e) => setFeedback(e.target.value)} />
                </label>
            </Flex>

            <Flex gap="3" mt="3">
                <Badge color="crimson">{validationMessage}</Badge>
            </Flex>



            <Flex gap="3" mt="4" justify="end">
                <Dialog.Close>
                    <Button variant="soft" color="gray" onClick={() => {
                        setDialogOpen(false)
                        setValidationMessage('')
                    }}>
                        Cancel
                    </Button>
                </Dialog.Close>
                <Dialog.Close>
                    <Button onClick={validateFeedback}>Save</Button>
                </Dialog.Close>
            </Flex>
        </Dialog.Content>
    </Dialog.Root >
}