import React, { useEffect, useState } from "react"
import useSimpleAuth from "../auth/useSimpleAuth"
import "./Repos.css"

export const Repos = () => {
    const [repos, buildRepos] = useState([])
    const { getCurrentUser } = useSimpleAuth()
    const user = getCurrentUser()

    useEffect(() => {
        fetch(`${user.profile.repos}?sort=updated&direction=desc`)
            .then(response => response.json())
            .then(buildRepos)
    }, [])

    return <div className="dashboard--student">
        <h1>Your Repositories</h1>
        <article className="repos">
            {
                repos.map(repo => {
                    return <div className="repo" key={`repo--${repo.id}`}>
                        <div className="repo__name"><a target="_blank" href={repo.html_url}>{repo.name}</a></div>
                        <div className="repo__description">{repo.description}</div>
                        <div className="repo__date">Last updated on {new Date(repo.updated_at).toLocaleDateString()}</div>
                    </div>
                })
            }
        </article>
    </div>
}