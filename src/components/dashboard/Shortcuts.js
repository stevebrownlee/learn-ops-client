import React from "react"

export const Shortcuts = () => {

    return <section className="shortcuts">
        <header className="shortcuts__header">Keyboard shortcuts</header>
        <div className="shortcut__row">
            <div>t g</div>
            <div className="shortcut__description">Toggle tags</div>
        </div>
        <div className="shortcut__row">
            <div>t a</div>
            <div className="shortcut__description">Toggle avatars</div>
        </div>
        <div className="shortcut__row">
            <div>s l</div>
            <div className="shortcut__description">Search learners</div>
        </div>
        <div className="shortcut__row">
            <div>s c</div>
            <div className="shortcut__description">Search cohorts</div>
        </div>
    </section>
}
