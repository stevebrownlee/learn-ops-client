import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../../auth/useSimpleAuth"
import Settings from "../../Settings"
import { fetchIt } from "../../utils/Fetch"
import "../Dashboard.css"
import { GithubIcon } from "../../../svgs/GithubIcon.js"

export const StudentDashboard = () => {
    const { getCurrentUser, getProfile } = useSimpleAuth()
    const [user, setUser] = useState({})
    // eslint-disable-next-line
    const [briggs, setBriggs] = useState("")

    const history = useHistory()

    useEffect(() => {
        getProfile().then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    const updatePersonalityInfo = (inputValue, personalityProp, queryParamValue) => {
        if (inputValue !== user.profile?.personality?.[personalityProp]) {
            fetchIt(`${Settings.apiHost}/personality/0?testresult=${queryParamValue}`,
                {
                    method: "PUT",
                    body: JSON.stringify({
                        value: inputValue
                    })
                })
                .then(() => {
                    getProfile().then(() => {
                        setUser(getCurrentUser())
                    })
                })
        }
    }

    const createPersonalityInput = (propName, queryParamValue, isNumeric = true) => {
        return <input
            type="text"
            className={isNumeric ? "bfi__input" : "briggs__input"}
            onBlur={(evt) => {
                let currentValue = ""

                if (isNumeric) {
                    currentValue = parseInt(evt.target.value)
                }
                else {
                    currentValue = evt.target.value.toUpperCase()
                }

                updatePersonalityInfo(currentValue, propName, queryParamValue)
            }}
            defaultValue={user.profile?.personality?.[propName]} />
    }

    const tabStyle = {
        minHeight: "25rem"
    }

    const cohortDates = (cohort) => {
        const startDate = new Date(user.profile?.current_cohort?.start).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        )
        const endDate = new Date(user.profile?.current_cohort?.end).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        )

        const dateDiff1 = Math.floor((new Date() - new Date(user.profile?.current_cohort?.start)) / (1000 * 60 * 60 * 24))
        const dateDiff2 = Math.floor((new Date(user.profile?.current_cohort?.end) - new Date()) / (1000 * 60 * 60 * 24))

        if (dateDiff2 < 1) {
            return <div className="text--xmini">
                <div>{startDate} - {endDate}</div>
                <div>You have graduated!</div>
            </div>
        }
        else {
            return <div className="text--xmini">
                <div><span className="prompt">Start date:</span> {startDate}</div>
                <div>End date: {endDate}</div>
                <div>{dateDiff1} days gone and {dateDiff2} days left</div>
            </div>

        }
    }

    const personalityInfo = () => {
        return <><h2>Personality Info</h2>
            <div className="table table--smallPrompt">
                <div className="cell">
                    <a href="https://www.16personalities.com/free-personality-test" target="_blank">
                        Myers-Briggs
                    </a>
                </div>
                <div className="cell cell--centered">
                    {createPersonalityInput("briggs_myers_type", "briggs", false)}
                </div>
                <div className="cell">
                    <a href="https://www.outofservice.com/bigfive/" target="_blank">Big Five</a>
                </div>
                <div className="cell cell--centered">
                    <div className="bfiRow">
                        <div className="bfiRow__prompt">Openness to experiences:</div>
                        <div className="bfiRow__input">{createPersonalityInput("bfi_openness", "bfio")}</div>
                    </div>
                    <div className="bfiRow">
                        <div className="bfiRow__prompt">Conscientiousness:</div>
                        <div className="bfiRow__input">{createPersonalityInput("bfi_conscientiousness", "bfic")}</div>
                    </div>
                    <div className="bfiRow">
                        <div className="bfiRow__prompt">Extraversion:</div>
                        <div className="bfiRow__input">{createPersonalityInput("bfi_extraversion", "bfie")}</div>
                    </div>
                    <div className="bfiRow">
                        <div className="bfiRow__prompt">Agreeableness:</div>
                        <div className="bfiRow__input">{createPersonalityInput("bfi_agreeableness", "bfia")}</div>
                    </div>
                    <div className="bfiRow">
                        <div className="bfiRow__prompt">Neuroticism:</div>
                        <div className="bfiRow__input">{createPersonalityInput("bfi_neuroticism", "bfin")}</div>
                    </div>
                </div>
            </div>
        </>
    }

    const createAssessmentRow = (assmt) => {
        let className = ""

        switch (assmt.status) {
            case "In Progress":
                className = "assessment--inProgress"
                break
            case "Ready for Review":
                className = "assessment--readyForReview"
                break
            case "Reviewed and Complete":
                className = "assessment--reviewedSuccess"
                break
            case "Reviewed and Incomplete":
                className = "assessment--reviewedFail"
                break
        }

        return <div key={`assmt--${assmt.id}`} className="bookassessments">
            <div className="bookassessment">
                <div className="bookassessment__name">{assmt.name}</div>
                <div className={`bookassessment__status ${className}`}>{assmt.status}</div>
            </div>
        </div>

    }

    const createCapstoneRow = (capstone) => {
        let statusClass = ""


        return <div key={`capstone--${capstone.id}`} className="capstoneassessments">
            <div className="capstoneassessment">
                <div className="capstoneassessment__course">{capstone.course}</div>
                <div className="capstoneassessment__statuses">
                    {
                        capstone.statuses.map(status => {
                            switch (status.status__status) {
                                case "Approved":
                                    statusClass = "assessment--inProgress"
                                    break
                                case "In Review":
                                    statusClass = "assessment--readyForReview"
                                    break
                                case "MVP":
                                    statusClass = "assessment--reviewedSuccess"
                                    break
                                case "Requires Changes":
                                    statusClass = "assessment--reviewedFail"
                                    break
                            }

                            return <div key={`status--${status.status__status}`} className={`capstoneassessment__status ${statusClass}`}>
                                {status.status__status} on {status.date}
                            </div>
                        })
                    }
                </div>

            </div>
        </div>

    }


    return <main>
        <header className="studentDashboard__header">
            <h1>Welcome {user.profile?.name}</h1>
        </header>
        <article className="dashboard--overview">
            <section className="info">
                <h2 className="info__header" style={{ marginBottom: 0 }}>{user.profile?.current_cohort?.name} Info</h2>
                <div className="info__body">
                    <div>
                        <h3 style={{ marginTop: 0, marginBlockStart: 0 }}>Dates</h3>
                        {cohortDates(user.profile?.current_cohort)}
                    </div>
                    <div>
                        <h3>Repositories</h3>
                        <div><a href={user.profile?.current_cohort?.client_course} target="_blank">Client side coursework</a></div>
                        <div><a href={user.profile?.current_cohort?.server_course} target="_blank">Server side coursework</a></div>
                        <div>
                            <a href={`${user.profile?.current_cohort?.github_org}`} target="_blank">
                                {user.profile?.current_cohort?.name} Github Organization
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section className="info">
                <h2 className="info__header" style={{ marginBottom: 0 }}>Your Info</h2>
                <div className="info__body">
                    <div>
                        <h3 style={{ marginTop: 0, marginBlockStart: 0 }}>Repositories</h3>
                        <div><a href={`https://www.github.com/${user.profile?.github}`} target="_blank">Personal Repositories</a></div>
                    </div>
                    <div>
                        <h3>Slack ID</h3>
                        <div>
                            <div>{user.profile?.slack_handle} <button
                                onClick={() => history.push("/slackUpdate")}
                                className="fakeLink">Update</button></div>
                        </div>
                    </div>
                    <div className="studentassessments text--mini">
                        <div className="assessmentlist">
                            <h3>Book Assessments</h3>
                            {user.profile?.assessment_overview.map(createAssessmentRow)}
                        </div>
                        <div className="assessmentlist">
                            <h3>Capstones</h3>
                            {user.profile?.capstones.map(createCapstoneRow)}
                            <div>
                                <button onClick={() => history.push("/proposal/client")}>Submit my proposal</button>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </article>
    </main>
}
