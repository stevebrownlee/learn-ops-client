import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"
import { fetchIt } from "../utils/Fetch"
import Settings from "../Settings"

export const CohortDialog = ({ toggleCohorts, cohortIsOpen }) => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const [cohorts, setCohorts] = useState([])

    if ("id" in activeStudent && cohorts.length === 0) {
        fetchIt(`${Settings.apiHost}/cohorts?limit=6`).then(setCohorts)
    }

    const removeStudent = (cohort) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${cohort.id}/assign`, {
            method: "DELETE",
            body: JSON.stringify({
                student_id: activeStudent.id
            })
        })
    }

    const assignStudent = (cohort) => {
        return fetchIt(`${Settings.apiHost}/cohorts/${cohort.id}/assign`, {
            method: "POST",
            body: JSON.stringify({
                person_id: activeStudent.id
            })
        })
    }

    return <dialog id="dialog--cohorts" className="dialog--cohorts" open={cohortIsOpen}>
        {
            cohorts.map(cohort => <div key={`cohort--${cohort.id}`}>
                <input type="checkbox"
                    onChange={(changeEvent) => {
                        const action = changeEvent.target.checked ? assignStudent : removeStudent
                        action(cohort).then(getStudent)
                    }}
                    checked={activeStudent?.current_cohort?.id === cohort.id} value={cohort.id} /> {cohort.name}
            </div>)
        }
        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={toggleCohorts}>[ close ]</button>
    </dialog>
}
