import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentRow } from "./AssessmentRow"
import { CapstoneRow } from "./CapstoneRow"

export const StudentInfo = ({ profile }) => {
    const history = useHistory()

    return <section className="info">
        <h2 className="info__header" style={{ marginBottom: 0 }}>Personal Resources</h2>
        <div className="info__body">
            <div className="studentAccounts">
                <div className="studentAccount">
                    <h3 className="studentAccount__header">Repositories</h3>
                    <div><a href={`https://www.github.com/${profile?.github}`} target="_blank">Personal Repositories</a></div>
                </div>
                <div className="studentAccount">
                    <h3 className="studentAccount__header">Slack ID</h3>
                    <div>
                        <div>{profile?.slack_handle} <button
                            onClick={() => history.push("/slackUpdate")}
                            className="fakeLink">Update</button></div>
                    </div>
                </div>
                <div className="studentAccount">
                    <h3 className="studentAccount__header">Capstone Proposals</h3>
                    <div style={{ display: "flex" }}>
                        <div style={{ margin: "0 1rem" }} >
                            <button className="isometric-button blue small"
                                style={{ padding: "0.5rem" }}
                                onClick={() => window.open("https://docs.google.com/document/d/1FGMU-wQqIciig0JhtOBBKOORSPCROUW0Y27w9io4qMg/edit", "_blank")}>
                                Start Proposal
                            </button>
                        </div>

                        <div style={{ margin: "0 1rem" }} >
                            <button className="isometric-button red small"
                                style={{ padding: "0.5rem" }}
                                onClick={() => history.push("/proposal/client")}>
                                Submit Proposal
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="studentassessments text--mini">
                <div className="assessmentlist">
                    <h3>Book Assessment Status</h3>
                    {
                        profile?.assessment_overview?.length > 0
                            ? profile?.assessment_overview?.map(assmt => <AssessmentRow key={`assmt--${assmt.id}`} assmt={assmt} />)
                            : "No self-assessments submitted yet"
                    }
                </div>
                <div className="assessmentlist">
                    <h3>Capstone Assessment Status</h3>
                    {
                        profile?.capstones?.length > 0
                            ? profile?.capstones?.map(capstone => <CapstoneRow key={`capstone--${capstone.capstone__id}`} capstone={capstone} />)
                            : "No proposals submitted yet"
                    }
                </div>
            </div>
        </div>
    </section>
}
