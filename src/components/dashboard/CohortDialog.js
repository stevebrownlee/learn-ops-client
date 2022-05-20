import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import useKeyboardShortcut from "../ui/useKeyboardShortcut"
import Settings from "../Settings"
import useModal from "../ui/useModal"
import { fetchIt } from "../utils/Fetch"
import { CohortContext } from "../cohorts/CohortProvider"

export const CohortDialog = ({ toggleCohorts }) => {
    const { activeStudent, getStudent } = useContext(PeopleContext)
    const [message, setMessage] = useState("")
    const { getCohorts, cohorts } = useContext(CohortContext)
    const [cohortIds, setCohortIds] = useState([])
    // let { toggleDialog: toggleCohorts } = useModal("#dialog--cohorts")

    useEffect(
        () => {
            getCohorts()
        },
        []
    )

    useEffect(() => {
        if ("cohorts" in activeStudent) {
            const ids = activeStudent?.cohorts?.map(c => c.id) ?? []
            setCohortIds(ids)
        }
    }, [activeStudent])

    const addStudentToCohort = (e) => {
        // return fetchIt(`${Settings.apiHost}/students/${activeStudent.id}/status`, {
        //     method: "POST",
        //     body: JSON.stringify({ status: e.target.value })
        // }).then(reset)
    }

    return <dialog id="dialog--cohorts" className="dialog--cohorts">
        {
            cohorts.map(cohort => <div key={`cohort--${cohort.id}`}>
                <input type="checkbox"
                    onChange={(changeEvent) => {
                        // If true, POST to /cohorts/n with `person_id: n` in body
                        if (changeEvent.target.checked) {
                            fetchIt(`${Settings.apiHost}/cohorts/${cohort.id}/assign`, {
                                method: "POST",
                                body: JSON.stringify({
                                    person_id: activeStudent.id
                                })
                            })
                                .then((data) => {
                                    getStudent()
                                })
                        }
                        // If false, DELETE to /cohorts/n with `student_id: n` in body
                        else {
                            fetchIt(`${Settings.apiHost}/cohorts/${cohort.id}/assign`, {
                                method: "DELETE",
                                body: JSON.stringify({
                                    student_id: activeStudent.id
                                })
                            })
                                .then((data) => {
                                    getStudent()
                                })
                        }


                    }}
                    checked={cohortIds.includes(cohort.id) ? true : false} value={cohort.id} /> {cohort.name}
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
