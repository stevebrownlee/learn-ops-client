export const stateSync  = (event, state, setter) => {
    const copy = { ...state }

    const newValue = {
        "string": event.target.value,
        "boolean": event.target.checked ? true : false,
        "number": parseInt(event.target.value)
    }[event.target.attributes.controltype.value]

    copy[event.target.id] = newValue
    setter(copy)
}

export const stateCheckboxSync  = (state, setter, value) => {
    const copy = new Set(state)
    copy.has(value) ? copy.delete(value) : copy.add(value)
    setter(copy)
}
