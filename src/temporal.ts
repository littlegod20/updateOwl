// sending a message with a button

import { app } from "./bot.config";

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
