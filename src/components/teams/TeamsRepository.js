import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"

export default {
    async createSlackChannel(channel, studentIds) {
        return fetchIt(`${Settings.apiHost}/slackchannels`, {
            method: "POST",
            body: JSON.stringify({
                "name": channel.toLowerCase(),
                "students": studentIds
            })
        })
    }
}