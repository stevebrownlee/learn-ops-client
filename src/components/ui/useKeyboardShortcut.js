import { useCallback, useEffect, useState } from "react"

const useKeyboardShortcut = (activatorKey, handler) => {
    const acceptedKeys = new Set(['\\', activatorKey])
    const [keyBuffer, updateKeyBuffer] = useState([])
    const [currentKey, updateCurrentKey] = useState('')

    const keyLogger = useCallback((e) => {
        if (acceptedKeys.has(e.key)) {
            updateCurrentKey(e.key)
        }
        else {
            updateKeyBuffer([])
        }
    }, [])

    useEffect(() => {
        if (acceptedKeys.has(currentKey)) {
            if (currentKey === "\\") {
                updateKeyBuffer([currentKey])
            }
            else if (keyBuffer.length === 1) {
                const copy = [...keyBuffer]
                copy.push(currentKey)
                updateKeyBuffer(copy)
            }
            else if (keyBuffer.length === 2) {
                updateKeyBuffer([])
            }
            updateCurrentKey('')
        }
    }, [currentKey])

    useEffect(() => {
        if (keyBuffer.length === 2 && keyBuffer[1] === activatorKey) {
            updateKeyBuffer([])
            handler()
        }
    }, [keyBuffer])


    return keyLogger
}

export default useKeyboardShortcut
