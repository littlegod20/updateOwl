import { WebClient } from "@slack/web-api";


export const publishStandupView = async (client: WebClient, user_id: string) => {
    try {
        // Update the App Home with standup data
        await client.views.publish({
            user_id: user_id,  // Corrected from user_id to user
            view: {
            type: "home",
            blocks: [
                {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "📋 *Today's Standup Updates:*",
                },
                },
                {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: "- *Yesterday:* Fixed bugs\n- *Today:* Implement API\n- *Blockers:* Waiting for review",
                },
                },
                {
                type: "actions",
                elements: [
                    {
                    type: "button",
                    text: {
                        type: "plain_text",
                        text: "Go Back",
                        emoji: true,
                    },
                    action_id: "go_back",
                    },
                ],
                },
            ],
            },
        });  // Added the closing parenthesis here
  
      console.log("✅ Standup View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Standup View:", error);
    }
  };