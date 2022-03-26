import { useState } from "react"

const useModal = (selector) => {

    const [modalIsOpen, setIsOpen] = useState(false)
    const [cssSelector, setSelector] = useState(selector)

    const toggleDialog = () => {
        setIsOpen(!modalIsOpen)

        if (modalIsOpen) {
            document.querySelector(`${cssSelector}`).removeAttribute("open")
        } else {
            document.querySelector(`${cssSelector}`).setAttribute("open", true)
        }
    }

    return { toggleDialog, modalIsOpen }
}

export default useModal
