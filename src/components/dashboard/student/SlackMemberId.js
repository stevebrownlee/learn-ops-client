import React, { useEffect, useState } from "react"
import simpleAuth from "../../auth/simpleAuth"
import Settings from "../../Settings"
import { fetchIt } from "../../utils/Fetch"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js"
import MemberId from "./images/get-slack-member-id.gif"
import "../Dashboard.css"
import { Loading } from "../../Loading.js"

export const SlackMemberId = () => {
    const { getCurrentUser, getProfile } = simpleAuth()
    const [user, setUser] = useState({})
    const [slackId, setId] = useState("")
    const history = useHistory()

    useEffect(() => {
        const syncUser = () => {
            getProfile().then(() => {
                setUser(getCurrentUser())
            })
        }

        syncUser()
    }, [])

    useEffect(() => {
        if (user && user.profile && user.profile.slack_handle !== "") {
            setId(user.profile.slack_handle)
        }
    }, [user])

    const updateSlackId = () => {
        fetchIt(`${Settings.apiHost}/students/${user.profile.id}`, {
            method: "PUT",
            body: JSON.stringify({ slack_handle: slackId })
        })
            .then(() => history.push("/"))
    }

    return <article className="view slack">
        {
            "profile" in user
                ? <>
                    <div>
                        <img src={MemberId} alt="Animation showing how to get Slack member ID" width="300px" />
                    </div>
                    <div>
                        Watch the animation to the left to see how to copy your Slack member ID. Once you follow those steps, paste the ID into the text box below and slick "Save".

                        <div>
                            <input type="text" className="slack__input"
                                id="memberId" value={slackId}
                                onChange={(e) => setId(e.target.value ?? "")}
                                placeholder="Paste your member ID here" />

                            <div>
                                <button onClick={updateSlackId} className="slack__save">Save</button>
                            </div>
                        </div>
                    </div>
                </>
                : <Loading />
        }

    </article>
}