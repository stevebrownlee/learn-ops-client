import React, { useContext, useEffect } from "react"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { LearningObjectives } from "../course/LearningObjectives.js"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentPersonality } from "./StudentPersonality.js"
import { StudentProposals } from "./StudentProposals.js"
import "../people/Status.css"
import { StudentAssessments } from "./StudentAssessments.js"

export const StudentDetails = ({ toggleCohorts }) => {
    const { activeStudent } = useContext(PeopleContext)
    const { getStudentAssessments } = useContext(AssessmentContext)

    const hideOverlay = (e) => {
        document.querySelector('.overlay--student').style.display = "none"
    }

    useEffect(() => {
        if (activeStudent && "id" in activeStudent) {
            getStudentAssessments(activeStudent.id)
        }
    }, [activeStudent])

    return <div className="overlay--student">
        <div className="card" style={{
            display: "flex",
            alignItems: "center",
            padding: "1rem 0 0 0"
        }}>
            <span onClick={hideOverlay} className="close hairline"></span>
        </div>
        <div className="card">
            <div className="card-body">
                <header className="student__header">
                    <h2 className="card-title student__info">
                        {activeStudent?.name}
                    </h2>
                    <div className="student__score">
                        {activeStudent?.score}
                    </div>
                </header>
                <div className="card-text">
                    <div className="student__details">

                        <div className="student__github">
                            Github: <a href={`https://www.github.com/${activeStudent?.github}`}>
                                {`https://www.github.com/${activeStudent?.github}`}</a>
                        </div>
                        <div className="student__cohort">
                            Cohort: <button className="fakeLink"
                                onClick={() => {
                                    toggleCohorts()
                                }}>
                                {activeStudent?.cohorts?.map(c => c.name).join(", ")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div className="card">
            <CoreSkillSliders />
        </div>

        <div className="card">
            <LearningObjectives />
        </div>

        <StudentAssessments />

        <div className="card">
            <StudentPersonality />
        </div>
    </div>
}
