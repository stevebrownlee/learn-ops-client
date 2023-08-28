import React from "react"
import "./Personality.css"

export const StudentNoteList = ({ notes }) => <section className="section--notes">
    <div className="card-title">
        <h2>Notes</h2>
    </div>

    {
        notes && notes.length
            ? notes.map(note => <div key={`note--${note.id}`} className="note">
                <div>{note.note} by {note.author}</div>
                <div className="note__date">{
                    new Date(note.created_on).toLocaleDateString("en-US",
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'America/Chicago'
                        })
                }</div>
            </div>)
            : ""
    }
</section>

