import React, { useContext, useEffect } from "react"
import { useHistory } from "react-router-dom"
import { EventContext } from "../event/EventProvider.js"
import { HumanDate } from "../utils/HumanDate.js"
import { GameContext } from "./GameProvider.js"
import "./Games.css"

export const GameList = () => {
    const history = useHistory()
    const { games, getGames } = useContext(GameContext)
    const { events, getEvents } = useContext(EventContext)

    useEffect(() => {
        getEvents().then(getGames)
    }, [])

    return (
        <>
            <header>
                <div className="titlebar">
                    <h1>Level Up Games</h1>

                    <div className="tab-bar radius">
                        <a className="tab"
                            onClick={(e) => {
                                e.preventDefault()
                                getGames("players")
                            }}
                            href="#" data-text="Players needed">
                            <span className="icon" >👩‍👩‍👧</span>
                        </a>
                        <a className="tab"
                            onClick={(e) => {
                                e.preventDefault()
                                getGames("skill")
                            }}
                            href="#" data-text="Skill level">
                            <span className="icon">🎯</span>
                        </a>
                    </div>
                </div>



                <button className="btn btn-2 btn-sep icon-create"
                    onClick={() => {
                        history.push({ pathname: "/games/new" })
                    }}
                >Register New Game</button>
            </header>
            <article className="games">
                {
                    games.map(game => {
                        return <section key={`game--${game.id}`} className="game">
                            <div className="game__title">{game.title} by {game.maker}</div>
                            <div className="game__players">{game.number_of_players} players needed</div>
                            <div className="game__skillLevel">Skill level is {game.skill_level}</div>
                            <h4>Upcoming Events</h4>
                            {
                                events.filter(event => event.game.id === game.id)
                                    .map(event => {
                                        return <div className="game__datetime" key={`gameEvent--${event.id}`}>
                                            <HumanDate date={event.date} /> @ {event.time}
                                        </div>
                                    })
                            }
                            {
                                game.owner
                                    ? <div className="game__edit">
                                        <button className="btn btn-3"
                                            onClick={e => history.push(`/games/${game.id}/edit`)}
                                        >Edit</button>
                                    </div>
                                    : ""
                            }

                        </section>
                    })
                }
            </article>
        </>
    )
}