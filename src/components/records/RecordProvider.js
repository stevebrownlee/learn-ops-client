import React, { useCallback, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const RecordContext = React.createContext()

export const RecordProvider = (props) => {
    const [ records, setRecords ] = useState([])
    const [ weights, setWeights ] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getWeights = useCallback( () => {
        return fetch(`${Settings.apiHost}/weights`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => setWeights(data.results))
    }, [])

    const getRecords = () => {
        return fetch(`${Settings.apiHost}/records`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json()
                }
                else {
                    throw new Error(`HTTP status ${response.status}`)
                }
            })
            .then(data => setRecords(data))
            .catch(error => console.error(error))
    }

    const deleteRecordEntry = (id) => {
        return fetch(`${Settings.apiHost}/records/entries/${id}`, {
            method: "DELETE",
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(getRecords)
    }

    const createRecordEntry = (record) => {
        return fetch(`${Settings.apiHost}/records/entries`, {
            method: "POST",
            headers:{
                "Authorization": `Token ${user.token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(record)
        })
            .then(getRecords)
    }

    const getRecord = useCallback((id) => {
        return fetch(`${Settings.apiHost}/records/${id}`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
    }, [])

    const createRecord = record => {
        return fetch(`${Settings.apiHost}/records`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${user.token}`
            },
            body: JSON.stringify(record)
        })
            .then(response => response.json())
            .then(getRecords)
    }

    return (
        <RecordContext.Provider value={{
            getWeights, getRecords, weights, records,
            createRecord, deleteRecordEntry, getRecord, createRecordEntry
        }} >
            { props.children }
        </RecordContext.Provider>
    )
}
