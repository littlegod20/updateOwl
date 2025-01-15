import { App } from "@slack/bolt";
import dotenv from "dotenv";

dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN as string,
  // logLevel: LogLevel.DEBUG,
});

export { app };
