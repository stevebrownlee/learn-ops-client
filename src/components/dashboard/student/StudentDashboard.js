import React, { useContext, useEffect, useState } from "react"
import { Flex, Text, Button, TextField, TextFieldInput } from '@radix-ui/themes'
import { useHistory } from "react-router-dom"

import simpleAuth from "../../auth/simpleAuth"
import Settings from "../../Settings"
import { fetchIt } from "../../utils/Fetch"
import { GithubIcon } from "../../../svgs/GithubIcon.js"
import { CohortInfo } from "./CohortInfo.js"
import { StudentInfo } from "./StudentInfo.js"
import { SettingsContext } from "../../LearnOps.js"
import "../Dashboard.css"

export const StudentDashboard = () => {
    const { mimic } = useContext(SettingsContext)
    const { getCurrentUser, getProfile } = simpleAuth()
    const [user, setUser] = useState({})
    // eslint-disable-next-line
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")

    const history = useHistory()

    useEffect(() => {
        getProfile(null, null, null, mimic).then(() => {
            setUser(getCurrentUser())
        })
    }, [])

    const saveName = () => {
        // Perform a PUT request with the fetchIt function to the /profile route
        fetchIt(`${Settings.apiHost}/profile/change`, {
            method: "PUT",
            body: JSON.stringify({ firstName, lastName })
        }).then(() => {
            getProfile(null, null, null, mimic).then(() => {
                setUser(getCurrentUser())
            })
        })
    }

    const checkGithubInfo = () => {
        if (!user.profile) {
            return <article className="fullCenter">Loading...</article>
        }
        if (user.profile?.github_org_status !== "active") {
            return <article className="fullCenter">
                <h2>You need to accept the invitation to join your cohort's GitHub organization</h2>
                <div>Click the button below to visit Github. Accept the invitation, and then come back to this tab and refresh.</div>
                <Button style={{ marginTop: "2rem" }}>
                    <a style={{ color: "white", textDecoration: "none" }} href={user.profile?.current_cohort?.github_org} target="_blank">Accept Now</a>
                </Button>
            </article>
        }

        const name = user.profile?.name?.replace(/\s/g, '');
        if (name.length === 0) {
            return <article className="fullCenter">
                <h2>Missing your first and last name</h2>
                <div>It looks like you did not enter your name in your Github profile. Please provide your name below.</div>
                <Flex direction="row" gap="3" mt="4">
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold"> First Name </Text>
                        <TextFieldInput size="2" value={firstName} onChange={e => setFirstName(e.target.value)}></TextFieldInput>
                    </label>
                    <label>
                        <Text as="div" size="2" mb="1" weight="bold"> Last Name </Text>
                        <TextFieldInput size="2" value={lastName} onChange={e => setLastName(e.target.value)}></TextFieldInput>
                    </label>
                </Flex>
                <Button mt="2" onClick={saveName}> Save </Button>
            </article>
        }

        return <article className="dashboard--overview">
            <CohortInfo profile={user.profile} />
            <StudentInfo profile={user.profile} />
        </article>
    }

    return <main>
        {checkGithubInfo()}
    </main>
}
