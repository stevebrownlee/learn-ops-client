import React, { useContext, useEffect } from "react"
import { Button, Text, Flex } from '@radix-ui/themes'

import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { LearningObjectives } from "../course/LearningObjectives.js"
import { CoreSkillSliders } from "./CoreSkillSliders.js"
import { PeopleContext } from "./PeopleProvider.js"
import { CourseContext } from "../course/CourseProvider.js"
import { AssessmentRow } from "../dashboard/student/AssessmentRow.js"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { TransferStudentDialog } from "./TransferStudentDialog.js"
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

    const deleteStudent = () => {
        if (window.confirm("Are you sure you want to completely remove this student from the Learning Platform?")) {
            fetchIt(`${Settings.apiHost}/students/${activeStudent.id}`, {
                method: "DELETE"
            }).then(() => {
                document.querySelector('.overlay--student').style.display = "none"
                getCohortStudents(activeCohort)
            })
        }
    }

    const clearStudentData = () => {
        if (window.confirm("Are you sure you want erase all previous data about this student?")) {
            fetchIt(`${Settings.apiHost}/students/${activeStudent.id}?soft=true`, {
                method: "DELETE"
            }).then(() => {
                document.querySelector('.overlay--student').style.display = "none"
                getCohortStudents(activeCohort)
            })
        }
    }

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
                            <div> Cohort: {activeStudent?.current_cohort?.name} </div>
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

        <Flex as="div" style={{ position: "absolute", bottom: "1rem", left: "1rem" }}>
            <Text size="1">
                <p style={{ maxWidth: "15rem", height: "2.5rem" }}>Has the student taken a leave of absence but not assigned to another cohort?</p>
                <Button size="1" color="orange" onClick={clearStudentData}>Clear Student Data</Button>
            </Text>
            <Text size="1" ml="6">
                <p style={{ maxWidth: "15rem", height: "2.5rem" }}>Has the student completely withdrawn from the program?</p>
                <Button color="red" size="1" onClick={deleteStudent}>Delete Student Permanently</Button>
            </Text>
            <Text size="1" ml="6">
                <p style={{ maxWidth: "15rem", height: "2.5rem" }}>Is the student being transferred to another cohort immediately?</p>
                <TransferStudentDialog />
            </Text>
        </Flex>
    </div>
}
