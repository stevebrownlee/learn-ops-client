import React, { useContext, useEffect } from "react"
import { Button, Text, Flex } from '@radix-ui/themes'

import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { LearningObjectives } from "../course/LearningObjectives.js"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import { CourseContext } from "../course/CourseProvider.js"
import { AssessmentRow } from "../dashboard/student/AssessmentRow.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"
import "../people/Status.css"

export const StudentDetails = ({ toggleCohorts }) => {
    const { getCohortStudents, activeStudent } = useContext(PeopleContext)
    const { getStudentAssessments } = useContext(AssessmentContext)
    const { getLearningObjectives } = useContext(CourseContext)
    const { activeCohort, activateCohort } = useContext(CohortContext)

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
                        <div className="student__cohort" style={{ display: "flex", flexDirection: "column" }}>
                            <div>
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
        </div>

        <div className="card">
            <CoreSkillSliders />
        </div>

        <div className="card">
            <LearningObjectives />
        </div>

        <Flex as="div" mt="8" style={{
            position: "absolute",
            bottom: "1rem",
        }}>
            <Button ml="3" size="1" color="orange" onClick={() => {
                if (window.confirm("Are you sure you want erase all previous data about this student?")) {
                    fetchIt(`${Settings.apiHost}/students/${activeStudent.id}?soft=true`, {
                        method: "DELETE"
                    })
                        .then(() => {
                            document.querySelector('.overlay--student').style.display = "none"
                            getCohortStudents(activeCohort)
                        })
                }
            }}
            >
                Clear Student Data
            </Button>

            <Button ml="3" color="red" size="1"
                onClick={() => {
                    if (window.confirm("Are you sure you want to completely remove this student from the Learning Platform?")) {
                        fetchIt(`${Settings.apiHost}/students/${activeStudent.id}`, {
                            method: "DELETE"
                        })
                            .then(() => {
                                document.querySelector('.overlay--student').style.display = "none"
                                getCohortStudents(activeCohort)
                            })
                    }
                }}
            >
                Delete Student Permanently
            </Button>
        </Flex>
    </div>
}
