import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import { CohortContext } from "../cohorts/CohortProvider"

export const CohortDialog = ({ toggleCohorts }) => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const { getCohorts, cohorts } = useContext(CohortContext)
    const [cohortIds, setCohortIds] = useState([])

    useEffect(
        () => {
            getCohorts()
        },
        []
    )

    useEffect(() => {
        if (activeStudent && "cohorts" in activeStudent) {
            const ids = activeStudent?.cohorts?.map(c => c.id) ?? []
            setCohortIds(ids)
        }
    }, [activeStudent])

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

    return <dialog id="dialog--cohorts" className="dialog--cohorts">
        {
            cohorts.map(cohort => <div key={`cohort--${cohort.id}`}>
                <input type="checkbox"
                    onChange={(changeEvent) => {
                        const action = changeEvent.target.checked ? assignStudent : removeStudent
                        action(cohort).then(getStudent)
                    }}
                    checked={cohortIds.includes(cohort.id)} value={cohort.id} /> {cohort.name}
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
