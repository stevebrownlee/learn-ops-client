import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"

export const TagDialog = ({ toggleTags }) => {
    const {
        activeStudent, getCohortStudents, tags, tagStudent,
        updateStudentCurrentAssessment, getAllTags
    } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)

    useEffect(() => {
        getAllTags()
    }, [])

    return <dialog id="dialog--tags" className="dialog--tags">
        <section className="statutsButtons">
            {
                tags.map(tag => {
                    return <button key={`tag--${tag.id}`}
                        onClick={() => {
                            tagStudent(activeStudent.id, tag.id)
                                .then(() => {
                                    getCohortStudents(activeCohort.id)
                                    toggleTags()
                                })
                        }}>{tag.name}</button>
                })
            }
        </section>

        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={() => {
                toggleTags()
            }}>[ close ]</button>
    </dialog>
}
