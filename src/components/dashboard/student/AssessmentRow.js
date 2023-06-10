import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

export const AssessmentRow = ({ assmt }) => {
    let className = ""

    switch (assmt.status) {
        case "In Progress":
            className = "assessment--inProgress"
            break
        case "Ready for Review":
            className = "assessment--readyForReview"
            break
        case "Reviewed and Complete":
            className = "assessment--reviewedSuccess"
            break
        case "Reviewed and Incomplete":
            className = "assessment--reviewedFail"
            break
    }

    return <div className="bookassessments">
        <div className="bookassessment">
            <div className="bookassessment__name">{assmt.name}</div>
            <div className={`bookassessment__status ${className}`}>{assmt.status}</div>
        </div>
    </div>

}
