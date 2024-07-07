import React from "react"
import "./Personality.css"
import { Button } from "@radix-ui/themes"
import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"

export const StudentNoteList = ({ notes, deleteStudentNote }) => <section className="section--notes">
    {
        notes && notes.length
            ? notes.map(note => <div key={`note--${note.id}`} className="note">
                <div className="note__text">{note.note}</div>
                <div className="note__author">{note.author}</div>
                <div className="note__date">{
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

