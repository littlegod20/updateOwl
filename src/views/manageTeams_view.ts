import { WebClient } from "@slack/web-api";
import { addTeamModal } from "./addTeamModal";
import { getTeamByID } from "../functions/getTeamByID";
import { getAllTeams } from "../functions/getAllTeams";
import { standUpModal } from "./standUpModal";


interface Team {
    id: string;
    createdAt: string; // ISO 8601 date string
    members: string[]; // Array of user IDs
    admins: string[];
    name: string; // Team name
    teamId: string; // Unique team identifier
    teamstandupQuestions: StandupQuestion[]; // Array of standup questions
    // reminderTimes: string[]; // Array of reminder times as strings
    // standupDays: string[]; // Array of standup days as strings
    // standupTimes: string[]; // Array of standup times as strings
    timeZone: string; // Time zone string
}

interface StandupQuestion {
    id: string; // Unique identifier for the question set
    questions: string[]; // Array of questions
    reminderTimes: string[]; // Array of reminder times as strings
    standupDays: string[]; // Array of standup days as strings
    standupTimes: string[]; // Array of standup times as strings
}



export const publishManageTeamsView = async (client: WebClient, user_id: string) => {
    const allTeams = await getAllTeams();
    
    if(allTeams && allTeams.length){
        try {            
            // Create sections for each team in the allTeams array
            const teamSections = allTeams.map((team, index) => ({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `${team.name.toUpperCase()} TEAM.`
                },
                accessory: {
                    type: "overflow",
                    options: [
                        {
                            text: {
                                type: "plain_text",
                                text: "*Edit Team*",
                                emoji: true
                            },
                            value: `edit-${team.teamId}` // Unique value for edit action
                            // value : "value-0"
                            
                        },
                        {
                            text: {
                                type: "plain_text",
                                text: "*Delete Team*",
                                emoji: true
                            },
                            value: `delete-${team.teamId}` // Unique value for delete action
                            // value : "value-1"

                        }
                    ],
                    action_id: "overflow-action"
                }
            }));


            // Update the App Home with standup data
            await client.views.publish({
                user_id: user_id,  // Corrected from user_id to user
                view: {
                type: "home",
                blocks: [
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
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "Create A New Team."
                        },
                        "accessory": {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Create Team",
                                "emoji": true
                            },
                            "value": "create_team",
                            "action_id": "create_team"
                        }
                    },
                    {
                        "type": "divider"
                    },
                    {
                        "type": "header",
                        "text": {
                            "type": "plain_text",
                            "text": "All Teams.",
                            "emoji": true
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
                                "type": "users_select",
                                "placeholder": {
                                    "type": "plain_text",
                                    "text": "Select a user",
                                    "emoji": true
                                },
                                "initial_user": "U12345678",
                                "action_id": "actionId-1"
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
                            {
                                type: "button",
                                text: {
                                  type: "plain_text",
                                  text: "Apply Filters",
                                  emoji: true
                                },
                                action_id: "apply_team_filters"
                            }
                        ]
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "DEVELOPER TEAM."
                        },
                        "accessory": {
                            "type": "overflow",
                            "options": [
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "*Edit Team*",
                                        "emoji": true
                                    },
                                    "value": "value-0"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "*Delete Team*",
                                        "emoji": true
                                    },
                                    "value": "value-1"
                                }
                            ],
                            "action_id": "overflow-action"
                        }
                    },
                    {
                        "type": "section",
                        "text": {
                            "type": "mrkdwn",
                            "text": "QA/PM TEAM."
                        },
                        "accessory": {
                            "type": "overflow",
                            "options": [
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "*Edit Team*",
                                        "emoji": true
                                    },
                                    "value": "value-0"
                                },
                                {
                                    "text": {
                                        "type": "plain_text",
                                        "text": "*Delete Team*",
                                        "emoji": true
                                    },
                                    "value": "value-1"
                                }
                            ],
                            "action_id": "overflow-action"
                        }
                    },
                    ...teamSections
                ],
                },
            });  // Added the closing parenthesis here
    
            console.log("✅ Standup View published successfully!");
        } catch (error) {
            console.error("❌ Error publishing Standup View:", error);
        }
    }
    else{
    console.log("Error Fetching All Teams. All Teams is an empty Array");
    throw Error("Error Fetching All Teams. All Teams is an empty Array");
    }
  };


