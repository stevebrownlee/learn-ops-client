import React, { useContext } from "react"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import { StudentTabList } from "./StudentTabList.js"
import "./Student.css"

export const StudentOverview = ({ toggleCohorts }) => {
    const { activeStudent } = useContext(PeopleContext)

    return (
        "id" in activeStudent
            ? <div className="card student">
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
                                    onClick={toggleCohorts}>
                                    {activeStudent.cohorts.map(c => c.name).join(", ")}
                                </button>
                            </div>
                        </div>

                        <CoreSkillSliders />
                        <StudentTabList />
                    </div>
                </div>
            </div>
            : <div></div>
    )
}
