import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"


const useSimpleAuth = () => {
    const isAuthenticated = () => sessionStorage.getItem("nss_token") !== null

    const getProfile = (token=null, cohort=null, validate=null) => {
        let url = `${Settings.apiHost}/profile`

        if (cohort !== null) {
            url = `${url}?cohort=${cohort}&validate=${validate}`
        }

        if (token === null) {
            token = getCurrentUser().token
        }

        return fetchIt(url, {token})
            .then(profile => {
                storeCurrentUser(token, profile)

                try {
                    const activeCohort = profile?.person?.active_cohort
                        ? profile.person.active_cohort
                        : profile.cohorts[0].id

                    localStorage.setItem("activeCohort", activeCohort)

                } catch (error) {
                    localStorage.setItem("activeCohort", null)

                }
            })
    }

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
        sessionStorage.removeItem("nss_token")
    }

    const storeCurrentUser = (token, profile) => {
        const baseUserObject = JSON.stringify({ token, profile })
        let encoded = Buffer.from(baseUserObject).toString("base64")
        sessionStorage.setItem("nss_token", encoded)
    }

    const getCurrentUser = () => {
        const encoded = sessionStorage.getItem("nss_token")
        if (encoded) {
            const unencoded = Buffer.from(encoded, "base64").toString("utf8")
            const parsed = JSON.parse(unencoded)
            const bare = Object.assign(Object.create(null), parsed)
            return bare
        }
        return {}
    }

    return {
        isAuthenticated, logout, login, register,
        getCurrentUser, storeCurrentUser, getProfile
    }
}

export default useSimpleAuth
