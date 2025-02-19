import React, { useState, useEffect } from "react"
import { Button, Flex } from '@radix-ui/themes'
import Settings from "./Settings.js"
import { fetchIt } from "./utils/Fetch.js"

export const Query = () => {
    const [question, setQuestion] = useState("What is a javascript function parameter?")
    const [requestId, setRequestId] = useState(0)
    const [explanation, setExplanation] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [receivedChunks] = useState(new Set())
    const [eventSource, setEventSource] = useState(null)

    useEffect(() => {
        if (requestId === 0) {
            return;
        }

        const es = new EventSource(`${Settings.apiHost}/answers/${requestId}`)
        setEventSource(es)

        es.addEventListener('open', (e) => {
            console.log('Connection opened')
            setIsConnected(true)
        });

        es.onmessage = async (event) => {
            try {
                const chunk = JSON.parse(event.data)

                // Ignore the connection establishment message
                if (chunk.type === 'connection') {
                    return
                }

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
                        es.close()
                        setIsConnected(false)
                        setEventSource(null)
                    }
                }
            } catch (error) {
                console.error('Error processing chunk:', error)
            }
        }

        es.onerror = (error) => {
            console.error('EventSource failed:', error)
            setIsConnected(false)
            es.close()
            setEventSource(null)
        }

        return () => {
            es.close()
            setIsConnected(false)
            setEventSource(null)
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

    const stopGeneration = async () => {
        try {
            // Send an ABORT acknowledgment (sequence_number = -1)
            await fetchIt(`${Settings.apiHost}/answers/${requestId}/ack`, {
                method: 'POST',
                body: JSON.stringify({
                    sequence_number: -1,
                    requestId: requestId,
                    is_final: true,
                })
            })
            console.log('Sent abort signal')
            setIsConnected(false)
            if (eventSource) {
                eventSource.close()
                setEventSource(null)
            }
        } catch (error) {
            console.error('Error sending abort signal:', error)
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
            <Flex gap="3" my="3">
                <Button
                    onClick={submitQuestion}
                    disabled={isConnected} // Prevent new submission while connected
                    color="green"
                >
                    Submit Question
                </Button>

                {isConnected && (
                    <Button
                        onClick={stopGeneration}
                        color="red"
                    >
                        Stop
                    </Button>
                )}
            </Flex>

            <div className="explanation">
                {explanation || ""}
            </div>

            {isConnected && (
                <div className="status">
                    Receiving explanation...
                </div>
            )}
        </div>
    )
}