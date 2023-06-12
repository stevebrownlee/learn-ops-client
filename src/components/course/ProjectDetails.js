import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { EditIcon } from "../../svgs/EditIcon"
import { CourseContext } from "./CourseProvider.js"
import { DeleteIcon } from "../../svgs/DeleteIcon.js"


export const ProjectDetails = () => {
    const [project, changeProjectState] = useState({
        id: 0,
        name: "",
        book: { name: "", id: 0 },
        course: { name: "", id: 0 }
    })
    const history = useHistory()
    const { projectId } = useParams()

    const {
        getProject, deleteProject
    } = useContext(CourseContext)

    useEffect(() => {
        getProject(projectId).then(changeProjectState)
    }, [projectId])

    return <article className="project--detail">
        <h1 className="project__header">
            <Link to={`/courses/${project.course.id}`}>{project.course.name}</Link>&nbsp; &gt; &nbsp;
            <Link to={`/books/${project.book.id}`}>{project.book.name}</Link>&nbsp; &gt; &nbsp;
            {project.name}
        </h1>
        <div className="project__info">
            <div>Name: {project.name}</div>
            <div>Position: {project.index}</div>
        </div>

        <div className="project__footer">
            <button style={{ marginTop: "2rem", marginLeft: "auto" }}
                className="isometric-button yellow"
                onClick={() => {
                    history.push(`/projects/edit/${project.id}`)
                }}>Edit Project</button>

            <button style={{ marginTop: "2rem" }}
                className="isometric-button red"
                onClick={() => {
                    deleteProject(project.id).then(() => history.push(`/books/${project.book.id}`))
                }}>Delete Project</button>
        </div>
    </article>
}
