import simpleAuth from '../auth/simpleAuth.js'

export const fetchIt = (url, kwargs = { method: "GET", body: null, token: null, autoHandleResponse: true }) => {
    const { getCurrentUser } = simpleAuth()
    const options = {
        headers: {}
    }

    options.method = kwargs.method ?? "GET"
    const autoHandleResponse = kwargs.autoHandleResponse ?? true

    if ("token" in kwargs && kwargs.token) {
        options.headers.Authorization = `Token ${kwargs.token}`
    }
    else {
        try {
            const bare = getCurrentUser()
            options.headers.Authorization = `Token ${bare.token}`
        } catch (error) {
            options.headers.Authorization = `Token none`
        }
    }

    let handleResponse = res => {
        if (res.status === 200 || res.status === 201) {
            if (res.headers.get("content-type") === "application/json") {
                return res.json()
            }
        }
        if (res.status === 204) {
            return { status: 204 }
        }

        if (res.headers.get("content-type") === "application/json") {
            return res.json().then((json) => {
                if ("reason" in json || "message" in json) {
                    const message = json.reason || json.message
                    throw new Error(message)
                }
                throw new Error(JSON.stringify(json))
            })
        }
    }

    let theFetch = null

    switch (options.method) {
        case "POST":
            options.body = kwargs.body
            options.headers["Content-Type"] = "application/json"
            break;
        case "PUT":
            options.body = kwargs.body
            options.headers["Content-Type"] = "application/json"
            break;
        case "DELETE":
            if (kwargs.body !== null) {
                options.headers["Content-Type"] = "application/json"
                options.body = kwargs.body
            }
            break;
        default:
            break;
    }
    if (autoHandleResponse) {
        theFetch = fetch(url, options).then(handleResponse)
    }
    else {
        theFetch = fetch(url, options)
    }

    return theFetch
}
