const keyboardShortcut = (contextKey, activatorKey, handler = () => { }, state = {}) => {
    const keyMap = new Set([contextKey, activatorKey])
    const internalState = {
        ready: false,
        state: state
    }

    const keyLogger = (e) => {
        if (keyMap.has(e.key)) {
            if (e.key === contextKey) {
                internalState.ready = true
                setTimeout(() => {
                    internalState.ready = false
                }, 1000);
            }
            else if (internalState.ready && e.key === activatorKey) {
                internalState.ready = false
                handler(internalState.state)
            }
            else {
                internalState.ready = false
            }
        } else {
            internalState.ready = false
        }
    }

    return keyLogger
}

export default keyboardShortcut
