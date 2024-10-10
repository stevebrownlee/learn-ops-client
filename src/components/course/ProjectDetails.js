import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory, useParams } from "react-router-dom/cjs/react-router-dom.min.js"

import { Button } from "@radix-ui/themes"
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
            <div><strong>Name:</strong> {project.name}</div>
            <div><strong>Type:</strong> {project.is_group_project ? "Group project" : "Book project"}</div>
            {
                project.is_group_project ?
                    <>
                        <div>
                            <strong>Client side template URL</strong>:
                            <a href={project.client_template_url} target="_blank">{project.client_template_url}</a>
                        </div>
                        {
                            project.api_template_url ?
                                <div>
                                    <strong>API template URL</strong>:
                                    <a href={project.api_template_url} target="_blank">{project.api_template_url}</a>
                                </div>
                                : ""
                        }
                    </>
                    : ""
            }

        </div>

        <div className="project__footer">
            <Button style={{ marginTop: "2rem", marginLeft: "auto" }} color="orange"
                onClick={() => {
                    history.push(`/projects/edit/${project.id}`)
                }}>Edit Project</Button>

            <Button style={{ margin: "2rem 0 0 1rem" }} color="crimson"
                onClick={() => {
                    deleteProject(project.id).then(() => history.push(`/books/${project.book.id}`))
                }}>Delete Project</Button>
        </div>
    </article>
}
