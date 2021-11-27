import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "./PeopleProvider"

export const StudentResults = ({ students, setTerms }) => {
    const { getStudent } = useContext(PeopleContext)

    return (
        <article className={`search__results ${students.length ? "" : "hidden"}`}>
            {
                students.map(student => {
                    return <div key={`student--${student.id}`} className="student--results"
                        onClick={() => {
                            console.log("Get student")
                            getStudent(student.id)
                            setTerms("")
                        }}
                    >
                        { student.name }
                    </div>
                })
            }
        </article >
    )
}
