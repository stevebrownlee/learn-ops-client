
import React from "react"
import { Route } from "react-router-dom"
import { ProfileProvider } from "./auth/AuthProvider.js"
import { Profile } from "./auth/Profile.js"
import { EventForm } from "./event/EventForm"
import { EventList } from "./event/EventList.js"
import { EventProvider } from "./event/EventProvider.js"
import { GameForm } from "./game/GameForm.js"
import { GameList } from "./game/GameList.js"
import { GameProvider } from "./game/GameProvider.js"

export const ApplicationViews = () => {
    return <>
        <main style={{
            margin: "2rem 2rem",
            lineHeight: "1.75rem"
        }}>
            <GameProvider>
                <EventProvider>
                    <Route exact path="/games">
                        <GameList />
                    </Route>
                </EventProvider>
                <Route exact path="/games/new">
                    <GameForm/>
                </Route>
                <Route exact path="/games/:gameId(\d+)/edit">
                    <GameForm/>
                </Route>
            </GameProvider>

            <GameProvider>
                <EventProvider>
                    <Route exact path="/events/new">
                        <EventForm />
                    </Route>
                </EventProvider>
            </GameProvider>

            <ProfileProvider>
                <EventProvider>
                    <Route exact path="/profile">
                        <Profile />
                    </Route>
                </EventProvider>
            </ProfileProvider>

            <GameProvider>
                <EventProvider>
                    <Route exact path="/">
                        <GameList />
                    </Route>

                    <Route exact path="/events">
                        <EventList />
                    </Route>
                </EventProvider>
            </GameProvider>
        </main>
    </>
}
