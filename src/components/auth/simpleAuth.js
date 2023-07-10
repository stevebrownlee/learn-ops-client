import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"
import { Buffer } from 'buffer'


function lzw_encode(s) { var dict = {}; var data = (s + "").split(""); var out = []; var currChar; var phrase = data[0]; var code = 256; for (var i = 1; i < data.length; i++) { currChar = data[i]; if (dict[phrase + currChar] != null) { phrase += currChar; } else { out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)); dict[phrase + currChar] = code; code++; phrase = currChar; } } out.push(phrase.length > 1 ? dict[phrase] : phrase.charCodeAt(0)); for (var i = 0; i < out.length; i++) { out[i] = String.fromCharCode(out[i]); } return out.join(""); }
function lzw_decode(s) { var dict = {}; var data = (s + "").split(""); var currChar = data[0]; var oldPhrase = currChar; var out = [currChar]; var code = 256; var phrase; for (var i = 1; i < data.length; i++) { var currCode = data[i].charCodeAt(0); if (currCode < 256) { phrase = data[i]; } else { phrase = dict[currCode] ? dict[currCode] : (oldPhrase + currChar); } out.push(phrase); currChar = phrase.charAt(0); dict[code] = oldPhrase + currChar; code++; oldPhrase = phrase; } return out.join(""); }

const simpleAuth = () => {
    const isAuthenticated = () => sessionStorage.getItem("nss_token") !== null

    const getProfile = (token = null, cohort = null, validate = null, mimic = false) => {
        let url = `${Settings.apiHost}/profile`

        if (cohort !== null) {
            url = `${url}?cohort=${cohort}&validate=${validate}`
        }

        if (mimic) {
            url.includes("?") ? url = `${url}&mimic=true` : url = `${url}?mimic=true`
        }

        if (token === null) {
            token = getCurrentUser().token
        }

        return fetchIt(url, { token })
            .then(profile => {
                storeCurrentUser(token, profile)

                try {
                    let activeCohort = 0

                    if (profile && profile.person) {
                        activeCohort = profile.person.active_cohort
                    }

                    if (profile && profile.cohorts && profile.cohorts.length) {
                        activeCohort = profile.cohorts[0].id
                    }

                    if (profile && profile.current_cohort) {
                        activeCohort = profile.current_cohort.id
                    }

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

    const logout = () => sessionStorage.removeItem("nss_token")

    const storeCurrentUser = (token, profile) => {
        const baseUserObject = JSON.stringify({ profile, token  })
        let lzw = lzw_encode(baseUserObject)
        sessionStorage.setItem("nss_token", lzw)
    }

    const getCurrentUser = () => {
        const encoded = sessionStorage.getItem("nss_token")
        if (encoded) {
            const decoded = lzw_decode(encoded)
            const parsed = JSON.parse(decoded)
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

export default simpleAuth
