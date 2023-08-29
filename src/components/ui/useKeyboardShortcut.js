import { useRef } from "react"

const useKeyboardShortcut = (contextKey, activatorKey, handler = () => { }, state = {}) => {
    const stateRef = useRef()
    const keyMap = new Set([contextKey, activatorKey])
    stateRef.current = {
        ready: false,
        state: state
    }

    const keyLogger = (e) => {
        if (keyMap.has(e.key)) {
            if (e.key === contextKey) {
                stateRef.current.ready = true
                setTimeout(() => {
                    stateRef.current.ready = false
                }, 1000);
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
