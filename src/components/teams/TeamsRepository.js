import { WebClient, LogLevel } from "@slack/web-api"
import Settings from "../Settings"
import { fetchIt } from "../utils/Fetch"

export default {
    async createSlackChannel(channel) {
        // const client = new WebClient("xoxb-3512897936-3228554398613-lvcFOq98OfDe9cOL51ks7gYL", {
        //     // LogLevel can be imported and used to make debugging simpler
        //     logLevel: LogLevel.DEBUG
        // });

        // try {
        //     // Call the conversations.create method using the WebClient
        //     const result = await client.conversations.create({
        //         // The name of the conversation
        //         name: channel
        //     });

        //     // The result will include information like the ID of the conversation
        //     console.log(result);
        // }
        // catch (error) {
        //     console.error(error);
        // }

        // const details = {
        //     "name": channel.toLowerCase(),
        //     "token": "xoxb-3512897936-3228554398613-lvcFOq98OfDe9cOL51ks7gYL"
        // }
        // const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

        // const response = await fetch("https://slack.com/api/conversations.create", {
        //     method: "POST",
        //     body: formBody,
        //     headers: {
        //         "Content-Type": "application/x-www-form-urlencoded"
        //     }
        // })
        // const newChannel = await response.json()
        // console.log(newChannel)

        // return newChannel

        return fetchIt(`${Settings.apiHost}/slackchannels`, {
            method: "POST",
            body: JSON.stringify({ "name": channel.toLowerCase() })
        })
    }
}