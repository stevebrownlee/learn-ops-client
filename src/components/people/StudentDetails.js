import React, { useContext } from "react"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { LearningObjectives } from "../course/LearningObjectives.js"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentPersonality } from "./StudentPersonality.js"

export const StudentDetails = ({ student, toggleCohorts }) => {
    const { activeStudent } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)

    const hideOverlay = (e) => {
        document.querySelector('.overlay').style.display = "none"
    }

    return (
        <>
            <div className="overlay" onClick={hideOverlay}>
                <div className="card">X</div>
                <div className="card">
                    <div className="card-body">
                        <header className="student__header">
                            <h2 className="card-title student__info">
                                {activeStudent.name}
                            </h2>
                            <div className="student__score">
                                {activeStudent.score}
                            </div>
                        </header>
                        <div className="card-text">
                            <div className="student__details">

                                <div className="student__github">
                                    Github: <a href={`https://www.github.com/${activeStudent.github}`}>
                                        {`https://www.github.com/${activeStudent.github}`}</a>
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
                    <CoreSkillSliders hideOverlay={hideOverlay} />
                </div>

                <div className="card">
                    <LearningObjectives />
                </div>

                <div className="card">
                    <StudentPersonality />
                </div>
            </div>
        </>
    )
}
