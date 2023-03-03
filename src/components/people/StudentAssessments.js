import React, { useContext, useState } from "react"
import { StudentProposals } from "./StudentProposals"

export const StudentAssessments = () => {


    return <>
        <div style={{margin: "0 0 0 2rem"}} className="card-title">
            <h2>Assessments</h2>
        </div>

        <div className="card card--row">
            <StudentProposals />
        </div>
    </>
}
