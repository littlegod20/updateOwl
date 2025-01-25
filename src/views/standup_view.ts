import { WebClient, Block, KnownBlock } from "@slack/web-api";
// import {  } from "@slack/bolt";
import { findQuestionText } from "../helpers/findQuestionText";
import { response } from "express";


export const publishStandupView = async (client: WebClient, user_id: string) => {
    try {
        // Fetch response blocks and stats dynamically
        const filteredResponsesBlocks = await updateTeamResponses(undefined);
        const statsBlocks = updateStatsOverview(undefined);

        // Update the App Home with standup data
        await client.views.publish({
            user_id: user_id,  // Corrected from user_id to user
            view: {
              type: "home",
              private_metadata: JSON.stringify({statsData: undefined, filteredResponses: undefined }),
              blocks: await createStandupsDashboard(statsBlocks, filteredResponsesBlocks)
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
                type: "datepicker",
                placeholder: {
                  type: "plain_text",
                  text: "Filter by date",
                  emoji: true
                },
                action_id: "actionId-1"
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
          text: "*💾 Generate Team Report*"
        }
      },
      {
        type: "actions",
        elements: [
          {
            type: "conversations_select",
            placeholder: {
                type: "plain_text",
                text: "Select a channel ",
                emoji: true
            },
            initial_conversation: "G12345678",
            action_id: "filter_by_team"
        },
        {
          type: "button",
          action_id: "generate_team_report",
          text: {
            type: "plain_text",
            text: "Generate Report",
            emoji: true,
          },
          style: "primary",
        },
        ]
      },
      // Pending Responses Section
  
    ];
  };



  // Function to update Stats Overview section

export const updateStatsOverview = (stats?: StandupStats): (Block | KnownBlock)[] => {
  if (!stats) {
    return [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: "*📊 No Stats Found*\nWe couldn't retrieve your team's statistics at this time. Please check back later or ensure standup data is being recorded.",
        },
      },
    ];
  }

  return [
    {
      type: "section",
      fields: [
        {
          type: "mrkdwn",
          text: `*🟢 Response Rate*\n*${stats.teamName}*: ${stats.responseRate}% (${stats.totalResponded}/${stats.totalExpected})`,
        },
        {
          type: "mrkdwn",
          text: `*⏳ Pending Responses*\n*${stats.teamName}*: ${stats.pendingResponses} members still need to respond.`,
        },
        {
          type: "mrkdwn",
          text: `*⏱️ Avg Response Time*\n${stats.averageResponseTime} mins per member.`,
        },
        {
          type: "mrkdwn",
          text: `*🏅 Most Active Members*\n${stats.mostActiveMembers.map((m) => `• <@${m}>`).join("\n")}`,
        },
        {
          type: "mrkdwn",
          text: `*❓ Total Questions*\n${stats.totalQuestions} standup questions.`,
        },
        {
          type: "mrkdwn",
          text: `*✍️ Avg Answer Length*\n${stats.averageAnswerLength} characters per answer.`,
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
        text: "🛠️ *Need Help?*\nReach out to your team lead if the stats don’t seem right, or visit our help center for troubleshooting tips.",
      },
    },
  ];
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
            image_url: `https://tse4.mm.bing.net/th?id=OIP.SAcV4rjQCseubnk32USHigHaHx&w=474&h=474&c=7`,
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
