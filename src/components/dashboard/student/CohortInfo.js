import React, { useEffect, useState } from "react"

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

    return <section className="info">
        <h2 className="info__header" style={{ marginBottom: 0 }}>{profile?.current_cohort?.name} Info</h2>
        <div className="info__body">
            <div>
                <h3 style={{ marginTop: 0, marginBlockStart: 0 }}>Dates</h3>
                {cohortDates(profile?.current_cohort)}
            </div>
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
