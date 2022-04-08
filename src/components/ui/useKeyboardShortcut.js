import { useRef } from "react"

const useKeyboardShortcut = (activatorKey, handler=()=>{}, state={}) => {
    const stateRef = useRef()
    const acceptedKeys = new Set(['\\', activatorKey])
    stateRef.current = {
        ready: false,
        state: state
    }

    const keyLogger = (e) => {
        if (acceptedKeys.has(e.key)) {
            if (e.key === "\\") {
                stateRef.current.ready = true
            }
            else if (stateRef.current.ready && e.key === activatorKey) {
                stateRef.current.ready = false
                handler(stateRef.current.state)
            }
            else {
                stateRef.current.ready = false
            }
        } else {
            stateRef.current.ready = false
        }
    }

    return keyLogger
}

export default useKeyboardShortcut
