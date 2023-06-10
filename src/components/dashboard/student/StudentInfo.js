import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { AssessmentRow } from "./AssessmentRow.js"
import { CapstoneRow } from "./CapstoneRow.js"

export const StudentInfo = ({ profile }) => {
    const history = useHistory()

    return <section className="info">
        <h2 className="info__header" style={{ marginBottom: 0 }}>Your Info</h2>
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

            </div>
            <div className="studentassessments text--mini">
                <div className="assessmentlist">
                    <h3>Book Assessments</h3>
                    {profile?.assessment_overview?.map(assmt => <AssessmentRow  key={`assmt--${assmt.id}`} assmt={assmt} />)}
                </div>
                <div className="assessmentlist">
                    <h3>Capstone Assessments</h3>
                    {profile?.capstones?.map(capstone => <CapstoneRow key={`capstone--${capstone.id}`} capstone={capstone} />)}

                    <div style={{marginTop: "auto", marginLeft: "auto"}} >
                        <button className="button btn-github" onClick={() => history.push("/proposal/client")}>Submit Capstone Proposal</button>
                    </div>

                </div>
            </div>
        </div>
    </section>
}
