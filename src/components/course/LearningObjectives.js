import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import { RecordContext } from "../records/RecordProvider.js"
import { CourseContext } from "./CourseProvider"
import "./Objectives.css"

export const LearningObjectives = () => {
    const [chosenAssessment, chooseAssessment] = useState(0)
    const { objectives } = useContext(CourseContext)
    const { activeCohort } = useContext(CohortContext)
    const { updateRecord, createRecordEntry, createRecord } = useContext(RecordContext)
    const { activeStudent, learningRecords, getCohortStudents,
        getStudentLearningRecords, activateStudent,
        cohortStudents
     } = useContext(PeopleContext)

    const history = useHistory()

    useEffect(() => {
        if ("id" in activeStudent) {
            const student = cohortStudents.find(student => student.id === activeStudent.id)
            activateStudent(student)
        }
    }, [cohortStudents])

    return <div className="objectives">
        {
            objectives.map(objective => {
                const studentRecord = learningRecords.find(rec => rec.objective === objective.id)
                const achieved = studentRecord?.achieved ?? false

                return <button key={`objective--${objective.id}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        let action = null
                        if (studentRecord && !achieved) {
                            action = updateRecord({ ...studentRecord, achieved: true })

                        }
                        else if (!studentRecord) {
                            action = createRecord({
                                weight: objective.id,
                                student: activeStudent.id,
                                achieved: true,
                                note: `Achieved on ${new Date().toLocaleDateString('en-US')}`
                            })
                        }
                        action.then(() => getStudentLearningRecords(activeStudent.id))
                        .then(() => getCohortStudents(activeCohort.id))
                    }}
                    className={`${achieved ? "button-28--achieved" : "button-28"}`}
                    style={{ margin: "0.2rem 0.2rem"}}
                >
                    <span>{objective.label}</span>
                </button>
            })
        }
    </div>
}
