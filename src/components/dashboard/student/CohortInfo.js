import React, { useEffect, useState } from "react"
import { CohortEventList } from "../CohortEventList.js"
import { Card, Flex, Text, Heading } from '@radix-ui/themes'

export const CohortInfo = ({ profile }) => {

    const cohortDates = (cohort) => {
        const startDate = new Date(profile?.current_cohort?.start).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        )
        const endDate = new Date(profile?.current_cohort?.end).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }
        )

        const dateDiff1 = Math.floor((new Date() - new Date(profile?.current_cohort?.start)) / (1000 * 60 * 60 * 24))
        const dateDiff2 = Math.floor((new Date(profile?.current_cohort?.end) - new Date()) / (1000 * 60 * 60 * 24))

        return <Card style={{ margin: "0 0 1rem 0"}}>
            <Flex direction="column" gap="1">
                <Flex direction="column" justify="between" align="left">
                    <Text>Starts on {startDate}</Text>
                    <Text>Ends on {endDate}</Text>
                </Flex>
                <Text size="2">{dateDiff2 < 1 ? "You have graduated!" : `${dateDiff1} days gone and ${dateDiff2} days left`}</Text>
            </Flex>
        </Card>

    }

    return <section className="info">
        <h2 className="info__header" style={{ marginBottom: 0 }}>{profile?.current_cohort?.name} Info</h2>
        <div className="info__body info__body--cohort">
            {cohortDates(profile?.current_cohort)}
            <CohortEventList />
            <div>
                <h3>Repositories</h3>
                <div><a href={profile?.current_cohort?.client_course} target="_blank">Client side coursework</a></div>
                <div><a href={profile?.current_cohort?.server_course} target="_blank">Server side coursework</a></div>
                <div>
                    <a href={`${profile?.current_cohort?.github_org}`} target="_blank">
                        {profile?.current_cohort?.name} Github Organization
                    </a>
                </div>
            </div>
        </div>
    </section>
}
