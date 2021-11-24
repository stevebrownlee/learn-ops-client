import React, { useState } from "react"
import Settings from "../Settings.js"

export const GameContext = React.createContext()

export const GameProvider = (props) => {
    const [ games, setGames ] = useState([])
    const [ gameTypes, setTypes ] = useState([])

    const getGames = (sortBy=null) => {
        return fetch(`${Settings.apiHost}/games${sortBy === null ? "" : `?sortBy=${sortBy}`}`, {
            headers:{
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(response => response.json())
            .then(setGames)
    }

    const createGame = game => {
        return fetch(`${Settings.apiHost}/games`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            },
            body: JSON.stringify(game)
        })
            .then(response => response.json())
            .then(getGames)
    }

    const editGame = game => {
        return fetch(`${Settings.apiHost}/games/${game.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            },
            body: JSON.stringify(game)
        })
            .then(getGames)
    }

    const getGameTypes = () => {
        return fetch(`${Settings.apiHost}/gametypes`, {
            headers:{
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(response => response.json())
            .then(setTypes)
    }

    const getGame = (id) => {
        return fetch(`${Settings.apiHost}/games/${id}`, {
            headers:{
                "Authorization": `Token ${localStorage.getItem("nss_token")}`
            }
        })
            .then(response => response.json())
    }

    return (
        <GameContext.Provider value={{
            createGame, games, getGames, editGame,
            gameTypes, getGameTypes, getGame
        }} >
            { props.children }
        </GameContext.Provider>
    )
}
