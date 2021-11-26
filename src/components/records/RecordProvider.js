import React, { useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const RecordContext = React.createContext()

export const RecordProvider = (props) => {
    const [ records, setRecords ] = useState([])
    const [ weights, setWeights ] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    const getWeights = () => {
        return fetch(`${Settings.apiHost}/weights`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => setWeights(data.results))
    }

    const getRecords = () => {
        return fetch(`${Settings.apiHost}/records`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => setRecords(data.results))
    }

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
            getWeights, getRecords, weights, records, createRecord
        }} >
            { props.children }
        </RecordContext.Provider>
    )
}
