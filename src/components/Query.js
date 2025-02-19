import React, { useState, useEffect } from "react"
import { Box, Container, Button, Flex } from '@radix-ui/themes'
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

    const renderContent = (text) => {
        if (!text) return "";

        const parts = text.split(/(```[\s\S]*?```)/);
        return parts.map((part, index) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                // Remove the backticks and any language identifier after the opening backticks
                const code = part.slice(3, -3).replace(/^[a-zA-Z]+\n/, '');
                return (
                    <pre key={index} style={{
                        backgroundColor: '#272b2c',
                        color: 'white',
                        padding: '1rem',
                        borderRadius: '4px',
                        overflowX: 'auto',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                    }}>
                        <code>{code}</code>
                    </pre>
                );
            }
            // For non-code blocks, replace \n with <br/>
            const lines = part.split('\\n');
            return <span key={index}>
                {lines.map((line, i) => (
                    <React.Fragment key={i}>
                        {line}
                        {i < lines.length - 1 && <br />}
                    </React.Fragment>
                ))}
            </span>;
        });
    };

    return (
        <div>
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
                > Submit Question </Button>

                {isConnected && (
                    <Button onClick={stopGeneration} color="red"> Stop </Button>
                )}
            </Flex>

            <Container size="3" style={{ margin: '0 3rem' }}>
                <Box py="4" px="4" style={{ backgroundColor: '#f5f5f5' }}>
                    {renderContent(explanation)}
                </Box>
            </Container>

            {isConnected && (
                <div className="status">
                    Receiving explanation...
                </div>
            )}
        </div>
    )
}