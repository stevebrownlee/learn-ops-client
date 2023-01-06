import React, { useContext, useEffect, useState } from "react"
import { PeopleContext } from "../people/PeopleProvider"
import { CohortContext } from "../cohorts/CohortProvider"

export const TagDialog = ({ toggleTags }) => {
    const {
        activeStudent, getCohortStudents, tags, tagStudent,
        getAllTags, createNewTag, deleteTag
    } = useContext(PeopleContext)
    const { activeCohort } = useContext(CohortContext)
    const [tag, setTag] = useState("")

    useEffect(() => {
        getAllTags()
    }, [])

    return <dialog id="dialog--tags" className="dialog--tags">
        <section className="tagButtons">
            {
                tags.map(tag => {
                    return <button key={`tag--${tag.id}`}
                        onClick={(e) => {
                            e.stopPropagation()
                            tagStudent(activeStudent.id, tag.id)
                                .then(() => {
                                    getCohortStudents(activeCohort)
                                    toggleTags()
                                })
                        }}
                        className="button button--isi button--border-thick button--round-m button--size-xs"
                    ><i className="button__icon icon icon-tag"></i>
                        <span>{tag.name}</span>
                        <span className="delete"
                            onClick={e => {
                                e.stopPropagation()
                                deleteTag(tag.id).then(() => {
                                    getAllTags()
                                    getCohortStudents(activeCohort)
                                })
                            }}
                        >&times;</span>
                    </button>
                })
            }
        </section>

        <section className="tagDialog__newTag">
            New tag: <input type="text" value={tag}
                onChange={(e) => {
                    setTag(e.target.value)
                }}
                onKeyUp={(e) => {
                    if (e.key === "Enter") {
                        createNewTag(tag)
                            .then(tag => {
                                setTag("")

                                return tagStudent(activeStudent.id, tag.id)
                                    .then(() => {
                                        getCohortStudents(activeCohort)
                                        toggleTags()
                                    })
                            })
                            .then(getAllTags)
                    }
                }}
                placeholder="New tag name" />
        </section>

        <button className="fakeLink" style={{
            position: "absolute",
            top: "0.33em",
            right: "0.5em",
            fontSize: "0.75rem"
        }}
            id="closeBtn"
            onClick={() => toggleTags()}>[ close ]</button>
    </dialog>
}
