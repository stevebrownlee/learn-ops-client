import React, { useContext, useEffect } from "react"
import { Button, Text, Flex } from '@radix-ui/themes'

import { useHistory } from "react-router-dom"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import { RecordContext } from "../records/RecordProvider.js"
import { CourseContext } from "./CourseProvider"
import "./Objectives.css"

export const LearningObjectives = () => {
    const { objectives } = useContext(CourseContext)
    const { activeCohort } = useContext(CohortContext)
    const { updateRecord, createRecord } = useContext(RecordContext)
    const { activeStudent, learningRecords, getCohortStudents,
        getStudentLearningRecords, activateStudent,
        cohortStudents
    } = useContext(PeopleContext)

    useEffect(() => {
        if (activeStudent && "id" in activeStudent) {
            const student = cohortStudents.find(student => student.id === activeStudent.id)
            activateStudent(student)
        }
    }, [cohortStudents])

    return <section className="section--objectives">
        <div className="card-title">
            <h3>Learning Objectives Remaining</h3>
        </div>
        <div className="objectives">
            {
                objectives.map(objective => {
                    const studentRecord = learningRecords.find(rec => rec.objective === objective.id)
                    const achieved = studentRecord?.achieved ?? false

                    if (!achieved) {
                        return <Button key={`objective--${objective.id}`}
                            onClick={(e) => {
                                e.stopPropagation()

                                let action = null
                                if (studentRecord && !achieved) {
                                    action = updateRecord({ ...studentRecord, achieved: true })

                                }
                                else if (!studentRecord) {
                                    action = createRecord({
                                        weight: objective.id,
                                        student: activeStudent?.id,
                                        achieved: true,
                                        note: `Achieved on ${new Date().toLocaleDateString('en-US')}`
                                    })
                                }
                                action.then(() => getStudentLearningRecords(activeStudent?.id))
                                    .then(() => getCohortStudents(activeCohort))
                            }}
                            color="indigo" radius="large" size="1" style={{
                                padding: "0.75rem",
                                fontSize: "0.75rem",
                                margin: "0.2rem",
                            }}>
                            {objective.label}
                        </Button>
                    }
                })
            }
        </div>
    </section>
}
