import { useState } from "react"

const useModal = (selector) => {
    const [modalIsOpen, setIsOpen] = useState(false)

    const toggleDialog = () => {
        setIsOpen(!modalIsOpen)
        const element = document.querySelector(`${selector}`)

        if (modalIsOpen) {
            element.removeAttribute("open")
        } else {
            element.setAttribute("open", true)
            element.focus()
        }
    }

    return { toggleDialog, modalIsOpen }
}

export default useModal
