import React, { useContext, useEffect } from "react"
import { AssessmentContext } from "../assessments/AssessmentProvider.js"

export const CohortDetails = () => {

    const hideOverlay = (e) => {
        document.querySelector('.overlay--cohort').style.display = "none"
    }

    return (
        <div className="overlay--cohort">
            <div className="card" style={{
                display: "flex",
                alignItems: "center",
                padding: "1rem 0 0 0"
            }}>
                <span onClick={hideOverlay} className="close hairline"></span>
            </div>
            <div className="card">
                <div className="card-body">
                    <header className="cohort__header">
                        <h2 className="card-title cohort__info">Cohort name</h2>
                    </header>

                    <div className="card-text">
                        <div className="cohort__details">
                            Cohort details
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
