import React, { useRef, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { Badge, Button, Dialog, TextArea, Text, Flex, Checkbox } from '@radix-ui/themes'
import { FilePlusIcon, Pencil1Icon } from '@radix-ui/react-icons'
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

    return <section className="info">
        <h2 className="info__header" style={{ marginBottom: 0 }}>{profile?.name} Resources</h2>
        <div className="info__body info__body--student">

            <section className="studentAccounts">
                <div className="studentAccount">
                    <h3 className="studentAccount__header">Slack ID</h3>
                    <div>
                        <div>{profile?.slack_handle} <button
                            onClick={() => history.push("/slackUpdate")}
                            className="fakeLink">Update</button></div>
                    </div>
                </div>

                <div>
                    <h3 className="studentAccount__header">Current Project</h3>
                    <div>
                        {
                            profile && "project" in profile && profile.project.id === 0
                                ? <div>None</div>
                                : <div>{profile?.project?.book_name}: {profile?.project?.name}</div>
                        }
                    </div>
                </div>
            </section>

            <section className="assessmentInfo text--mini" >
                <div className="assessmentInfo__book" style={{ display: "flex", flexDirection: "column" }}>
                    <header>
                        <h3>Book Assessment Status</h3>
                        {
                            profile?.assessment_overview?.length > 0
                                ? profile?.assessment_overview?.map(assmt => <AssessmentRow key={`assmt--${assmt.id}`} assmt={assmt} />)
                                : "No self-assessments submitted yet"
                        }
                    </header>
                    <div className="notificationButtons">
                        <section>
                            <h3 className="studentAccount__header">Book Self-Assessments</h3>
                        </section>
                        <p>
                            You are done with the core projects in a book and are ready for the self-assessment.
                        </p>
                        <section>
                            <Button color="iris" onClick={createAssessmentRepo}>Start Self-Assessment</Button>
                        </section>
                        <p>
                            When you have completed the project code, completed the Vocabulary &amp; Understanding questions, and pushed your repository to Github, click the button below to notify your coaches.
                        </p>
                        <p>
                            <Dialog.Root open={dialogOpen}>
                                <Dialog.Trigger>
                                    <Button onClick={() => setDialogOpen(true)} color="grass">Self-Assessment Complete</Button>
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
                        </p>
                    </div>
                </div>
                <div className="assessmentInfo__capstone" style={{ marginTop: "5rem" }}>
                    <header>
                        <h3>Capstone Assessment Status</h3>
                        {
                            profile?.capstones?.length > 0
                                ? profile?.capstones?.map(capstone => <CapstoneRow key={`capstone--${capstone.capstone__id}`} capstone={capstone} />)
                                : "No capstone proposals submitted yet"
                        }
                    </header>
                    <div className="notificationButtons">
                        <h3>Capstone Project Proposals</h3>
                        <p>
                            When you are ready to start building your capstone proposal,
                            please click the button below and make a copy of the template document.
                        </p>
                        <Button color="iris"
                            onClick={() => window.open("https://docs.google.com/document/d/1FGMU-wQqIciig0JhtOBBKOORSPCROUW0Y27w9io4qMg/edit", "_blank")}
                        >Proposal Template</Button>

                        <p>
                            When you are ready to submit your capstone proposal, click the
                            button below to let your instructors know that it is ready for review.
                        </p>
                        <Button color="grass"
                            onClick={() => history.push("/proposal/client")}>
                            Submit Proposal
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    </section>
}
