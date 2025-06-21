import React from "react"
import { CopyIcon } from "../../svgs/CopyIcon.js"
import Settings from "../Settings.js"

export const CohortInvitationLink = ({ activeCohortDetails }) => {
    return (
        <>
            <h3>Invitation Link</h3>

            <span className="fakeLink readonly">
                {`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`}
                <CopyIcon text={`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`} />
            </span>
        </>
    )
}
