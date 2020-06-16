import ChatClient from "twitch-chat-client";
import TwitchClient, { User } from "twitch";
import { readFileSync } from "fs";
import dotenv from "dotenv";

dotenv.config();

const accessToken = process.env.TWITCH_ACCESS_TOKEN;
const clientId = process.env.TWITCH_CLIENT_ID;
const twitchClient = TwitchClient.withCredentials(clientId, accessToken);

const chatClient = ChatClient.forTwitchClient(twitchClient);
chatClient.onRegister(() => chatClient.join(process.env.CHANNEL));
// listen to more events...
chatClient.connect().then();

const ban = (i: number, u: string, channel: string) => {
  setTimeout(() => {
    chatClient.say(channel, "/ban " + u);
    console.log(u);
  }, 3000 * i);
};

chatClient.onPrivmsg((channel, user, message) => {
  if (message === "!massban") {
    const rawdata = readFileSync("banned.json");
    const users: string[] = JSON.parse(rawdata.toString());
    console.log(users);
    for (let i = 0; i < users.length; i++) {
      ban(i, users[i], channel);
    }
  }
});
