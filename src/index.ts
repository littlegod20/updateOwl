import { App, LogLevel } from "@slack/bolt";
import db from "./services/database";
import dotenv from "dotenv";

dotenv.config();




const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN as string,
  // logLevel: LogLevel.DEBUG,
});

app.message(/hello/i, async ({ say }) => {
  try {
    say("Hello there");
  } catch (err) {
    console.log("err");
  }
});


// addStandupResponse({
//   userId: "U01ABCD1234",
//   teamId: "team123",
//   updates: {
//     yesterday: "Worked on project setup",
//     today: "Continue with API development",
//     blockers: ["Waiting for code review"],
//   },
// });


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Bolt app is running!");
})();
