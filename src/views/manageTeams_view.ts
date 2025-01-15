import { WebClient } from "@slack/web-api";


export const publishManageTeamsView = async (client: WebClient, user_id: string) => {
    try {
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
            ],
            },
        });  // Added the closing parenthesis here
  
      console.log("✅ Standup View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Standup View:", error);
    }
  };


  export const publishEditTeamView = async (client: WebClient, user_id: string) => {
    try {
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
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "ALL DEV TEAM",
                        "emoji": true
                    }
                },
                {
                    "type": "context",
                    "elements": [
                        {
                            "type": "plain_text",
                            "text": "Admins: K A Applegate",
                            "emoji": true
                        }
                    ]
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
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "John Clarke Asante"
                    },
                    "accessory": {
                        "type": "overflow",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 0*",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Add Team Administrator Role",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Remove Member",
                                    "emoji": true
                                },
                                "value": "value-2"
                            }
                        ],
                        "action_id": "overflow-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Theophilus Asante"
                    },
                    "accessory": {
                        "type": "overflow",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Add Team Administrator Role",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "Remove Member",
                                    "emoji": true
                                },
                                "value": "value-1"
                            }
                        ],
                        "action_id": "overflow-action"
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "header",
                    "text": {
                        "type": "plain_text",
                        "text": "Configure Standups",
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Set Your Own Standup Question with a button."
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Create Standup Question",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "url": "https://google.com",
                        "action_id": "button-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "What Did You Do Yesterday?"
                    },
                    "accessory": {
                        "type": "overflow",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 0*",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 1*",
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
                        "text": "What Did You Do Today?"
                    },
                    "accessory": {
                        "type": "overflow",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 0*",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 1*",
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
                        "text": "Any Blockers?"
                    },
                    "accessory": {
                        "type": "overflow",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 0*",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 1*",
                                    "emoji": true
                                },
                                "value": "value-1"
                            }
                        ],
                        "action_id": "overflow-action"
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "checkboxes",
                        "options": [
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 0*",
                                    "emoji": true
                                },
                                "value": "value-0"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 1*",
                                    "emoji": true
                                },
                                "value": "value-1"
                            },
                            {
                                "text": {
                                    "type": "plain_text",
                                    "text": "*plain_text option 2*",
                                    "emoji": true
                                },
                                "value": "value-2"
                            }
                        ],
                        "action_id": "checkboxes-action"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label",
                        "emoji": true
                    }
                },
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "multiline": true,
                        "action_id": "plain_text_input-action"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Enter Your Custom Standup Question",
                        "emoji": true
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Pick a date for the deadline."
                    },
                    "accessory": {
                        "type": "datepicker",
                        "initial_date": "1990-04-28",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select a date",
                            "emoji": true
                        },
                        "action_id": "datepicker-action"
                    }
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Set Time For Standup Reminder"
                    },
                    "accessory": {
                        "type": "timepicker",
                        "initial_time": "13:37",
                        "placeholder": {
                            "type": "plain_text",
                            "text": "Select time",
                            "emoji": true
                        },
                        "action_id": "timepicker-action"
                    }
                },
                {
                    "type": "divider"
                },
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "Click The Submit Button To Submit Data"
                    },
                    "accessory": {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "Submit",
                            "emoji": true
                        },
                        "value": "click_me_123",
                        "action_id": "button-action"
                    }
                }
            ],
            },
        });  // Added the closing parenthesis here
  
      console.log("✅ Edit Teams View published successfully!");
    } catch (error) {
      console.error("❌ Error publishing Edit Teams View:", error);
    }
  };


  export const publishDeleteTeamView = async (client: WebClient, triggerId: string) => {
    try {
        // Open the delete confirmation modal
        await client.views.open({
            trigger_id: triggerId,
            view: {
            type: "modal",
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
                    text: "Are you sure you want to delete this Team?",
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


  


  export const publishCreateTeamModal = async (client: WebClient, triggerId: string) => {
    try {
        await client.views.open({
            trigger_id: triggerId,
            view: {
              type: "modal",
              callback_id: "add_team_modal", // Define the callback id for the modal
              title: {
                type: "plain_text",
                text: "Add New Team",
              },
              submit: {
                type: "plain_text",
                text: "Create Team",
              },
              blocks: [
                {
                  type: "input",
                  block_id: "team_name_block",
                  label: {
                    type: "plain_text",
                    text: "Please enter the name of the team:",
                  },
                  element: {
                    type: "plain_text_input",
                    action_id: "team_name",
                    placeholder: {
                      type: "plain_text",
                      text: "Enter team name",
                    },
                  },
                },
                {
                  type: "input",
                  block_id: "team_admin_block",
                  label: {
                    type: "plain_text",
                    text: "Enter admin emails, usernames, or display names (comma-separated):",
                  },
                  element: {
                    type: "multi_external_select",
                    action_id: "team_admins",
                    placeholder: {
                      type: "plain_text",
                      text: "e.g. johndoes@example.com, Ishmael",
                    },
                    min_query_length: 1,
                  },
                },
              ],
            },
        });
  
        console.log("✅ Opened modal for creating a new team");
    } catch (error) {
      console.error("❌ Error publishing Create Teams Modal:", error);
    }
  };