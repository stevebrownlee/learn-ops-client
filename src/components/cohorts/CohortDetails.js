import React, { useContext, useEffect, useState } from "react"
import { Badge, Button, Dialog, TextArea, Text, Flex, Switch } from '@radix-ui/themes'
import { TextField } from '@radix-ui/themes'

import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { CohortContext } from "./CohortProvider.js"
import { Toast, configureToasts } from "toaster-js"
import { CourseContext } from "../course/CourseProvider.js"
import { useHistory } from "react-router-dom"

import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"
import { CohortStudentAddDialog } from "./CohortStudentAddDialog.js"
import { CohortInvitationLink } from "./CohortInvitationLink.js"

export const CohortDetails = () => {
    const initialState = {
        attendance_sheet_url: "",
        github_classroom_url: "",
        student_organization_url: "",
        client_course_url: "",
        server_course_url: "",
        zoom_url: ""
    }
    const [info, setInfo] = useState(initialState)

    const {
        activeCohort, activeCohortDetails, getCohort,
        getCohortInfo, saveCohortInfo, updateCohortInfo,
        updateCohort
    } = useContext(CohortContext)
    const { migrateCohortToServerSide, capstoneSeason, setCapstoneSeason } = useContext(CourseContext)

    const history = useHistory()

    useEffect(() => {
        if (activeCohortDetails.info) {
            getCohortInfo(activeCohortDetails.info).then(setInfo).catch(err => setInfo(initialState))
        }
        else {
            setInfo(initialState)
        }
    }, [activeCohortDetails])

    const saveURLs = (e) => {
        if (activeCohortDetails.info) {
            updateCohortInfo(activeCohortDetails.info, info).then(messageUser)
        }
        else {
            saveCohortInfo({ ...info, cohort: activeCohortDetails.id }).then(messageUser)
        }
    }

    const messageUser = () => {
        hideOverlay()
        new Toast("Cohort info updated", Toast.TYPE_INFO, Toast.TIME_SHORT)
    }

    const hideOverlay = () => {
        document.querySelector('.overlay--cohort').style.display = "none"
    }

    const updateState = (event) => {
        const copy = { ...info }

        const newValue = {
            "string": event.target.value,
            "boolean": event.target.checked ? true : false,
            "number": parseInt(event.target.value)
        }[event.target.attributes.controltype.value]

        copy[event.target.id] = newValue
        setInfo(copy)
    }

    const migrate = () => {
        if (window.confirm("Verify that you want to migrate this cohort to server side mode. All students will be assigned to the first project of the server side course.")) {
            migrateCohortToServerSide(activeCohortDetails.id)
                .then(() => history.push("/"))
                .catch(reason => new Toast(reason, Toast.TYPE_ERROR, Toast.TIME_NORMAL))
        }
    }

    const toggleActive = (checked) => {
        const cohortObject = {
            id: activeCohortDetails.id,
            active: checked
        }
        return fetchIt(`${Settings.apiHost}/cohorts/${activeCohortDetails.id}/active`,
            {
                method: "PUT",
                body: JSON.stringify(cohortObject)
            })
            .then(() => {
                getCohort(activeCohortDetails.id)
                new Toast("Cohort updated", Toast.TYPE_INFO, Toast.TIME_SHORT)
            })
    }

    const toggleCapstoneSeason = (checked) => {
        const localStorageSeasons = localStorage.getItem("capstoneSeason")
        const cohortsInCapstoneSeason = localStorageSeasons
            ? new Set([...JSON.parse(localStorageSeasons)])
            : new Set()

        if (checked) {
            cohortsInCapstoneSeason.add(activeCohortDetails.id)
        }
        else {
            cohortsInCapstoneSeason.delete(activeCohortDetails.id)
        }

        const capstoneSeasonCohorts = Array.from(cohortsInCapstoneSeason)
        setCapstoneSeason(capstoneSeasonCohorts)
        localStorage.setItem("capstoneSeason", JSON.stringify(capstoneSeasonCohorts))

    }

    const showMigrate = (courses) => {
        const isClientSide = courses?.find(course => course.index === 0 && course.active)
        if (isClientSide) {
            return <button onClick={migrate} className="fakeLink">Migrate to server-side</button>
        }

        return ""
    }

    const urlFieldLabelStyle = { flex: "1 1 2rem", padding: "0.3rem 0 0 0" }
    const toggleFieldStyle = { flex: "3 1 0", padding: "0.3rem 0 0 0" }

    return (
        <div className="overlay--cohort">
            <div className="card" style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem 0 0 0"
            }}>
                <span onClick={hideOverlay} className="close hairline"></span>
            </div>
            <div className="card">
                <div className="card-body" style={{ paddingTop: "0" }}>
                    <header className="cohort__header cohort__header--details">
                        <h1 className="card-title cohort__info">{activeCohortDetails.name}</h1>
                    </header>

                    <div className="cohort__details">
                        <div style={{ flex: "4" }}>
                            <div style={{ margin: "1rem 0", display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <div className="form-group--row">
                                    <label style={urlFieldLabelStyle} htmlFor="start_date">Starts: </label>
                                    <input onChange={updateState}
                                        value={activeCohortDetails.start_date}
                                        type="date" controltype="string"
                                        id="start_date" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <div className="form-group--row">
                                    <label style={urlFieldLabelStyle} htmlFor="end_date">Ends: </label>
                                    <input onChange={updateState}
                                        value={activeCohortDetails.end_date}
                                        type="date" controltype="string"
                                        id="end_date" className="form-control form-control--row form-control--small"
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
                                <div style={{ display: "flex" }}>
                                    <label style={urlFieldLabelStyle}>Active:</label>
                                    <Switch variant="surface" radius="full" style={toggleFieldStyle} onCheckedChange={toggleActive} color="crimson" checked={activeCohortDetails.active} />
                                </div>
                                <div style={{ display: "flex" }}>
                                    <label style={urlFieldLabelStyle}>Capstone:</label>
                                    <Switch variant="surface" radius="full" style={toggleFieldStyle} onCheckedChange={toggleCapstoneSeason} color="lime" checked={capstoneSeason.includes(activeCohortDetails.id)} />
                                </div>
                            </div>

                            <CohortInvitationLink activeCohortDetails={activeCohortDetails} />
                        </div>

                        <div style={{ flex: "6", padding: "0 4rem 0 0" }}>
                            <div className="form-group form-group--row">
                                <label style={urlFieldLabelStyle} htmlFor="attendance_sheet_url">Attendance Sheet URL:</label>
                                <input onChange={updateState}
                                    value={info.attendance_sheet_url ?? ""}
                                    type="url" controltype="string"
                                    id="attendance_sheet_url" className="form-control form-control--row form-control--small"
                                />
                            </div>

                            <div className="form-group form-group--row">
                                <label style={urlFieldLabelStyle} htmlFor="student_organization_url">Github Organization URL: </label>
                                <input onChange={updateState}
                                    value={info.student_organization_url ?? ""}
                                    type="url" controltype="string"
                                    id="student_organization_url" className="form-control form-control--row form-control--small"
                                />
                            </div>

                            <div className="form-group form-group--row">
                                <label style={urlFieldLabelStyle} htmlFor="client_course_url">Client Side Course URL: </label>
                                <input onChange={updateState}
                                    value={info.client_course_url ?? ""}
                                    type="url" controltype="string"
                                    id="client_course_url" className="form-control form-control--row form-control--small"
                                />
                            </div>

                            <div className="form-group form-group--row">
                                <label style={urlFieldLabelStyle} htmlFor="server_course_url">Server Side Course URL: </label>
                                <input onChange={updateState}
                                    value={info.server_course_url ?? ""}
                                    type="url" controltype="string"
                                    id="server_course_url" className="form-control form-control--row form-control--small"
                                />
                            </div>

                            <Button color="blue" onClick={saveURLs}>Save URLs</Button>
                        </div>

                        <div style={{ flex: "3" }}>
                            <h3>Courses</h3>
                            <div className="cohort__courses">
                                {
                                    activeCohortDetails?.courses?.map(course => {
                                        return <div
                                            key={`course--${course.id}`}
                                            className={`course--badge cohort__coach ${course.active ? "active" : ""}`}>
                                            {course.course.name}
                                        </div>
                                    })
                                }
                            </div>
                            <div>{showMigrate(activeCohortDetails?.courses)}</div>

                            <h3>Coaches</h3>
                            <div className="cohort__coaches">
                                {
                                    activeCohortDetails.coaches?.map(coach => <div key={`coach--${coach.name}`} className="instructor--badge cohort__coach">{coach.name}</div>)
                                }
                            </div>

                            <h3>Students</h3>
                            <div className="cohort__coaches">
                                {activeCohortDetails.students} active students
                            </div>

                            <CohortStudentAddDialog />
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}
