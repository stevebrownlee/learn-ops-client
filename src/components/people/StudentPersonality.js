import React, { useContext } from "react"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import "./Personality.css"

export const StudentPersonality = () => {
    const { activeCohort } = useContext(CohortContext)
    const { activeStudent, personality } = useContext(PeopleContext)


    return <section className="section--personality">
        <div className="card-title">
            <h3>Persona</h3>
        </div>
        <div className="persona">
            <section className={`persona__myers-briggs section--persona personality--${personality?.briggs_myers_type?.description?.type}`}>
                <h2>{personality?.briggs_myers_type?.code}</h2>
                <h3>Summary</h3>
                <p>{personality?.briggs_myers_type?.description?.summary}</p>

            </section>

            <section className="persona__bfi section--persona">
                <h3>Emotions &amp; Communication</h3>
                <p>{personality?.briggs_myers_type?.description?.details}</p>
            </section>

            <section className="persona__bfi section--persona">
                <h2>BFI</h2>
                <div>Extraversion: {personality?.bfi_extraversion}</div>
                <div>Conscientiousness: {personality?.bfi_conscientiousness}</div>
                <div>Neuroticism: {personality?.bfi_neuroticism}</div>
                <div>Openness to Experience: {personality?.bfi_openness}</div>
                <div>Agreeableness: {personality?.bfi_agreeableness}</div>
            </section>
        </div>
    </section>
}
