import React, { useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth.js"
import Settings from "../Settings.js"

export const RecordContext = React.createContext()

export const RecordProvider = (props) => {
    const [ records, setRecords ] = useState([])
    const [ weights, setWeights ] = useState([])
    const { getCurrentUser } = useSimpleAuth()

    const getWeights = () => {
        const user = getCurrentUser()

        return fetch(`${Settings.apiHost}/weights`, {
            headers:{
                "Authorization": `Token ${user.token}`
            }
        })
            .then(response => response.json())
            .then(data => setWeights(data.results))
    }

    const createWeight = weight => {
        const user = getCurrentUser()

        return fetch(`${Settings.apiHost}/weights`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${user.token}`
            },
            body: JSON.stringify(weight)
        })
            .then(response => response.json())
            .then(getWeights)
    }

    return (
        <RecordContext.Provider value={{
            getWeights, createWeight, weights
        }} >
            { props.children }
        </RecordContext.Provider>
    )
}
