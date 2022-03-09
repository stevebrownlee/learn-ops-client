import React from "react"

export const StudentSearchResults = ({ students, selectStudent }) => {
    return (
        <article className={`search__results ${students?.length ? "" : "hidden"}`}>
            {
                students?.map(student => {
                    return <div key={`student--${student.id}`} className="student--results"
                        onClick={() => {
                            selectStudent(student)
                        }}
                    >
                        { student.name }
                    </div>
                })
            }
        </article >
    )
}
