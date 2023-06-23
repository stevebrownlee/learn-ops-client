import React, { useContext, useEffect, useState } from "react"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"
import { CohortContext } from "./CohortProvider.js"
import { Toast, configureToasts } from "toaster-js"
import { CourseContext } from "../course/CourseProvider.js"
import { useHistory } from "react-router-dom"
import Settings from "../Settings.js"
import { CopyIcon } from "../../svgs/CopyIcon.js"

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
        getCohortInfo, saveCohortInfo, updateCohortInfo
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

    const showMigrate = (courses) => {
        const isClientSide = courses?.find(course => course.index === 0 && course.active)
        if (isClientSide) {
            return <button onClick={migrate} className="fakeLink">Migrate to server-side</button>
        }

        return ""
    }



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

                    <div className="card-text">
                        <div className="cohort__details">

                            <div className="cohort__detail cohort__urls cohort__detail--large">
                                <h3>Resource URLs</h3>

                                <div className="form-group form-group--row">
                                    <label className="label--smallrow" htmlFor="attendance_sheet_url">Attendance Sheet</label>
                                    <input onChange={updateState}
                                        value={info.attendance_sheet_url ?? ""}
                                        type="url" controltype="string"
                                        id="attendance_sheet_url" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <div className="form-group form-group--row">
                                    <label className="label--smallrow" htmlFor="github_classroom_url">Github Classroom</label>
                                    <input onChange={updateState}
                                        value={info.github_classroom_url ?? ""}
                                        type="url" controltype="string"
                                        id="github_classroom_url" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <div className="form-group form-group--row">
                                    <label className="label--smallrow" htmlFor="student_organization_url">Github Organization</label>
                                    <input onChange={updateState}
                                        value={info.student_organization_url ?? ""}
                                        type="url" controltype="string"
                                        id="student_organization_url" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <div className="form-group form-group--row">
                                    <label className="label--smallrow" htmlFor="client_course_url">Client Side Coure</label>
                                    <input onChange={updateState}
                                        value={info.client_course_url ?? ""}
                                        type="url" controltype="string"
                                        id="client_course_url" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <div className="form-group form-group--row">
                                    <label className="label--smallrow" htmlFor="server_course_url">Server Side Course</label>
                                    <input onChange={updateState}
                                        value={info.server_course_url ?? ""}
                                        type="url" controltype="string"
                                        id="server_course_url" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <div className="form-group form-group--row">
                                    <label className="label--smallrow" htmlFor="zoom_url">Zoom Session</label>
                                    <input onChange={updateState}
                                        value={info.zoom_url ?? ""}
                                        type="url" controltype="string"
                                        id="zoom_url" className="form-control form-control--row form-control--small"
                                    />
                                </div>

                                <button onClick={saveURLs}>Save URLs</button>
                            </div>

                            <div className="cohort__detail cohort__detail--medium">
                                <h3>Invitation Link</h3>

                                <div style={{ margin: "1rem 0" }}>
                                    Send this link to incoming students to assign them to your cohort
                                </div>

                                <span className="fakeLink readonly">
                                    {`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`}
                                    <CopyIcon text={`${Settings.apiHost}/auth/github/url?cohort=${activeCohortDetails.id}&v=1`} />
                                </span>

                                <h3 style={{ margin: "3rem 0 0 0" }}>Dates</h3>

                                <div style={{ margin: "1rem 0" }}>
                                    <div className="form-group form-group--row">
                                        <label className="label--smallrow" htmlFor="start_date">Starts</label>
                                        <input onChange={updateState}
                                            value={activeCohortDetails.start_date}
                                            type="date" controltype="string"
                                            id="start_date" className="form-control form-control--row form-control--small"
                                        />
                                    </div>

                                    <div className="form-group form-group--row">
                                        <label className="label--smallrow" htmlFor="end_date">Ends</label>
                                        <input onChange={updateState}
                                            value={activeCohortDetails.end_date}
                                            type="date" controltype="string"
                                            id="end_date" className="form-control form-control--row form-control--small"
                                        />
                                    </div>
                                </div>

                                <h2>Capstone Season</h2>
                                <div className="capstoneToggle">
                                    <input defaultChecked={capstoneSeason}
                                        onChange={(evt) => {
                                        evt.target.ariaChecked = evt.target.checked
                                        setCapstoneSeason(evt.target.checked)
                                        localStorage.setItem("capstoneSeason", evt.target.checked)
                                    }} id="toggle" className="toggle" type="checkbox" role="switch" name="toggle" value="on" />
                                    <label htmlFor="toggle" className="slot">
                                        <span className="slot__label">OFF</span>
                                        <span className="slot__label">ON</span>
                                    </label>
                                    <div className="curtain"></div>
                                </div>
                            </div>

                            <div className="cohort__detail">
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

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
