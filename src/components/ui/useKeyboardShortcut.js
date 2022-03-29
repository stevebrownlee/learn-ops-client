import { useRef } from "react"

const useKeyboardShortcut = (activatorKey, handler=()=>{}, state={}) => {
    const acceptedKeys = new Set(['\\', activatorKey])
    const stateRef = useRef()
    stateRef.current = {
        ready: false,
        state: state
    }

    const keyLogger = (e) => {
        if (acceptedKeys.has(e.key)) {
            if (e.key === "\\") {
                console.log(activatorKey, "Setting to ready")
                stateRef.current.ready = true
            }
            else if (stateRef.current.ready && e.key === activatorKey) {
                console.log(activatorKey, "Activated")
                stateRef.current.ready = false
                handler(stateRef.current.state)
            }
            else {
                stateRef.current.ready = false
            }
        }
    }

    return keyLogger
}

export default useKeyboardShortcut
