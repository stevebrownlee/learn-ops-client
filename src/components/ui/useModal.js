import { useEffect, useState } from "react"

const useModal = (selector) => {
    const [modalIsOpen, setIsOpen] = useState(false)
    const toggleDialog = () => setTimeout(() => setIsOpen(!modalIsOpen), 100)
    return [ toggleDialog, modalIsOpen ]
}

export default useModal
