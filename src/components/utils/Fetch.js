export const fetchIt = (url, kwargs = { method: "GET", body: null, token: null }) => {
    const options = {
        headers: {}
    }

    options.method = kwargs.method ?? "GET"

    if ("token" in kwargs) {
        options.headers.Authorization = `Token ${options.token}`
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


    switch (options.method) {
        case "POST":
        case "PUT":
            options.body = kwargs.body
            options.headers["Content-Type"] = "application/json"
            break;
        default:
            break;
    }

    return fetch(url, options).then(r => r.json())
}

export const request = {
    init(url) {
        this.options = {}
        this.options.headers = {}
        this.url = url
    },

    get(url) {
        this.init(url)
        this.options.method = "GET"
        return this.send()
    },

    post(url) {
        this.init(url)
        this.options.method = "POST"
        this.options.headers["Content-Type"] = "application/json"
        this.options.headers["Accept"] = "application/json"
        return this
    },

    put(url) {
        this.init(url)
        this.options.method = "PUT"
        this.options.headers = {
            "Content-Type": "application/json"
        }
        return this
    },

    delete(url) {
        this.init(url)
        this.options.method = "DELETE"
        return this.send()
    },

    withBody(body) {
        if (this.options.method === "POST" || this.options.method === "PUT") {
            this.options.body = JSON.stringify(body)
        }
        return this
    },

    async send() {
        const req = await fetch(this.url, this.options)
        const parsed = await req.json()
        return parsed
    }
}