import React, { useState, useEffect } from "react"
import Settings from "./Settings.js"
import { fetchIt } from "./utils/Fetch.js"

export const Query = () => {
    const [question, setQuestion] = useState("What is a javascript function parameter?")
    const [requestId, setRequestId] = useState(0)
    const [explanation, setExplanation] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [receivedChunks] = useState(new Set())

    useEffect(() => {
        if (requestId === 0) {
            return;
        }

        const eventSource = new EventSource(`${Settings.apiHost}/answers/${requestId}`)

        eventSource.onmessage = async (event) => {
            try {
                const chunk = JSON.parse(event.data)

                // Only process if we haven't seen this chunk
                if (!receivedChunks.has(chunk.sequence_number)) {
                    receivedChunks.add(chunk.sequence_number)

                    // Append new chunk to explanation
                    setExplanation(prev => prev + chunk.chunk)

                    // Send acknowledgment
                    await fetchIt(`${Settings.apiHost}/answers/${requestId}/ack`, {
                        method: 'POST',
                        body: JSON.stringify({
                            sequence_number: chunk.sequence_number
                        })
                    })

                    // Close connection if this was the final chunk
                    if (chunk.is_final) {
                        eventSource.close()
                        setIsConnected(false)
                    }
                }
            } catch (error) {
                console.error('Error processing chunk:', error)
            }
        }

        eventSource.onerror = (error) => {
            console.error('EventSource failed:', error)
            setIsConnected(false)
            eventSource.close()
        }

        eventSource.onopen = () => {
            console.log('Connection opened')
            setIsConnected(true)
        }

        return () => {
            eventSource.close()
            setIsConnected(false)
        }
    }, [requestId])

    const submitQuestion = async (e) => {
        e.preventDefault()
        try {
            const response = await fetchIt(`${Settings.apiHost}/helprequest`, {
                method: "POST",
                body: JSON.stringify({ question })
            })
            // setQuestion("")
            setExplanation("")  // Clear previous explanation
            receivedChunks.clear()  // Clear tracked chunks
            setRequestId(response.request_id)
        } catch (error) {
            console.error('Error submitting question:', error)
        }
    }

    return (
        <div className="query">
            <textarea
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="What question do you have?"
                rows="3"
            />
            <button
                onClick={submitQuestion}
                disabled={isConnected} // Prevent new submission while connected
            >
                Submit Question
            </button>

            <div className="explanation">
                {explanation || "Awaiting response..."}
            </div>

            {isConnected && (
                <div className="status">
                    Receiving explanation...
                </div>
            )}
        </div>
    )
}