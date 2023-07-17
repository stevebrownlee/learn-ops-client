import React, { useContext, useEffect } from "react"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { LearningObjectives } from "../course/LearningObjectives.js"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import { CourseContext } from "../course/CourseProvider.js"
import { AssessmentRow } from "../dashboard/student/AssessmentRow.js"
import "../people/Status.css"

export const StudentDetails = ({ toggleCohorts }) => {
    const { activeStudent } = useContext(PeopleContext)
    const { getStudentAssessments } = useContext(AssessmentContext)
    const { getLearningObjectives } = useContext(CourseContext)

    const hideOverlay = (e) => {
        document.querySelector('.overlay--student').style.display = "none"
    }

    useEffect(() => {
        if (activeStudent && "id" in activeStudent) {
            getStudentAssessments(activeStudent.id)
            getLearningObjectives()
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
                            Github: <a href={`https://www.github.com/${activeStudent?.github_handle}`}>
                                {`https://www.github.com/${activeStudent?.github_handle}`}</a>
                        </div>
                        <div className="student__cohort">
                            Cohort: <button className="fakeLink"
                                onClick={() => {
                                    toggleCohorts()
                                }}>
                                {activeStudent?.current_cohort?.name}
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

        <div className="card student__history">
            <div>
                <h3>Book Assessment Status</h3>
                {
                    activeStudent?.assessment_overview?.length > 0
                        ? activeStudent?.assessment_overview?.map(assmt => <AssessmentRow key={`assmt--${assmt.id}`} assmt={assmt} />)
                        : "No self-assessments submitted yet"
                }
            </div>
        </div>
    </div>
}
