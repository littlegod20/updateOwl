// sending a message with a button

import { app } from "./config/bot.config";

// Sending a message with an interactive button
app.message("hello", async ({ message, say }) => {
  try {
    await say({
      text: "Hello! You can manage your teams here.",
      attachments: [
        {
          text: "Manage your teams below:",
          fallback: "Add Team Button",
          callback_id: "add_team_button",
          actions: [
            {
              name: "add_team",
              text: "Add Team",
              type: "button",
              value: "open_add_team_modal",
            },
          ],
        },
      ],
    });
  } catch (err) {
    console.log("Error sending message with button:", err);
  }
});

// const fetchStandups = async () => {
//   try {
//     const standups: object[] = [];
//     const snapshot = await db.collection("standups").get();
//     snapshot.forEach((doc) => {
//       standups.push({ id: doc.id, ...doc.data() });
//     });
//     console.log(standups);
//   } catch (error) {
//     console.error("Error fetching standups:", error);
//   }
// };
// fetchStandups();

// const addStandupResponse = async ({
//   teamId,
//   userId,
//   updates,
// }: {
//   teamId: string;
//   userId: string;
//   updates: {
//     yesterday: string;
//     today: string;
//     blockers: string[];
//   };
// }) => {
//   try {
//     const docRef = await db.collection("standups").add({
//       date: new Date().toISOString(),
//       teamId,
//       userId,
//       updates,
//     });
//     console.log("Standup added with ID:", docRef.id);
//   } catch (error) {
//     console.error("Error adding standup:", error);
//   }
// };

// addStandupResponse({
//   userId: "U01ABCD1234",
//   teamId: "team123",
//   updates: {
//     yesterday: "Worked on project setup",
//     today: "Continue with API development",
//     blockers: ["Waiting for code review"],
//   },
// });
