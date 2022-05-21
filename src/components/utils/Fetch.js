export const fetchIt = (url, kwargs = { method: "GET", body: null, token: null }) => {
    const options = {
        headers: {}
    }

    options.method = kwargs.method ?? "GET"

    if ("token" in kwargs && kwargs.token) {
        options.headers.Authorization = `Token ${kwargs.token}`
    }
    else {
        try {
            const encoded = sessionStorage.getItem("nss_token")
            const unencoded = Buffer.from(encoded, "base64").toString("utf8")
            const parsed = JSON.parse(unencoded)
            const bare = Object.assign(Object.create(null), parsed)

            options.headers.Authorization = `Token ${bare.token}`

        } catch (error) {
            options.headers.Authorization = `Token none`
        }
    }

    let theFetch = null
    switch (options.method) {
        case "POST":
            options.body = kwargs.body
            options.headers["Content-Type"] = "application/json"
            theFetch = fetch(url, options).then(r => r.json())
            break;
        case "PUT":
            options.body = kwargs.body
            options.headers["Content-Type"] = "application/json"
            theFetch = fetch(url, options)
            break;
        case "DELETE":
            if (kwargs.body !== null) {
                options.headers["Content-Type"] = "application/json"
                options.body = kwargs.body
            }
            theFetch = fetch(url, options)
            break;
        default:
            theFetch = fetch(url, options).then(r => r.json())
            break;
    }

    return theFetch
}
