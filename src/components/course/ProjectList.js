import { useHistory } from "react-router-dom"
import React, { useContext, useEffect, useState } from "react"
import { CourseContext } from "./CourseProvider"
import "./Projects.css"
import { DeleteIcon } from "../../svgs/DeleteIcon"


export const ProjectList = () => {
    const { getProjects, deleteProject } = useContext(CourseContext)
    const [projects, setProjects] = useState([])
    const history = useHistory()

    useEffect(() => {
        getProjects().then(setProjects)
    }, [])

    return <article className="container--projectList">
        <button className="button button--isi button--border-thick button--round-l button--size-s"
            onClick={() => history.push("/projects/new")}>
            <i className="button__icon icon icon-book"></i>
            <span>Create Project</span>
        </button>
        <div className="projects">

            {
                projects.map(project => {
                    return <section key={`project--${project.id}`} className="project">
                        <h3 className="project__header">{project.name}</h3>

                        <div className="project__info">
                            <div>{project.course.name}</div>
                            <div>{project.book.name}</div>
                        </div>

                        <footer className="project__footer">
                            <DeleteIcon clickFunction={() => deleteProject(project.id)
                                .then(getProjects)
                                .then(setProjects)} />
                        </footer>
                    </section>
                })
            }
        </div>
    </article>
}
