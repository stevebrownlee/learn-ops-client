import React, { useContext, useState, useEffect } from "react"
import { GameContext } from "./GameProvider.js"
import { useParams, useHistory } from 'react-router-dom'


export const GameForm = () => {
    const history = useHistory()
    const { gameId = null } = useParams()

    const {
        createGame, getGameTypes, gameTypes,
        getGame, editGame
    } = useContext(GameContext)

    const [title, setTitle] = useState("Register new game")
    const [currentGame, setCurrentGame] = useState({
        skillLevel: 1,
        numberOfPlayers: 0,
        title: "",
        maker: "",
        gameTypeId: 0
    })

    useEffect(() => {
        getGameTypes()
    }, [])

    useEffect(() => {
        if (gameId !== null) {
            getGame(gameId).then(game => {
                setTitle("Update Game Details")
                setCurrentGame({
                    skillLevel: game.skill_level,
                    numberOfPlayers: game.number_of_players,
                    title: game.title,
                    gameTypeId: game.gametype.id,
                    maker: game.maker
                })
            })
        }
    }, [gameId])


    /*
        REFACTOR CHALLENGE START

        Can you refactor this code so that all property
        state changes can be handled with a single function
        instead of five functions that all, largely, do
        the same thing?
    */
    const changeGameTitleState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.title = event.target.value
        setCurrentGame(newGameState)
    }

    const changeGameMakerState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.maker = event.target.value
        setCurrentGame(newGameState)
    }

    const changeGamePlayersState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.numberOfPlayers = parseInt(event.target.value)
        setCurrentGame(newGameState)
    }

    const changeGameSkillLevelState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.skillLevel = parseInt(event.target.value)
        setCurrentGame(newGameState)
    }

    const changeGameTypeState = (event) => {
        const newGameState = { ...currentGame }
        newGameState.gameTypeId = parseInt(event.target.value)
        setCurrentGame(newGameState)
    }
    /* REFACTOR CHALLENGE END */

    return (
        <form className="gameForm">
            <h2 className="gameForm__title">{title}</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="title">Title: </label>
                    <input type="text" name="title" required autoFocus className="form-control"
                        value={currentGame.title}
                        onChange={changeGameTitleState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="maker">Maker/Distributor: </label>
                    <input type="text" name="maker" required autoFocus className="form-control"
                        value={currentGame.maker}
                        onChange={changeGameMakerState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="numberOfPlayers">Number of Players: </label>
                    <input type="number" name="numberOfPlayers" required autoFocus className="form-control"
                        value={currentGame.numberOfPlayers}
                        onChange={changeGamePlayersState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="skillLevel">Skill level (1-5): </label>
                    <input type="range" min="1" max="5" name="skillLevel"
                        value={currentGame.skillLevel}
                        onChange={changeGameSkillLevelState} />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameTypeId">Game Type: </label>
                    <select name="gameTypeId" className="form-control"
                        value={currentGame.gameTypeId}
                        onChange={changeGameTypeState}>
                        <option value="0">Select a type</option>
                        {
                            gameTypes.map(type => (
                                <option key={type.id} value={type.id}> {type.label} </option>
                            ))
                        }
                    </select>
                </div>
            </fieldset>
            {
                (gameId !== null)
                    ? <button
                        onClick={evt => {
                            evt.preventDefault()
                            editGame({
                                id: gameId,
                                maker: currentGame.maker,
                                title: currentGame.title,
                                numberOfPlayers: currentGame.numberOfPlayers,
                                skillLevel: currentGame.skillLevel,
                                gameTypeId: currentGame.gameTypeId
                            })
                                .then(() => history.push("/games"))
                        }}
                        className="btn btn-primary">Edit</button>
                    : <button type="submit"
                        onClick={evt => {
                            evt.preventDefault()
                            createGame({
                                maker: currentGame.maker,
                                title: currentGame.title,
                                numberOfPlayers: currentGame.numberOfPlayers,
                                skillLevel: currentGame.skillLevel,
                                gameTypeId: currentGame.gameTypeId
                            })
                                .then(() => history.push("/games"))
                        }}
                        className="btn btn-primary">Create</button>
            }
        </form>
    )
}