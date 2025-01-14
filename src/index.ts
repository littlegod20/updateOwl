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

app.message(/hello/, async ({ say }) => {
  try {
    say("Hello there");
  } catch (err) {
    console.log("err");
  }
});

const addStandupResponse = async ({
  teamId,
  userId,
  updates,
}: {
  teamId: string;
  userId: string;
  updates: {
    yesterday: string;
    today: string;
    blockers: string[];
  };
}) => {
  try {
    const docRef = await db.collection("standups").add({
      date: new Date().toISOString(),
      teamId,
      userId,
      updates,
    });
    console.log("Standup added with ID:", docRef.id);
  } catch (error) {
    console.error("Error adding standup:", error);
  }
};

const fetchStandups = async () => {
  try {
    const standups: object[] = [];
    const snapshot = await db.collection("standups").get();
    snapshot.forEach((doc) => {
      standups.push({ id: doc.id, ...doc.data() });
    });
    console.log(standups);
  } catch (error) {
    console.error("Error fetching standups:", error);
  }
};
fetchStandups();

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
