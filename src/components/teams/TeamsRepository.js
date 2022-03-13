import { fetchIt } from "../utils/Fetch"

export const TeamsRepository = () => {
    return {
        createSlackChannel: (channel) => {
            fetchIt("https://slack.com/api/conversations.create", {
                method: "POST",
                body: {
                    "name": channel
                },
                token: "Bearer xoxb-3512897936-3228554398613-AK1iyYlCcaf5VsU9XsggZvQ3"
            })
        }
    }
}