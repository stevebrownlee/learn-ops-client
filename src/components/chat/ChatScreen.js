import React, { useState } from "react"
import { fetchIt } from "../utils/Fetch.js"
import Settings from "../Settings.js"

export const ChatScreen = () => {
    const [chatSession, updateChatSession] = useState([])
    const [message, setMessage] = useState("")

``    const sendHelpRequest = async () => {
        const newAIResponse = await fetchIt(`${Settings.apiHost}/chat`, {
            method: "POST",
            body: JSON.stringify({
                "student_query": message
            })
        })

        updateChatSession([...newAIResponse.slice(1, newAIResponse.length)])
    }


    return <div style={{ display: "flex", flexDirection: "row" }}>
        <article style={{ margin: "0 5rem", display: "flex", flexDirection: "column", flex: 2 }}>
            <label style={{ fontSize: "1.5rem" }}>What do you want to learn?</label>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                style={{
                    width: "50%",
                    height: "20rem"
                }} />
            <button onClick={sendHelpRequest} style={{ width: "10rem", margin: "2rem 0 0 0" }} className="isometric-button yellow">Continue</button>
        </article>
        <article style={{ margin: "0 5rem", display: "flex", flexDirection: "column", flex: 1 }}>
            <h2>Conversation</h2>

            {
                chatSession.map(node => <div>{ node.content }</div>)
            }
        </article>
    </div>
}