import React, { useState, useEffect } from "react"
import { fetchIt } from "../../utils/Fetch"
import Settings from "../../Settings"
import "../Dashboard.css"
import "./FoundationsExerciseView.css"

export const FoundationsExerciseView = () => {
    const [learnerData, setLearnerData] = useState([])
    const [allLearnerData, setAllLearnerData] = useState([]) // Store all data from API
    const [githubName, setGithubName] = useState("")
    const [startDate, setStartDate] = useState("")
    const [loading, setLoading] = useState(true)
    const [selectedCohort, setSelectedCohort] = useState("")
    const [expandedLearners, setExpandedLearners] = useState({})
    const [uniqueCohorts, setUniqueCohorts] = useState([])
    const [cohortTypeForUnassigned, setCohortTypeForUnassigned] = useState("")

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
                // Extract unique cohorts from data
                const cohorts = data
                    .map(learner => learner.cohort)
                    .filter(cohort =>
                        cohort &&
                        !cohort.includes("Unassigned") &&
                        cohort.toLowerCase() !== "day 0"
                    )

                // Get unique cohort values
                const uniqueCohortValues = [...new Set(cohorts)].sort()
                setUniqueCohorts(uniqueCohortValues)

                // Store all data from API
                setAllLearnerData(data)

                // Filter data based on selected cohort if provided
                let filteredData = [...data]

                if (selectedCohort) {
                    filteredData = data.filter(learner => {
                        return learner.cohort === selectedCohort
                    })
                    setLearnerData(filteredData)
                } else {
                    setLearnerData(data)
                }

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

    // Filter data when selected cohort changes
    useEffect(() => {
        if (allLearnerData.length > 0) {
            // Apply cohort filter without making a new API call
            if (selectedCohort) {
                // When a specific cohort is selected, only show learners from that cohort
                const filteredData = allLearnerData.filter(learner =>
                    learner.cohort === selectedCohort
                )
                setLearnerData(filteredData)
            } else {
                setLearnerData(allLearnerData)
            }
        }
    }, [selectedCohort, allLearnerData])

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        fetchExercises()
    }

    // Reset filters
    const handleReset = () => {
        setGithubName("")
        setStartDate("")
        setSelectedCohort("")

        // If we have data already, reset to show all data except "day 0"
        if (allLearnerData.length > 0) {
            const filteredData = allLearnerData.filter(learner =>
                !learner.cohort.toLowerCase().includes("day 0")
            )
            setLearnerData(filteredData)
        } else {
            // If no data yet, fetch from API
            fetchExercises()
        }
    }

    // Toggle expanded state for a learner
    const toggleExpand = (learnerName) => {
        setExpandedLearners(prev => ({
            ...prev,
            [learnerName]: !prev[learnerName]
        }))
    }

    function formatDuration(first, last) {
        const firstAttempt = new Date(first);
        const lastAttempt = new Date(last);
        const duration = Math.abs(lastAttempt - firstAttempt);
        const hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((duration / (1000 * 60)) % 60);
        const seconds = Math.floor((duration / 1000) % 60);
        const formattedDuration = `${hours}h ${minutes}m ${seconds}s`;
        return formattedDuration;
    }

    const formatDateWithoutTime = (dateString) => {
        return dateString.split("T")[0]
    }

    // Calculate completed and incomplete exercise counts
    const getExerciseCounts = (exercises) => {
        // Filter out exercises with "Undefined" title before counting
        const validExercises = exercises.filter(ex => ex.title !== "Undefined")
        const completed = validExercises.filter(ex => ex.complete).length
        const incomplete = validExercises.filter(ex => !ex.complete).length
        return { completed, incomplete, total: validExercises.length }
    }

    const updateCohort = (e, userId, cohortType) => {
        // Perform PUT request to update the cohort
        setLoading(true)
        const cohortNumber = e.target.value
        const cohortTypeValue = cohortType === "day" ? "Day" : cohortType === "evening" ? "Evening" : null

        if (cohortNumber && cohortTypeValue) {
            const url = `${Settings.apiHost}/foundations/assigncohort`
            const data = {
                userId: userId,
                cohortType: cohortTypeValue,
                cohortNumber: cohortNumber
            }
            fetchIt(url, {
                method: "PUT",
                body: JSON.stringify(data)
            })
                .then(data => {
                    console.log("Cohort updated successfully:", data)
                    fetchExercises()
                })
                .catch(error => {
                    console.error("Error updating cohort:", error)
                })
                .finally(() => {
                    fetchExercises()
                })
        }
    }
    // If the cohort field is "Unassigned", display two radio buttons labeled "day" and "evening" with an
    // input field for the cohort number. The user can select one of the radio buttons and enter a number in the input field.
    // When they return key is pressed in the input field, perform a PUT request to update the cohort.
    const renderCohortField = (learner) => {
        if (learner.cohort.includes("Unassigned") || learner.cohort.toLowerCase() === "day 0") {
            return (
                <div className="cohort-selection">
                    <input
                        type="radio"
                        name={`cohort-${learner.learner_github_id}`}
                        value="day"
                        onChange={() => { setCohortTypeForUnassigned("day") }}
                        checked={cohortTypeForUnassigned === "day"}
                    /> Day
                    <input
                        type="radio"
                        name={`cohort-${learner.learner_github_id}`}
                        value="evening"
                        onChange={() => { setCohortTypeForUnassigned("evening") }}
                        checked={cohortTypeForUnassigned === "evening"}
                    /> Evening
                    <input
                        type="number"
                        placeholder="Cohort Number"
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                updateCohort(e, learner.learner_github_id, cohortTypeForUnassigned)
                            }
                        }}
                    />
                </div>
            )
        }
        return learner.cohort
    }

    return (
        <div className="foundations-exercise-container">
            <h2>Foundations Exercises</h2>

            <form className="foundations-filter-form" onSubmit={handleSubmit}>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="githubName">Learner Name:</label>
                        <input
                            type="text"
                            id="githubName"
                            value={githubName}
                            onChange={(e) => setGithubName(e.target.value)}
                            placeholder="Enter learner's name"
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
                    <div className="filter-controls">
                        <div className="filter-group">
                        <label>Cohorts:</label>
                        <div className="cohort-buttons">
                            <button
                                type="button"
                                className={`cohort-button ${selectedCohort === "" ? "active" : ""}`}
                                onClick={() => setSelectedCohort("")}
                            >
                                All
                            </button>
                            {uniqueCohorts.map(cohort => (
                                <button
                                    key={cohort}
                                    type="button"
                                    className={`cohort-button ${selectedCohort === cohort ? "active" : ""}`}
                                    onClick={() => setSelectedCohort(cohort)}
                                >
                                    {cohort}
                                </button>
                            ))}
                        </div>
                    </div>
                    </div>
                </div>
            </form>

            {loading ? (
                <div className="loading">Loading exercises...</div>
            ) : learnerData.length === 0 ? (
                <div className="no-results">No exercises found matching the criteria.</div>
            ) : (
                <div className="exercises-table-container">
                    <table className="exercises-table">
                        <thead>
                            <tr>
                                <th>Learner</th>
                                <th>Cohort</th>
                                <th>Completed</th>
                                <th>Incomplete</th>
                                <th>Total</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {learnerData.map((learner) => {
                                const { completed, incomplete, total } = getExerciseCounts(learner.exercises)
                                const isExpanded = expandedLearners[learner.learner_name] || false
                                const validExercises = learner.exercises.filter(ex => ex.title !== "Undefined")

                                return (
                                    <React.Fragment key={`${learner.learner_name}-${learner.learner_github_id}`}>
                                        <tr
                                            className="learner-summary-row"
                                            style={{
                                                cursor: 'pointer',
                                                backgroundColor: '#f0f0f0',
                                                fontWeight: 'bold'
                                            }}
                                            onClick={() => toggleExpand(learner.learner_name)}
                                        >
                                            <td>{learner.learner_name}</td>
                                            <td>{renderCohortField(learner)}</td>
                                            <td>{completed}</td>
                                            <td>{incomplete}</td>
                                            <td>{(parseFloat(completed / 49) * 100).toFixed(1)}%</td>
                                            <td>
                                                {isExpanded ? "▼ Hide Details" : "► Show Details"}
                                            </td>
                                        </tr>

                                        {isExpanded && (
                                            <tr>
                                                <td colSpan="6" style={{ padding: 0 }}>
                                                    <table style={{ width: '100%' }}>
                                                        <thead>
                                                            <tr>
                                                                <th>Title</th>
                                                                <th>Attempts</th>
                                                                <th>First Attempt</th>
                                                                <th>Last Attempt</th>
                                                                <th>Duration</th>
                                                                <th>Solution Used</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {validExercises.map(exercise => (
                                                                <tr key={exercise.id} className={exercise.complete ? "complete" : "incomplete"}>
                                                                    <td>{exercise.title}</td>
                                                                    <td>{exercise.attempts}</td>
                                                                    <td>{formatDateWithoutTime(exercise.first_attempt) || "N/A"}</td>
                                                                    <td>{formatDateWithoutTime(exercise.last_attempt) || "N/A"}</td>
                                                                    <td>{formatDuration(exercise.first_attempt, exercise.last_attempt)}</td>
                                                                    <td>{exercise.used_solution ? "Yes" : "No"}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}