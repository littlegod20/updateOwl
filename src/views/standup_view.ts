import { WebClient, Block, KnownBlock } from "@slack/web-api";
// import {  } from "@slack/bolt";
import { findQuestionText } from "../helpers/findQuestionText";
import { response } from "express";


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

  interface IResponse{
    answer: string; 
    questionId: string;      // Unique identifier for the question
    questionType: string;    // Type of the question (e.g., "rating")
  }
  
  interface Standup{
    response: IResponse[]          // The answer provided by the user
    responseTime: string;     // Timestamp of when the response was given
    userId: string;
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

    console.log(`Filtered STandup Blocks\n`)
    filteredStandups.map((standup) => console.log(standup));
  
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
    let responseBlocks: (Block | KnownBlock)[] = [];

    const getDate = (timestamp:string) => {
      const milliseconds = Math.floor(parseFloat(timestamp) * 1000);
      const date = new Date(milliseconds);

      return date.toISOString();
    }

    for (const response of standup.responses) {
      console.log("Standup.response", response);
      
      // Context block with user and timestamp
      responseBlocks.push({
        type: "context",
        elements: [
          {
            type: "image",
            image_url: `https://slack.com/api/users.profile.get?user=${response.userId}`,
            alt_text: "user avatar"
          },
          {
            type: "mrkdwn",
            text: `<@${response.userId}> • ${getDate(standup.messageTs).split("T")[0]}`
          }
        ]
      });

      // Process each user response
      for (const userResponse of response.response) {
        console.log("User Response: ", userResponse);
        
        // Process each response
        const questionText = await findQuestionText(userResponse.questionId);

        // Push the section after getting the question text
        responseBlocks.push({
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${questionText}*\n${userResponse.answer}`
          }
        });
      }

      // Divider between standup entries
      responseBlocks.push({
        type: "divider"
      });
    }

    console.log("ResponseBlocks", responseBlocks);
    return responseBlocks;
  };

  // Process all standups asynchronously
  const processedStandups = await Promise.all(filteredResponses.map(processStandupResponses));
  
  // Flatten the processed standups
  return processedStandups.flat();
};
