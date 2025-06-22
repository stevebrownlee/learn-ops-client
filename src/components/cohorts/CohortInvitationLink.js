import React from "react"
import { CopyIcon } from "../../svgs/CopyIcon.js"
import Settings from "../Settings.js"

export const CohortInvitationLink = ({ activeCohortDetails }) => {
    return (
        <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>
            <h3>Invitation Link</h3>

            <span className="fakeLink readonly" style={{ maxHeight: "1.5rem", margin: "0.75rem 0 0 0"}}>
                {`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`}
                <CopyIcon text={`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`} />
            </span>
        </div>
    )
}
