import React, { useEffect, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import "./Dashboard.css"
import MemberId from "./images/get-slack-member-id.gif"

export const SlackMemberId = () => {
    const { getCurrentUser, getProfile } = useSimpleAuth()
    const [user, setUser] = useState({})
    const [slackId, setId] = useState("")

    const syncUser = () => {
        getProfile().then(() => {
            setUser(getCurrentUser())
        })
    }

    useEffect(() => {
        syncUser()
    }, [])

    useEffect(() => {
       setId(user?.profile?.slack_handle)
    }, [user])

    const updateSlackId = () => {
        fetchIt(`${Settings.apiHost}/students/${user.profile.id}`, {
            method: "PUT",
            body: JSON.stringify({ slack_handle: slackId })
        })
            .then(syncUser)
    }

    return <article className="view  slack">
        <div>
            <img src={MemberId} alt="Animation showing how to get Slack member ID" width="300px" />
        </div>
        <div>
            Watch the animation to the left to see how to copy your Slack member ID. Once you follow those steps, paste the ID into the text box below and slick "Save".

            <div>
                <input type="text" className="slack__input"
                    id="memberId" value={slackId}
                    onChange={(e) => setId(e.target.value)}
                    placeholder="Paste your member ID here" />

                <div>
                    <button onClick={updateSlackId} className="slack__save">Save</button>
                </div>
            </div>
        </div>
    </article>
}