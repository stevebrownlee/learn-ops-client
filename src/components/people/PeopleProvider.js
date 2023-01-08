import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"
import { fetchIt } from "../utils/Fetch.js"

export const PeopleContext = React.createContext()

export const PeopleProvider = (props) => {
    const [students, setStudents] = useState([])
    const [tags, setTags] = useState([])
    const [proposals, setProposals] = useState([])
    const [coreSkills, setCoreSkills] = useState([])
    const [learningRecords, setLearningRecords] = useState([])
    const [personality,setPersonality] = useState({})
    const [cohortStudents, setCohortStudents] = useState([])
    const [activeStudent, activateStudent] = useState({})
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getStudents = useCallback((status = "") => {
        return fetchIt(`${Settings.apiHost}/students${status !== "" ? `?status=${status}` : ""}`)
            .then(data => setStudents(data.results))
    }, [])

    const getCohortStudents = useCallback((cohortId) => {
        return fetchIt(`${Settings.apiHost}/students?cohort=${cohortId}`)
            .then(data => setCohortStudents(data.results))
    }, [])

    const getStudentCoreSkills = useCallback((studentId) => {
        return fetchIt(`${Settings.apiHost}/coreskillrecords?studentId=${studentId}`)
            .then(setCoreSkills)
    }, [])

    const getStudentLearningRecords = useCallback((studentId) => {
        return fetchIt(`${Settings.apiHost}/records?studentId=${studentId}`)
            .then(setLearningRecords)
    }, [])

    const getAllTags = useCallback(() => {
        return fetchIt(`${Settings.apiHost}/tags`)
            .then(data => setTags(data.results))
    }, [])

    const getStudentNotes = useCallback((studentId) => {
        return fetchIt(`${Settings.apiHost}/notes?studentId=${studentId}`)
    }, [])

    const getStudentPersonality = useCallback((studentId) => {
        return fetchIt(`${Settings.apiHost}/personalities?studentId=${studentId}`)
            .then(data => setPersonality(data.results[0]))
    }, [])

    const tagStudent = useCallback((student, tag) => {
        return fetchIt(`${Settings.apiHost}/studenttags`, {
            method: "POST",
            body: JSON.stringify({ student, tag })
        })
    }, [])

    const tagStudentTeams = useCallback((combos) => {
        return fetchIt(`${Settings.apiHost}/students/teams`, {
            method: "POST",
            body: JSON.stringify({ combos })
        })
    }, [])

    const untagStudent = useCallback((studentTagId) => {
        return fetchIt(`${Settings.apiHost}/studenttags/${studentTagId}`, {
            method: "DELETE"
        })
    }, [])

    const createNewTag = useCallback((tag) => {
        return fetchIt(`${Settings.apiHost}/tags`, {
            method: "POST",
            body: JSON.stringify({ name: tag })
        })
    }, [])

    const deleteTag = useCallback((tagId) => {
        return fetchIt(`${Settings.apiHost}/tags/${tagId}`, {
            method: "DELETE"
        })
    }, [])

    const setStudentCurrentProject = useCallback((studentId, projectId) => {
        return fetchIt(`${Settings.apiHost}/students/${studentId}/project`, {
            method: "POST",
            body: JSON.stringify({
                projectId
            })
        })
    }, [])

    const updateStudentCurrentAssessment = useCallback((student, statusId) => {
        return fetchIt(`${Settings.apiHost}/students/${student.id}/assess`, {
            method: "PUT",
            body: JSON.stringify({ statusId })
        })
    }, [])

    const setStudentCurrentAssessment = useCallback((student) => {
        return fetchIt(`${Settings.apiHost}/students/${student.id}/assess`, {
            method: "POST",
            body: JSON.stringify({
                bookId: student.book.id
            })
        })
            .catch(error => alert(error))
    }, [])

    const getStudent = useCallback((id = null) => {
        let studentId = 0
        if (id && Number.isFinite(id)) {
            studentId = id
        }
        else if (!id && !("id" in activeStudent)) {
            throw "No active student"
        }
        else if ("id" in activeStudent) {
            studentId = activeStudent.id
        }
        return fetchIt(`${Settings.apiHost}/students/${studentId}`)
            .then(activateStudent)
    }, [user])

    const getStudentRepos = useCallback(() => {
        return fetchIt(`${activeStudent.github.repos}?sort=updated&direction=desc`)
            .then(activateStudent)
    }, [activeStudent])

    const getStudentProposals = useCallback((studentId) => {
        return fetchIt(`${Settings.apiHost}/capstones?studentId=${studentId}`)
            .then(setProposals)
    }, [activeStudent])

    const findStudent = useCallback((q) => {
        return fetchIt(`${Settings.apiHost}/students?q=${q}`)
    }, [])

    return (
        <PeopleContext.Provider value={{
            getStudents, students, findStudent, getStudent,
            activeStudent, activateStudent, getCohortStudents,
            cohortStudents, getStudentProposals, proposals,
            setStudentCurrentProject, setStudentCurrentAssessment,
            updateStudentCurrentAssessment, getAllTags, tags,
            tagStudent, untagStudent, createNewTag, deleteTag,
            getStudentNotes, getStudentCoreSkills, coreSkills,
            getStudentLearningRecords, learningRecords,
            getStudentPersonality, personality, tagStudentTeams
        }} >
            {props.children}
        </PeopleContext.Provider>
    )
}
