import React, { useContext, useState, useEffect } from "react"
import { GameContext } from "../game/GameProvider";
import { EventContext } from "./EventProvider";
import { useHistory } from 'react-router-dom'

export const EventForm = () => {
    const history = useHistory()

    const { createEvent } = useContext(EventContext)
    const { games, getGames } = useContext(GameContext)

    const [currentEvent, setEvent] = useState({
        gameId: 0,
        description: "",
        date: "",
        time: ""
    })

    useEffect(() => {
        getGames()
    }, [])

    const changeEventState = (event) => {
        const newEventState = { ...currentEvent }
        newEventState[event.target.name] = event.target.value
        setEvent(newEventState)
    }

    return (
        <form className="gameForm">
            <h2 className="gameForm__title">Schedule New Event</h2>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="gameId">Game: </label>
                    <select name="gameId" className="form-control"
                        value={currentEvent.gameId}
                        onChange={changeEventState}>
                        <option value="0">Select a game...</option>
                        {
                            games.map(game => (
                                <option key={game.id} value={game.id}> {game.title} </option>
                            ))
                        }
                    </select>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="description">Description: </label>
                    <textarea type="text" name="description" required autoFocus className="form-control"
                        value={currentEvent.description}
                        onChange={changeEventState}
                        style={{
                            height: "5rem"
                        }}
                    ></textarea>
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="date">Date: </label>
                    <input type="date" name="date" required autoFocus className="form-control"
                        value={currentEvent.date}
                        onChange={changeEventState}
                    />
                </div>
            </fieldset>
            <fieldset>
                <div className="form-group">
                    <label htmlFor="numberOfPlayers">Time: </label>
                    <input type="time" name="time" required autoFocus className="form-control"
                        value={currentEvent.time}
                        onChange={changeEventState}
                    />
                </div>
            </fieldset>
            <button type="submit"
                onClick={evt => {
                    evt.preventDefault()

                    createEvent({
                        gameId: currentEvent.gameId,
                        description: currentEvent.description,
                        date: currentEvent.date,
                        time: currentEvent.time
                    })
                        .then(() => history.push({ pathname: "/events" }))
                }}
                className="btn btn-primary">Create</button>
        </form>
    )
}
