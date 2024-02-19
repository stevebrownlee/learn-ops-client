import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentRow } from "./AssessmentRow"
import { CapstoneRow } from "./CapstoneRow"
import { Button } from "@radix-ui/themes"

import Settings from "../../Settings.js"
import { fetchIt } from "../../utils/Fetch.js"

export const StudentInfo = ({ profile }) => {
    const history = useHistory()

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
                        <div>{profile?.project?.book_name}: {profile?.project?.name}</div>
                    </div>
                </div>
            </section>

            <section className="assessmentInfo text--mini" style={{ display: "flex", flexDirection: "row" }}>
                <div className="assessmentInfo__book" style={{ display: "flex", flexDirection: "column" }}>
                    <header style={{ flex: 1, minHeight: "10rem" }}>
                        <h3>Book Assessment Status</h3>
                        {
                            profile?.assessment_overview?.length > 0
                                ? profile?.assessment_overview?.map(assmt => <AssessmentRow key={`assmt--${assmt.id}`} assmt={assmt} />)
                                : "No self-assessments submitted yet"
                        }
                    </header>
                    <div style={{ flex: 4 }} className="notificationButtons">
                        <p>
                            <h3 className="studentAccount__header">Book Self-Assessments</h3>
                        </p>
                        <p>
                            When you are ready to start the self-assessment process for the
                            book you are currently working on, please click the button below to
                            let your instructors know.
                        </p>
                        <p>
                            <Button color="iris"
                                onClick={
                                    () => fetchIt(`${Settings.apiHost}/notify`, {
                                        method: "POST",
                                        body: JSON.stringify({
                                            message: `:orange_book: ${profile.name} is ready for the ${profile?.project?.book_name} self-assessment`
                                        })
                                    }).then(() => window.alert("Your instructors have been notified"))
                                }>
                                Ready to Start Self-Assessment
                            </Button>
                        </p>
                        <p>
                            When you have completed your reflections on your learning goals for this
                            book, please click the button below to let your instructors know to review
                            your vocabulary on the concepts.
                        </p>
                        <p>
                            <Button color="grass"
                                onClick={
                                    () => fetchIt(`${Settings.apiHost}/notify`, {
                                        method: "POST",
                                        body: JSON.stringify({
                                            message: `:speaking_head_in_silhouette: ${profile.name} is ready for the ${profile?.project?.book_name} vocabulary review`
                                        })
                                    })
                                        .then(() => window.alert("Your instructors will schedule a time to review your vocabulary with you."))
                                }
                            >Ready for Vocab Review</Button>
                        </p>
                    </div>
                </div>
                <div className="assessmentInfo__capstone" style={{ display: "flex", flexDirection: "column" }}>
                    <header style={{ flex: 1, minHeight: "10rem" }}>
                        <h3>Capstone Assessment Status</h3>
                        {
                            profile?.capstones?.length > 0
                                ? profile?.capstones?.map(capstone => <CapstoneRow key={`capstone--${capstone.capstone__id}`} capstone={capstone} />)
                                : "No proposals submitted yet"
                        }
                    </header>
                    <div style={{ flex: 4 }} className="notificationButtons">
                        <h3>Capstone Project Proposals</h3>
                        <div style={{ margin: "0 1rem" }}>
                            <p>
                                When you are ready to start building your capstone proposal,
                                please click the button below and make a copy of the template document.
                            </p>
                            <Button color="iris"
                                onClick={() => window.open("https://docs.google.com/document/d/1FGMU-wQqIciig0JhtOBBKOORSPCROUW0Y27w9io4qMg/edit", "_blank")}
                            >Proposal Template</Button>
                        </div>

                        <div style={{ margin: "0 1rem" }} >
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
                </div>
            </section>








        </div>
    </section>
}
