import React, { useRef, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Badge, Button, Dialog, TextArea, Text, Flex, Checkbox, Card, Grid, Box, Container } from '@radix-ui/themes'
import { FilePlusIcon, Pencil1Icon, IdCardIcon, BookmarkIcon } from '@radix-ui/react-icons'
import { Toast, deleteAllToasts } from "toaster-js"

import Settings from "../../Settings.js"
import { fetchIt } from "../../utils/Fetch.js"
import { AssessmentRow } from "./AssessmentRow"
import { CapstoneRow } from "./CapstoneRow"


export const StudentInfo = ({ profile }) => {

    const history = useHistory()
    const [githubUrl, setGithubUrl] = useState('')
    const [vocab, setVocab] = useState(false)
    const [pushed, setPushed] = useState(false)
    const [validationMessage, setValidationMessage] = useState('')
    const [dialogOpen, setDialogOpen] = useState(false)

    const toasterElement = useRef(null)

    useEffect(() => {
        toasterElement.current = document.createElement("div")
        toasterElement.current.innerHTML = "<h2>Sent!</h2><p>If you want to request a 1-on-1 review, send a message in your cohort channel.</p>"

        return () => {
            if (toasterElement.current) {
                deleteAllToasts()
                toasterElement.current.remove()
            }
        }
    }, [])

    useEffect(() => {
        if (profile && profile.assessment_overview && profile.assessment_overview.length > 0) {
            const latestAssessment = profile.assessment_overview[0]
            setGithubUrl(latestAssessment.github_url)
        }
    }, [profile])

    const createAssessmentRepo = () => {
        fetchIt(`${Settings.apiHost}/students/${profile.id}/assess`, {
            method: "POST",
            body: JSON.stringify({ bookId: profile?.project?.book_id }),
            autoHandleResponse: false
        })
            .then(res => {
                if (res.status === 409) {
                    const assessmentRepoURL = res.headers.get("Location")
                    fetchIt(assessmentRepoURL).then(sa => {
                        let element = document.createElement("div");
                        element.innerHTML = `<h2>Already Started</h2>
                            <p>You have already started the ${sa.assessment.name} self-assessment. Its status is ${sa.status}.</p>
                            <p>Here is the link <a href="${sa.url}" target="_blank">${sa.url}</a></p>`

                        new Toast(element, Toast.TYPE_INFO, 6000)
                    })
                }
                else {
                    new Toast(
                        "Your self-assessment project has been created. You will receive a notification in Slack with the link to the project.",
                        Toast.TYPE_DONE, Toast.TIME_NORMAL
                    )
                }
            })
    }

    const validateSubmission = () => {
        if (pushed && vocab) {
            fetchIt(`${Settings.apiHost}/students/${profile.id}/assess`, {
                method: "PUT",
                body: JSON.stringify({ statusId: 2 })
            })
                .then(() => {
                    setPushed(false)
                    setVocab(false)
                    setValidationMessage('')

                    setDialogOpen(false)

                    new Toast(toasterElement.current, Toast.TYPE_DONE, Toast.TIME_LONG);
                })
        }
        else {
            setValidationMessage("Please complete the Vocabulary & Understanding questions and push your code to Github.")
        }
    }

    return (
        <Container>
            <Grid columns={{ initial: "1", sm: "2" }} gap="2" mb="3">
                {/* Student Info Card */}
                <Card>
                    <Flex direction="column" gap="3">
                        <Flex align="center" gap="2">
                            <IdCardIcon width="20" height="20" />
                            <Text size="4" weight="bold">Student Information</Text>
                        </Flex>

                        <Box>
                            <Text size="2" weight="bold">Slack ID</Text>
                            <Flex align="center" gap="2">
                                <Text>{profile?.slack_handle}</Text>
                                <Button variant="ghost" size="1" onClick={() => history.push("/slackUpdate")}>
                                    Update
                                </Button>
                            </Flex>
                        </Box>

                        <Box>
                            <Text style={{ margin: "0 0.75rem 0 0"}} size="2" weight="bold">Current Project</Text>
                            <Text>
                                {
                                    profile && "project" in profile && profile.project.id === 0
                                        ? "None"
                                        : `${profile?.project?.book_name}: ${profile?.project?.name}`
                                }
                            </Text>
                        </Box>
                    </Flex>
                </Card>

                {/* Book Assessment Status Card */}
                <Card>
                    <Flex direction="column" gap="3">
                        <Flex align="center" gap="2">
                            <BookmarkIcon width="20" height="20" />
                            <Text size="4" weight="bold">Book Assessment Status</Text>
                        </Flex>

                        <Box>
                            {
                                profile?.assessment_overview?.length > 0
                                    ? profile?.assessment_overview?.map(assmt => <AssessmentRow key={`assmt--${assmt.id}`} assmt={assmt} />)
                                    : <Text color="gray">No self-assessments submitted yet</Text>
                            }
                        </Box>
                    </Flex>
                </Card>
            </Grid>

            <Grid columns={{ initial: "1", sm: "2" }} gap="2">
                {/* Book Self-Assessment Card */}
                <Card>
                    <Flex direction="column" gap="3">
                        <Text size="4" weight="bold">Book Self-Assessments</Text>

                        <Text size="2">
                            You are done with the core projects in a book and are ready for the self-assessment.
                        </Text>

                        <Flex gap="3" wrap="wrap">
                            <Button color="iris" onClick={createAssessmentRepo}>
                                Start Self-Assessment
                            </Button>

                            <Dialog.Root open={dialogOpen}>
                                <Dialog.Trigger>
                                    <Button onClick={() => setDialogOpen(true)} color="grass">
                                        Self-Assessment Complete
                                    </Button>
                                </Dialog.Trigger>

                                <Dialog.Content>
                                    <Dialog.Title>Complete Self-Assessment</Dialog.Title>
                                    <Dialog.Description size="2" mb="4">
                                        Verify that you have completed the project code, the Vocabulary &amp; Understanding questions, and pushed your repository to Github.
                                    </Dialog.Description>

                                    <Flex direction="column" gap="3">
                                        <label>
                                            <Text as="div" size="2" mb="1" weight="bold">
                                                Github Repository URL
                                            </Text>
                                            <TextArea readOnly={true} value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)}
                                                placeholder="https://github.com/your-username/repository"
                                            />
                                        </label>
                                    </Flex>

                                    <Flex gap="3" mt="3">
                                        <Badge color="crimson">{validationMessage}</Badge>
                                    </Flex>

                                    <Text as="label" size="1">
                                        <Flex gap="2" mt="3" direction="column">
                                            <label>
                                                <Checkbox onClick={() => {
                                                    setVocab(!vocab)
                                                    setValidationMessage('')
                                                }} checked={vocab} /> I have completed the Vocablary &amp; Understanding questions.
                                            </label>
                                            <label>
                                                <Checkbox onClick={() => {
                                                    setPushed(!pushed)
                                                    setValidationMessage('')
                                                }} checked={pushed} /> All of my code has been pushed to Github.
                                            </label>
                                        </Flex>
                                    </Text>

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
                                            <Button onClick={validateSubmission}>Save</Button>
                                        </Dialog.Close>
                                    </Flex>
                                </Dialog.Content>
                            </Dialog.Root>
                        </Flex>

                        <Text size="2" color="gray">
                            When you have completed the project code, completed the Vocabulary &amp; Understanding questions,
                            and pushed your repository to Github, click the "Self-Assessment Complete" button to notify your coaches.
                        </Text>
                    </Flex>
                </Card>

                {/* Capstone Card */}
                <Card>
                    <Flex direction="column" gap="3">
                        <Text size="4" weight="bold">Capstone Project</Text>

                        <Box>
                            <Text size="3" weight="bold">Current Status</Text>
                            {
                                profile?.capstones?.length > 0
                                    ? profile?.capstones?.map(capstone => <CapstoneRow key={`capstone--${capstone.capstone__id}`} capstone={capstone} />)
                                    : <Text color="gray">No capstone proposals submitted yet</Text>
                            }
                        </Box>

                        <Text size="2">
                            When you are ready to start building your capstone proposal,
                            please use the template document.
                        </Text>

                        <Flex gap="3" wrap="wrap">
                            <Button color="iris"
                                onClick={() => window.open("https://docs.google.com/document/d/1FGMU-wQqIciig0JhtOBBKOORSPCROUW0Y27w9io4qMg/edit", "_blank")}
                            >
                                Proposal Template
                            </Button>

                            <Button color="grass"
                                onClick={() => history.push("/proposal/client")}
                            >
                                Submit Proposal
                            </Button>
                        </Flex>

                        <Text size="2" color="gray">
                            When you are ready to submit your capstone proposal, click the
                            "Submit Proposal" button to let your instructors know that it is ready for review.
                        </Text>
                    </Flex>
                </Card>
            </Grid>
        </Container>
    )
}
