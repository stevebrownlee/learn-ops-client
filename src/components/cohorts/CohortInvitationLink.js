import React from "react"
import { CopyIcon } from "../../svgs/CopyIcon.js"
import Settings from "../Settings.js"

export const CohortInvitationLink = ({ activeCohortDetails }) => {
    return (
        <>
            <h3>Invitation Link</h3>

            <div style={{ margin: "1rem 0" }}>
                Send this link to incoming students to assign them to your cohort
            </div>

            <span className="fakeLink readonly">
                {`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`}
                <CopyIcon text={`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`} />
            </span>
        </>
    )
}
