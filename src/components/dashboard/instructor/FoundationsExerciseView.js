import React, { useState, useEffect } from "react"
import { fetchIt } from "../../utils/Fetch"
import Settings from "../../Settings"
import "../Dashboard.css"
import "./FoundationsExerciseView.css"

export const FoundationsExerciseView = () => {
    const [exercises, setExercises] = useState([])
    const [githubName, setGithubName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [loading, setLoading] = useState(true)

    // Format date for API query
    const formatDateForQuery = (dateString) => {
        if (!dateString) return null
        const date = new Date(dateString)
        return date.toISOString().split('T')[0]
    }

    // Fetch exercises with optional filters
    const fetchExercises = () => {
        setLoading(true)

        let url = `${Settings.apiHost}/foundations`
        const queryParams = []

        if (githubName) {
            queryParams.push(`learnerName=${githubName}`)
        }

        if (startDate) {
            const formattedDate = formatDateForQuery(startDate)
            if (formattedDate) {
                queryParams.push(`lastAttempt=${formattedDate}`)
            }
        }

        if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`
        }

        fetchIt(url)
            .then(data => {
                setExercises(data)
                setLoading(false)
            })
            .catch(error => {
                console.error("Error fetching exercises:", error)
                setLoading(false)
            })
    }

    // Initial fetch on component mount - last 30 days by default
    useEffect(() => {
        fetchExercises()
    }, [])

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        fetchExercises()
    }

    // Reset filters
    const handleReset = () => {
        setGithubName("")
        setStartDate("")
        setTimeout(() => {
            fetchExercises()
        }, 0)
    }

    return (
        <div className="foundations-exercise-container">
            <h2>Foundations Exercises</h2>

            <form className="foundations-filter-form" onSubmit={handleSubmit}>
                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="githubName">Last Name:</label>
                        <input
                            type="text"
                            id="githubName"
                            value={githubName}
                            onChange={(e) => setGithubName(e.target.value)}
                            placeholder="Enter learner's last name"
                        />
                    </div>

                    <div className="filter-group">
                        <label htmlFor="startDate">Show entries from:</label>
                        <input
                            type="date"
                            id="startDate"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>

                    <div className="filter-actions">
                        <button type="submit" className="filter-button">Apply Filters</button>
                        <button type="button" className="reset-button" onClick={handleReset}>Reset</button>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="loading">Loading exercises...</div>
            ) : exercises.length === 0 ? (
                <div className="no-results">No exercises found matching the criteria.</div>
            ) : (
                <div className="exercises-table-container">
                    <table className="exercises-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Learner Name</th>
                                <th>Attempts</th>
                                <th>Status</th>
                                <th>First Attempt</th>
                                <th>Last Attempt</th>
                                <th>Completed On</th>
                            </tr>
                        </thead>
                        <tbody>
                            {exercises.map(exercise => {
                                if (exercise.title !== "Undefined") {
                                    return (
                                        <tr key={exercise.id} className={exercise.complete ? "complete" : "incomplete"}>
                                            <td>{exercise.title}</td>
                                            <td>{exercise.learner_name}</td>
                                            <td>{exercise.attempts}</td>
                                            <td>{exercise.complete ? "Complete" : "Incomplete"}</td>
                                            <td>{exercise.first_attempt}</td>
                                            <td>{exercise.last_attempt}</td>
                                            <td>{exercise.completed_on || "N/A"}</td>
                                        </tr>
                                    )
                                }
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}