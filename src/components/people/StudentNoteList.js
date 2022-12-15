import React, { useContext } from "react"
import { CohortContext } from "../cohorts/CohortProvider.js"
import { PeopleContext } from "../people/PeopleProvider.js"
import "./Personality.css"

export const StudentNoteList = ({ notes }) => {
    return <section className="section--notes">
        <div className="card-title">
            <h3>Notes</h3>
        </div>

        {
            notes.map(note => <div key={`note--${note.id}`} className="note">
                <div>{note.note} by {note.author} on {
                    new Date(note.created_on).toLocaleDateString("en-US",
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'America/Chicago'
                        })
                }
                </div>
            </div>)
        }
    </section>
}
