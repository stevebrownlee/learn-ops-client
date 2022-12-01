import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import useSimpleAuth from "../auth/useSimpleAuth"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import "./Dashboard.css"

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


    return <article className="dashboard--student">
        <h1>Welcome {user.profile?.name}</h1>
        <div className="text--mini">This is your student dashboard where you can see all information about your cohort dates, notes from instructors, and general information about presentations, assessments, and shared projects.</div>



        <ul className="tabs" role="tablist">
            <li>
                <input type="radio" name="tabs" id="tab1" defaultChecked />
                <label htmlFor="tab1" role="tab" aria-selected="true" aria-controls="panel1" tabIndex="0">Feedback</label>
                <article id="tab-content1" className="tab-content"
                    style={tabStyle}
                    role="tabpanel" aria-labelledby="description" aria-hidden="false">

                    <h2>Notes from instructors</h2>
                    <div className="feedback">
                        {
                            user.profile?.feedback.length
                                ? user.profile?.feedback.map(f => {
                                    return <div className="feedback" key={`feedback--${f.id}`}>
                                        <div>{f.notes}</div>
                                        <div className="feedback__author">By {f.author} on {new Date(f.session_date).toLocaleDateString()}</div>
                                    </div>
                                })
                                : "None yet"
                        }
                    </div>

                </article>
            </li>

            <li>
                <input type="radio" name="tabs" id="tab2" />
                <label htmlFor="tab2" role="tab" aria-selected="true" aria-controls="panel2" tabIndex="0">General Info</label>
                <article style={tabStyle} id="tab-content2" className="tab-content" role="tabpanel" aria-labelledby="description" aria-hidden="false">

                    <h2>General Info</h2>
                    <div className="table table--smallPrompt">
                        <div className="cell" >Cohort</div>
                        <div className="cell cell--centered">
                            {
                                user.profile?.cohorts.length
                                    ? user.profile?.cohorts.map(cohort => {
                                        return <div key={`cohort--${cohort.id}`}>{cohort.name} {" "}
                                            <span className="text--mini">[{new Date(cohort.start_date).toLocaleDateString()} - {new Date(cohort.end_date).toLocaleDateString()}]</span>
                                        </div>
                                    })
                                    : "Unassigned"
                            }
                        </div>
                        <div className="cell" >Github Id</div>
                        <div className="cell cell--centered">{user.profile?.github}</div>
                        <div className="cell" >Slack Id</div>
                        <div className="cell cell--centered">{user.profile?.slack_handle} <button
                            onClick={() => history.push("/slackUpdate")}
                            className="fakeLink">Update</button></div>
                    </div>

                </article>
            </li>


            <li>
                <input type="radio" name="tabs" id="tab3" />
                <label htmlFor="tab3" role="tab" aria-selected="false" aria-controls="panel3" tabIndex="0">Personality</label>
                <article style={tabStyle} id="tab-content3" className="tab-content" role="tabpanel" aria-labelledby="specification" aria-hidden="true">

                    <h2>Personality Info</h2>
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
                </article>
            </li>
        </ul>
    </article>
}
