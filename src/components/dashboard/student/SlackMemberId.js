import React, { useEffect, useState } from "react"
import { Button, TextField } from '@radix-ui/themes'
import { FrameIcon } from '@radix-ui/react-icons'
import simpleAuth from "../../auth/simpleAuth"
import Settings from "../../Settings"
import { fetchIt } from "../../utils/Fetch"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min.js"
import { Loading } from "../../Loading.js"
import MemberId from "./images/get-slack-member-id.gif"
import "../Dashboard.css"

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
                        Watch the animation to the left to see how to copy your Slack member ID.

                        <div style={{ marginTop: "1rem" }}>
                            <TextField.Root>
                                <TextField.Slot>
                                    <FrameIcon height="16" width="16" />
                                </TextField.Slot>
                                <TextField.Input className="slack__input"
                                    value={slackId}
                                    onChange={(e) => setId(e.target.value ?? "")}
                                    placeholder="Enter Member ID…" />
                            </TextField.Root>

                            <Button style={{ marginTop: "1rem" }} onClick={updateSlackId}>Save</Button>
                        </div>
                    </div>
                </>
                : <Loading />
        }

    </article>
}