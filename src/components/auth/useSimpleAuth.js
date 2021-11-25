import Settings from "../Settings"


const useSimpleAuth = () => {
    const isAuthenticated = () => localStorage.getItem("nss_token") !== null
        || sessionStorage.getItem("nss_token") !== null


    const register = (user) => {
        return fetch(`${Settings.remoteURL}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        })
            .then(_ => _.json())
    }

    const login = (username, password) => {
        return fetch(`${Settings.apiHost}/accounts/verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify({ username, password })
        })
            .then(res => res.json())
    }

    const logout = () => {
        console.log("*** Toggling auth state and removing credentials ***")
        localStorage.removeItem("nss_token")
        sessionStorage.removeItem("nss_token")
    }

    const storeCurrentUser = (token, profile) => {
        const baseUserObject = JSON.stringify({ token, profile })
        let encoded = Buffer.from(baseUserObject).toString("base64")
        localStorage.setItem("nss_token", encoded)
    }

    const getCurrentUser = () => {
        const encoded = localStorage.getItem("nss_token")
        if (encoded) {
            const unencoded = Buffer.from(encoded, "base64").toString("utf8")
            const parsed = JSON.parse(unencoded)
            const bare = Object.assign(Object.create(null), parsed)
            return bare
        }
        return {}
    }

    return { isAuthenticated, logout, login, register, getCurrentUser, storeCurrentUser }
}

export default useSimpleAuth
