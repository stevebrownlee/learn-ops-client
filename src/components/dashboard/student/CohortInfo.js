import React, { useEffect, useState } from "react"
import { CohortEventList } from "../CohortEventList.js"
import { Card, Flex, Text, Heading, Container, Grid, Box, Link } from '@radix-ui/themes'
import { CalendarIcon, GitHubLogoIcon, BookmarkIcon } from '@radix-ui/react-icons'

export const CohortInfo = ({ profile }) => {

    const cohortDates = (cohort) => {
        const startDate = new Date(profile?.current_cohort?.start).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const endDate = new Date(profile?.current_cohort?.end).toLocaleDateString("en-US", {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

        const dateDiff1 = Math.floor((new Date() - new Date(profile?.current_cohort?.start)) / (1000 * 60 * 60 * 24))
        const dateDiff2 = Math.floor((new Date(profile?.current_cohort?.end) - new Date()) / (1000 * 60 * 60 * 24))

        return (
            <Card style={{ flex: 1 }}>
                <Flex direction="column" gap="3">
                    <Flex align="center" gap="2">
                        <CalendarIcon width="20" height="20" />
                        <Text size="4" weight="bold">{profile?.current_cohort?.name} Timeline</Text>
                    </Flex>

                    <Flex direction="column" gap="2">
                        <Flex gap="2" align="baseline">
                            <Text size="1" weight="bold" style={{ width: '80px' }}>Start Date:</Text>
                            <Text size="1">{startDate}</Text>
                        </Flex>
                        <Flex gap="2" align="baseline">
                            <Text size="1" weight="bold" style={{ width: '80px' }}>End Date:</Text>
                            <Text size="1">{endDate}</Text>
                        </Flex>
                    </Flex>

                    <Box style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        backgroundColor: dateDiff2 < 1 ? 'var(--green-3)' : 'var(--blue-3)'
                    }}>
                        <Text size="2" weight="medium">
                            {dateDiff2 < 1
                                ? "🎓 You have graduated!"
                                : `📚 ${dateDiff1} days completed and ${dateDiff2} days remaining`
                            }
                        </Text>
                    </Box>
                </Flex>
            </Card>
        )
    }

    return (
        <Container>
            <Grid rows={{ initial: "2", sm: "1" }} gap="2">
                <Flex direction="row" gap="4">

                    {cohortDates(profile?.current_cohort)}

                    {/* Repositories Card */}
                    <Card style={{ flex: 1 }}>
                        <Flex direction="column" gap="3">
                            <Flex align="center" gap="2">
                                <GitHubLogoIcon width="20" height="20" />
                                <Text size="4" weight="bold">Repositories</Text>
                            </Flex>

                            <Flex direction="column" gap="2">
                                <Link size="2" href={profile?.current_cohort?.client_course} target="_blank">
                                    Client side coursework
                                </Link>
                                <Link size="2" href={profile?.current_cohort?.server_course} target="_blank">
                                    Server side coursework
                                </Link>
                                <Link size="2" href={`${profile?.current_cohort?.github_org}`} target="_blank">
                                    {profile?.current_cohort?.name} Github Organization
                                </Link>
                            </Flex>
                        </Flex>
                    </Card>
                </Flex>

                <Card style={{ flex: 1}}>
                    <Flex direction="column" gap="3">

                        <Box>
                            <CohortEventList />
                        </Box>
                    </Flex>
                </Card>
            </Grid>
        </Container>
    )
}
