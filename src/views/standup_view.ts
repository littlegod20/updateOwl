import { WebClient, Block, KnownBlock } from "@slack/web-api";
// import {  } from "@slack/bolt";


export const publishStandupView = async (client: WebClient, user_id: string) => {
    try {
        const stats = {
            totalExpected: 8,
            totalResponded: 2,
            responseRate: 25,
            totalBlockers: 1,
            pendingResponses: 6
          };
          
          const responses = [
            {
                userId: "U12345678",
                responses: [
                    { question: "What did you do today?", answer: "Worked on the project and attended meetings." },
                    { question: "Any blockers?", answer: "Need access to the new system." }
                ],
                timestamp: "2025-01-21T09:00:00Z",
                hasBlocker: true
            },
            {
                userId: "U23456789",
                responses: [
                    { question: "What did you do today?", answer: "Completed the task assigned yesterday." },
                    { question: "Any blockers?", answer: "No blockers." }
                ],
                timestamp: "2025-01-21T09:05:00Z",
                hasBlocker: false
            },
            {
                userId: "U34567890",
                responses: [
                    { question: "What did you do today?", answer: "Reviewed the code and pushed changes." },
                    { question: "Any blockers?", answer: "Waiting for feedback from the team." }
                ],
                timestamp: "2025-01-21T09:10:00Z",
                hasBlocker: true
            },
            {
                userId: "U45678901",
                responses: [
                    { question: "What did you do today?", answer: "Attended a client meeting." },
                    { question: "Any blockers?", answer: "No blockers." }
                ],
                timestamp: "2025-01-21T09:15:00Z",
                hasBlocker: false
            },
            {
                userId: "U56789012",
                responses: [
                    { question: "What did you do today?", answer: "Worked on documentation." },
                    { question: "Any blockers?", answer: "Need clarification on requirements." }
                ],
                timestamp: "2025-01-21T09:20:00Z",
                hasBlocker: true
            }
        ];
        

        // Update the App Home with standup data
        await client.views.publish({
            user_id: user_id,  // Corrected from user_id to user
            view: {
            type: "home",
            blocks: createStandupsDashboard(stats, responses)
            },
        });  // Added the closing parenthesis here
  
      console.log("✅ Standup View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Standup View:", error);
    }
  };



  interface StandupStats {
    totalExpected: number;
    totalResponded: number;
    responseRate: number;
    totalBlockers: number;
    pendingResponses: number;
  }
  
  interface StandupResponse {
    userId: string;
    responses: { question: string; answer: string }[];
    timestamp: string;
    hasBlocker: boolean;
  }
  
export const createStandupsDashboard = (
    stats: StandupStats,
    todaysResponses: StandupResponse[],
  ): (Block | KnownBlock)[] => {
    return [
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
      // Header Section
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "📊 Standups Dashboard",
          emoji: true
        }
      },
      // Stats Overview
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Response Rate*\n${stats.responseRate}% (${stats.totalResponded}/${stats.totalExpected})`
          },
          {
            type: "mrkdwn",
            text: `*Blockers*\n${stats.totalBlockers} reported`
          },
          {
            type: "mrkdwn",
            text: `*Pending*\n${stats.pendingResponses} responses`
          }
        ]
      },
      {
        type: "divider"
      },
      // Filter Controls
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*🔍 Filter Standups*"
        },
        accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Export Filtered Standups",
              emoji: true
            },
            style: "primary",
            action_id: "export_standups"
          }
      },
      {
        type: "actions",
        elements: [
          {
            type: "external_select",
            placeholder: {
              type: "plain_text",
              text: "Filter by user",
              emoji: true
            },
            action_id: "filter_by_user"
          },
          {
            type: "external_select",
            placeholder: {
              type: "plain_text",
              text: "Filter by question",
              emoji: true
            },
            action_id: "filter_by_question"
          },
          {
            type: "datepicker",
            placeholder: {
              type: "plain_text",
              text: "Filter by date",
              emoji: true
            },
            action_id: "filter_by_date"
          },
          {
            type: "button",
            action_id: "apply_filters",
            text: {
              type: "plain_text",
              text: "Apply Filters",
              emoji: true,
            },
            style: "primary",
          },
        ]
      },
      {
        type: "divider"
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*Today's Standups*"
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Export Standups",
            emoji: true
          },
          style: "primary",
          action_id: "export_standups"
        }
      },
      {
        type: "divider"
      },
      // Today's Responses
      ...todaysResponses.flatMap((response): (Block | KnownBlock)[] => [
        {
          type: "context",
          elements: [
            {
              type: "image",
              image_url: `https://slack.com/api/users.profile.get?user=${response.userId}`,
              alt_text: "user avatar"
            },
            {
              type: "mrkdwn",
              text: `<@${response.userId}> • ${new Date(response.timestamp).toLocaleTimeString()}`
            },
            {
              type: "mrkdwn",
              text: response.hasBlocker ? "🚫 *Has Blockers*" : "✅ No Blockers"
            }
          ]
        },
        ...response.responses.map((item): Block | KnownBlock => ({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${item.question}*\n${item.answer}`
          }
        })),
        {
          type: "divider"
        }
      ]),
      // Pending Responses Section
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*🕐 Pending Responses*"
        }
      },
      {
        type: "context",
        elements: [
          {
            type: "mrkdwn",
            text: `Outstanding responses: <@user1>, <@user2>, <@user3>`
          }
        ]
      }
    ];
  };