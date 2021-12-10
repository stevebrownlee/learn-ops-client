export default {
    apiHost: process.env.REACT_APP_API_URI,
    redirect_uri: process.env.REACT_APP_ENV === "development" ? `${process.env.REACT_APP_API_URI}/auth/github/callback` : null
}