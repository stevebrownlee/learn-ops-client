import React from "react"
import "./Personality.css"
import { Button } from "@radix-ui/themes"
import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"

export const StudentNoteList = ({ notes, deleteStudentNote }) => <section className="section--notes">
    <div className="card-title">
        <h2>Notes</h2>
    </div>

    {
        notes && notes.length
            ? notes.map(note => <div key={`note--${note.id}`} className="note">
                <div style={{ flex: 20 }}>{note.note} by {note.author}</div>
                <div style={{ flex: 4 }} className="note__date">{
                    new Date(note.created_on).toLocaleDateString("en-US",
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            timeZone: 'America/Chicago'
                        })
                }</div>
                <div style={{
                    flex: 1,
                    marginLeft: "auto",
                    textAlign: "right"
                }}>
                    <Button color="red"
                        onClick={e => deleteStudentNote(note.id)}
                        style={{
                            padding: "0 0.3rem",
                            height: "auto"
                        }}>X</Button>
                </div>
            </div>)
            : ""
    }
</section>