export const publishEditTeamView = async (
    client: WebClient,
    user_id: string,
    teamId: string
  ) => {
    try {
      const team: Team = await getTeamByID(teamId);

        // Fetch member names based on their IDs
        const teamMembers: any[] = await Promise.all(
            team.members.map(async (memberId) => {
                const userInfo = await client.users.info({ user: memberId });
                const memberName = userInfo.user?.real_name || 'Unknown Member'; // Fallback to 'Unknown Member'
        
                const isAdmin = team.admins.includes(memberId); // Check if the member is an admin
                return {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: memberName,
                    },
                    accessory: {
                        type: "overflow",
                        options: [
                            {
                                text: {
                                    type: "plain_text",
                                    text: isAdmin ? "Remove Administrator Role" : "Assign Administrator Role",
                                    emoji: true,
                                },
                                value: isAdmin ? `remove_admin_${memberId}` : `assign_admin_${memberId}`,
                            },
                            {
                                text: {
                                    type: "plain_text",
                                    text: "Delete Member",
                                    emoji: true,
                                },
                                value: `delete_member_${memberId}`,
                            },
                        ],
                        action_id: `overflow-action_${memberId}`,
                    },
                };
            })
        );
        
  
      const standupBlocks: any[] = team.teamstandupQuestions.map((standup, index) => {
        const isLast = index === team.teamstandupQuestions.length - 1;
        return [
        {
            type: "section",
            text: {
                type: "mrkdwn", // Change to mrkdwn for Markdown support
                text: `*Standup ${index + 1}*`, // This will make "Standup 1" bold
            },
            accessory: {
                type: "overflow",
                options: [
                {
                    text: {
                    type: "plain_text",
                    text: "Delete Standup",
                    emoji: true,
                    },
                    value: `delete_standup_${index}`,
                },
                ],
                action_id: `delete_standup_${index}`,
            },
        },              
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Questions:* \n- ${standup.questions.join("\n- ")}`,
            },
            {
              type: "mrkdwn",
              text: `*Reminder Times:* ${standup.reminderTimes.join(", ")}`,
            },
          ],
        },
        {
          type: "section",
          fields: [
            {
              type: "mrkdwn",
              text: `*Standup Days:* ${standup.standupDays.join(", ")}`,
            },
            {
              type: "mrkdwn",
              text: `*Standup Times:* ${standup.standupTimes.join(", ")}`,
            },
          ],

        },
        !isLast
        ? {
            type: "divider",
          }
        : null,
      ].filter(Boolean); // Filter out `null` if it's the last standup
     }).flat();
  
      await client.views.publish({
        user_id: user_id,
        view: {
          type: "home",
          private_metadata: JSON.stringify({teamId, teamName: team.name}), // Pass the team ID and teamName
          blocks: [
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
            {
              type: "header",
              text: {
                type: "plain_text",
                text: `${team.name}`,
                emoji: true,
              },
            },
            {
              type: "context",
              elements: [
                {
                  type: "plain_text",
                  text: `Admins: ${team.admins.join(", ")}`,
                  emoji: true,
                },
              ],
            },
            {
                "dispatch_action": true,
                "type": "input",
                "element": {
                    "type": "plain_text_input",
                    "action_id": "plain_text_input-action"
                },
                "label": {
                    "type": "plain_text",
                    "text": "Enter New Name, If Any. Else Leave Blank",
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": "Members",
                    "emoji": true
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": "Add New Member"
                },
                "accessory": {
                    "type": "users_select",
                    "placeholder": {
                        "type": "plain_text",
                        "text": "Select a user",
                        "emoji": true
                    },
                    "action_id": "users_select-action"
                }
            },
            // {
            //     "type": "section",
            //     "text": {
            //         "type": "mrkdwn",
            //         "text": "John Clarke Asante"
            //     },
            //     "accessory": {
            //         "type": "overflow",
            //         "options": [
            //             {
            //                 "text": {
            //                     "type": "plain_text",
            //                     "text": "Assign Administrator Role",
            //                     "emoji": true
            //                 },
            //                 "value": "value-0"
            //             },
            //             {
            //                 "text": {
            //                     "type": "plain_text",
            //                     "text": "Delete Member",
            //                     "emoji": true
            //                 },
            //                 "value": "value-1"
            //             }
            //         ],
            //         "action_id": "overflow-action"
            //     }
            // },
            // {
            //     "type": "section",
            //     "text": {
            //         "type": "mrkdwn",
            //         "text": "Theophilus Asante"
            //     },
            //     "accessory": {
            //         "type": "overflow",
            //         "options": [
            //             {
            //                 "text": {
            //                     "type": "plain_text",
            //                     "text": "Assign Administrator Role",
            //                     "emoji": true
            //                 },
            //                 "value": "value-0"
            //             },
            //             {
            //                 "text": {
            //                     "type": "plain_text",
            //                     "text": "Delete",
            //                     "emoji": true
            //                 },
            //                 "value": "value-1"
            //             }
            //         ],
            //         "action_id": "overflow-action"
            //     }
            // },
            ...teamMembers,
            {
              type: "divider",
            },
            {
                type: "header",
                text: {
                  type: "plain_text",
                  text: `Team Standups`,
                  emoji: true,
                },
            },
            {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: "Click the button below to add a new standup.",
                },
                accessory: {
                  type: "button",
                  text: {
                    type: "plain_text",
                    text: "Add New Standup",
                    emoji: true,
                  },
                  action_id: "add_standup",
                },
            },
            ...standupBlocks,

            // {
            //   type: "divider",
            // },
            // {
            //   type: "section",
            //   text: {
            //     type: "mrkdwn",
            //     text: "Click the submit button to save changes.",
            //   },
            //   accessory: {
            //     type: "button",
            //     text: {
            //       type: "plain_text",
            //       text: "Submit",
            //       emoji: true,
            //     },
            //     action_id: "submit_changes",
            //   },
            // },
          ],
        },
      });
  
      console.log("✅ Edit Teams View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Edit Teams View:", error);
    }
  };
  


  export const publishDeleteTeamView = async (client: WebClient, triggerId: string, teamId: string) => {
    try {
        console.log("Team ID In The PublishDeleteTeamView", teamId);
        const team:Team  = await getTeamByID(teamId);
        // console.log("Team In The PublishDeleteTeamView ", team);

        // Open the delete confirmation modal
        await client.views.open({
            trigger_id: triggerId,
            view: {
            type: "modal",
            private_metadata: JSON.stringify({teamId, teamName: team.name}), // Pass the team ID and teamName
            callback_id: "delete_team_modal",
            title: {
                type: "plain_text",
                text: "Confirm Delete",
            },
            close: {
                type: "plain_text",
                text: "Cancel",
            },
            submit: {
                type: "plain_text",
                text: "Delete",
            },
            blocks: [
                {
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `Are you sure you want to delete the ${team.name}?`,
                },
                },
            ],
            },
        });
  
      console.log("✅ Delete Teams View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Delete Teams View:", error);
    }
  };


  export const publishAddStandupModal = async (client: WebClient, triggerId: string, private_metadata: string) => {
    try {

        await client.views.open({
            trigger_id: triggerId,
            view: standUpModal(private_metadata)
        });
  
      console.log("✅ Add Standup Modal View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Add Standup Modal View:", error);
    }
  };


  


  export const publishCreateTeamModal = async (client: WebClient, triggerId: string) => {
    try {
        await client.views.open({
            trigger_id: triggerId,
            view: addTeamModal
        });
  
        console.log("✅ Opened modal for creating a new team");
    } catch (error) {
      console.error("❌ Error publishing Create Teams Modal:", error);
    }
  };

