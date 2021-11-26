import React, { useContext, useEffect, useState } from "react"

export const StudentResults = ({ students }) => {
    return (
        <article>
            {
                students.map(student => {
                    return <div key={`student--${student.id}`} className="student">
                        { student.name }
                    </div>
                })
            }
        </article >
    )
}
