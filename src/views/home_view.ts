import { WebClient } from "@slack/web-api";

// Function to publish the default App Home view
export const publishHomeView = async (client: WebClient,userName: string, user_id: string) => {
  try {
    // Publish the App Home view
    await client.views.publish({
      user_id: user_id,
      view: {
        type: "home",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*Hey, ${userName}! 🌟*\nHave a great day! These are your activities for this Wednesday.`,
            },
          },
          {
            type: "context",
            elements: [
              {
                type: "mrkdwn",
                text: "You're making some serious progress! You have completed *25%* of your activities.",
              },
            ],
          },
          {
            type: "divider",
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Create teams and manage members*",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "Manage Teams",
              },
              action_id: "manage_teams",
            },
          },
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: "*Daily Standups · 28% done*",
            },
            accessory: {
              type: "button",
              text: {
                type: "plain_text",
                text: "View Standups",
              },
              action_id: "view_standups",
            },
          },
        ],
      },
    });

    console.log("✅ App Home published successfully!");
  } catch (error) {
    console.error("❌ Error publishing App Home:", error);
  }
};
