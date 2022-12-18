import React, { useContext, useEffect, useState } from "react"
import { CohortContext } from "./CohortProvider"
import { PeopleContext } from "../people/PeopleProvider"
import { EditIcon } from "../../svgs/EditIcon"
import { PeopleIcon } from "../../svgs/PeopleIcon"
import { HumanDate } from "../utils/HumanDate"
import { CourseContext } from "../course/CourseProvider"
import "./Cohort.css"
import "./CohortList.css"


export const Cohort = ({ cohort, getLastFourCohorts }) => {
    const [editSlack, setSlackEdit] = useState(0)
    const {
        getCohorts, cohorts, leaveCohort,
        joinCohort, updateCohort, activateCohort
    } = useContext(CohortContext)
    const { migrateCohortToServerSide } = useContext(CourseContext)

    const slackEditInput = (cohort) => {
        return <input type="text" autoFocus style={{ fontSize: "smaller" }} onKeyUp={e => {
            if (e.key === "Enter") {
                const updatedCohort = { ...cohort, slack_channel: e.target.value }
                updateCohort(updatedCohort).then(() => {
                    getLastFourCohorts()
                    setSlackEdit(0)
                })
            }
            else if (e.key === "Escape") {
                setSlackEdit(0)
            }
        }} defaultValue={cohort.slack_channel} />
    }

    const slackDisplay = (cohort) => {
        return <>
            {cohort.slack_channel}
            <EditIcon clickFunction={() => setSlackEdit(cohort.id)} />
        </>
    }

    const leave = (cohort) => {
        leaveCohort(cohort.id)
            .then(getLastFourCohorts)
            .then(() => {
                localStorage.removeItem("activeCohort")
                activateCohort({})
            })
            .catch(window.alert)
    }

    const join = (cohort) => {
        joinCohort(cohort.id)
            .then(getLastFourCohorts)
            .then(() => {
                localStorage.setItem("activeCohort", cohort.id)
                activateCohort(cohort)
            })
            .catch(window.alert)
    }

    const migrate = () => {
        if (window.confirm("Verify that you want to migrate this cohort to server side mode. All students will be assigned to the first project of the server side course.")) {
            migrateCohortToServerSide(cohort)
                .then(getLastFourCohorts)
                .catch(window.alert)
          }
    }

    const showMigrate = (courses) => {
        const isClientSide = courses.find(course => course.course.name.includes("JavaScript") && course.active)
        if (isClientSide) {
            return <button onClick={() => migrate()} className="fakeLink">Migrate</button>
        }

        return ""
    }


    return <section key={`cohort--${cohort.id}`} className="cohort">
        <h3 className="cohort__header">{cohort.name}</h3>
        <div className="cohort__join">
            {
                cohort.is_instructor === 1
                    ? <button onClick={() => leave(cohort)} className="fakeLink">Leave</button>
                    : <button onClick={() => join(cohort)} className="fakeLink">Join</button>
            }

        </div>
        <div className="cohort__dates">
            <HumanDate date={cohort.start_date} weekday={false} />
            <div style={{ width: "30%" }}><hr /></div>
            <HumanDate date={cohort.end_date} weekday={false} />
        </div>

        <h4>Coaches</h4>
        <div className="cohort__coaches">
            {
                cohort.coaches.map(coach => <div key={`coach--${coach.name}`} className="instructor--badge cohort__coach">{coach.name}</div>)
            }
        </div>

        <h4>Courses</h4>
        <div className="cohort__coaches">
            {
                cohort.courses.map(course => {
                    return <div
                        key={`course--${course.id}`}
                        className={`course--badge cohort__coach ${course.active ? "active" : ""}`}>
                        {course.course.name}
                    </div>
                })
            }
            { showMigrate(cohort.courses) }
        </div>

        <footer className="cohort__footer">
            <div>
                <PeopleIcon /> {cohort.students}
            </div>
            <div>
                {
                    editSlack === cohort.id
                        ? slackEditInput(cohort)
                        : slackDisplay(cohort)
                }
            </div>
        </footer>
    </section>
}
