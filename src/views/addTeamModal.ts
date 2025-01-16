export const addTeamModal = {
  type: "modal" as const,
  callback_id: "add_team_modal",
  title: {
    type: "plain_text" as const,
    text: "Add New Team",
  },
  submit: {
    type: "plain_text" as const,
    text: "Create Team",
  },
  close: {
    type: "plain_text" as const,
    text: "Cancel",
  },
  blocks: [
    {
      type: "input" as const,
      block_id: "team_name_block",
      label: {
        type: "plain_text",
        text: "Enter team name:",
      },
      element: {
        type: "plain_text_input" as const,
        action_id: "team_name",
        placeholder: {
          type: "plain_text",
          text: "e.g., Watchdogs",
        },
      },
    },
    {
      type: "input" as const,
      block_id: "team_members_block",
      label: {
        type: "plain_text",
        text: "Select team members:",
      },
      element: {
        type: "multi_users_select" as const, // Use multi_users_select
        action_id: "team_members",
        placeholder: {
          type: "plain_text" as const,
          text: "Select members from your workspace",
        },
      },
    },
    // {
    //   type: "input" as const,
    //   block_id: "team_members_block",
    //   label: {
    //     type: "plain_text",
    //     text: "Enter team member name(s):",
    //   },
    //   element: {
    //     type: "multi_external_select" as const,
    //     action_id: "team_members",
    //     placeholder: {
    //       type: "plain_text",
    //       text: "e.g., Ishmael",
    //     },
    //     min_query_length: 1,
    //   },
    // },
    {
      type: "input" as const,
      block_id: "standup_questions_block",
      label: {
        type: "plain_text",
        text: "Enter custom standup questions (separated by commas or new lines):",
      },
      element: {
        type: "plain_text_input" as const,
        action_id: "standup_questions",
        multiline: true,
        placeholder: {
          type: "plain_text",
          text: "e.g., What did you accomplish yesterday?\nWhat will you work on today?\nAny blockers?",
        },
      },
    },
    {
      type: "input" as const,
      block_id: "standup_time_block",
      label: {
        type: "plain_text",
        text: "Select standup time:",
      },
      element: {
        type: "timepicker" as const,
        action_id: "standup_time",
        placeholder: {
          type: "plain_text",
          text: "Select time",
        },
      },
    },
    {
      type: "input" as const,
      block_id: "time_zone_block",
      label: {
        type: "plain_text",
        text: "Select team time zone:",
      },
      element: {
        type: "static_select" as const,
        action_id: "time_zone",
        placeholder: {
          type: "plain_text",
          text: "Select time zone",
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "GMT",
            },
            value: "GMT",
          },
          {
            text: {
              type: "plain_text",
              text: "UTC",
            },
            value: "UTC",
          },
          {
            text: {
              type: "plain_text",
              text: "PST (Pacific Standard Time)",
            },
            value: "PST",
          },
          {
            text: {
              type: "plain_text",
              text: "EST (Eastern Standard Time)",
            },
            value: "EST",
          },
          {
            text: {
              type: "plain_text",
              text: "CST (Central Standard Time)",
            },
            value: "CST",
          },
          {
            text: {
              type: "plain_text",
              text: "IST (Indian Standard Time)",
            },
            value: "IST",
          },
        ],
      },
    },
    {
      type: "input" as const,
      block_id: "reminder_time_block",
      label: {
        type: "plain_text",
        text: "Set reminder times:",
      },
      element: {
        type: "multi_static_select" as const,
        action_id: "reminder_times",
        placeholder: {
          type: "plain_text",
          text: "Select times to send reminders if users haven't submitted standups",
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "09:00 AM",
            },
            value: "09:00",
          },
          {
            text: {
              type: "plain_text",
              text: "12:00 PM",
            },
            value: "12:00",
          },
          {
            text: {
              type: "plain_text",
              text: "03:00 PM",
            },
            value: "15:00",
          },
          {
            text: {
              type: "plain_text",
              text: "06:00 PM",
            },
            value: "18:00",
          },
        ],
      },
    }
  ],
};
