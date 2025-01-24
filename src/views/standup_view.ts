import { WebClient, Block, KnownBlock } from "@slack/web-api";
// import {  } from "@slack/bolt";
import { findQuestionText } from "../helpers/findQuestionText";


export const publishStandupView = async (client: WebClient, user_id: string) => {
    try {
      const sampleStandupStats: StandupStats = {
        teamId: "T12345678",
        teamName: "Development Team",
        totalExpected: 10,
        totalResponded: 7,
        responseRate: 70, // 70%
        averageResponseTime: 15, // 15 minutes
        mostActiveMembers: ["U12345678", "U23456789", "U34567890"], // User IDs of the top 3 members
        pendingResponses: 3,
        totalQuestions: 5,
        averageAnswerLength: 50 // Average answer length in characters
      };    

        const statsBlocks = updateStatsOverview(sampleStandupStats);

        // Update the App Home with standup data
        await client.views.publish({
            user_id: user_id,  // Corrected from user_id to user
            view: {
            type: "home",
            blocks: await createStandupsDashboard(statsBlocks)
            },
        });  // Added the closing parenthesis here
  
      console.log("✅ Standup View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Standup View:", error);
    }
  };



  interface StandupStats {
    teamId: string;
    teamName: string;
    totalExpected: number;
    totalResponded: number;
    responseRate: number;
    averageResponseTime: number; // in minutes
    mostActiveMembers: string[]; // top 3 most responsive members
    pendingResponses: number;
    totalQuestions: number;
    averageAnswerLength: number;
  }
  
interface Standup{
  question: string;
  answer: string;
}
    
  interface StandupResponse {
    teamId: string;
    userId?: string;
    messageTs: string; // ISO 8601 format for date-time
    responses: Standup[]; // Array of response objects
  }
    


  export const createStandupsDashboard = async (
    statsBlocks?: (Block | KnownBlock)[] | [],
    filteredStandups?: (Block | KnownBlock)[] | []
  ): Promise<(Block | KnownBlock)[]> => {

    // Handle undefined statsBlocks
    if (statsBlocks === undefined) {
      statsBlocks = [];
    }

    // Handle undefined statsBlocks
    if (filteredStandups === undefined) {
      filteredStandups = [];
    }
  
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
      {
        "type": "actions",
        "elements": [
              {
                  "type": "conversations_select",
                  "placeholder": {
                      "type": "plain_text",
                      "text": "Select a conversation",
                      "emoji": true
                  },
                  "initial_conversation": "G12345678",
                  "action_id": "actionId-0"
              },
              {
                  "type": "channels_select",
                  "placeholder": {
                      "type": "plain_text",
                      "text": "Select a channel",
                      "emoji": true
                  },
                  "initial_channel": "C12345678",
                  "action_id": "actionId-2"
              },
          ]
      },
      ...statsBlocks,
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
            type: "users_select",
            placeholder: {
                "type": "plain_text",
                "text": "Select a user",
                "emoji": true
            },
            initial_user: "U12345678",
            action_id: "filter_by_user"
          },
          {
            type: "conversations_select",
            placeholder: {
                type: "plain_text",
                text: "Select a channel",
                emoji: true
            },
            initial_conversation: "G12345678",
            action_id: "filter_by_channel"
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
      // Team's Responses
      ...filteredStandups ,
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



  // Function to update Stats Overview section
export const updateStatsOverview = (stats?: StandupStats): (Block | KnownBlock)[] => {
  if (!stats) {
    return [{
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*📊 No Stats Found*\nUnable to retrieve team statistics at this time."
      }
    }];
  }

  return [{
    type: "section",
    fields: [
      {
        type: "mrkdwn",
        text: `*Response Rate*\n${stats.teamName}: ${stats.responseRate}% (${stats.totalResponded}/${stats.totalExpected})`
      },
      {
        type: "mrkdwn",
        text: `*Pending Responses*\n${stats.teamName}: ${stats.pendingResponses} members`
      },
      {
        type: "mrkdwn",
        text: `*Avg Response Time*\n${stats.averageResponseTime} mins`
      },
      {
        type: "mrkdwn",
        text: `*Most Active Members*\n${stats.mostActiveMembers.map(m => `<@${m}>`).join(', ')}`
      },
      {
        type: "mrkdwn",
        text: `*Total Questions*\n${stats.totalQuestions}`
      },
      {
        type: "mrkdwn",
        text: `*Avg Answer Length*\n${stats.averageAnswerLength} chars`
      }
    ]
  }];
};

// Function to update Team's Responses section
export const updateTeamResponses = async (filteredResponses?: StandupResponse[]): Promise<(Block | KnownBlock)[]> => {
  if (!filteredResponses || filteredResponses.length === 0) {
    return [{
      type: "section",
      text: {
        type: "mrkdwn",
        text: "*🔍 No Results Found*\nNo standups match the current filter criteria."
      }
    }];
  }

  const processStandupResponses = async (standup: StandupResponse): Promise<(Block | KnownBlock)[]> => {
    const responseBlocks: (Block | KnownBlock)[] = [];

    // Context block with user and timestamp
    responseBlocks.push({
      type: "context",
      elements: [
        {
          type: "image",
          image_url: `https://slack.com/api/users.profile.get?user=${standup.userId}`,
          alt_text: "user avatar"
        },
        {
          type: "mrkdwn",
          text: `<@${standup.userId}> • ${new Date(standup.messageTs).toLocaleTimeString()}`
        }
      ]
    });

    // Process each response
    for (const item of standup.responses) {
      const questionText = await findQuestionText(item.question);
      responseBlocks.push({
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*${questionText}*\n${item.answer}`
        }
      });
    }

    // Divider between standup entries
    responseBlocks.push({
      type: "divider"
    });

    return responseBlocks;
  };

  // Process all standups asynchronously
  const processedStandups = await Promise.all(filteredResponses.map(processStandupResponses));
  
  // Flatten the processed standups
  return processedStandups.flat();
};