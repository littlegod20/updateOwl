// export const addTeamModal = {
//   type: "modal" as const,
//   callback_id: "add_team_modal",
//   title: {
//     type: "plain_text" as const,
//     text: "Add New Team",
//   },
//   submit: {
//     type: "plain_text" as const,
//     text: "Create Team",
//   },
//   close: {
//     type: "plain_text" as const,
//     text: "Cancel",
//   },
//   blocks: [
//     {
//       type: "input" as const,
//       block_id: "team_name_block",
//       label: {
//         type: "plain_text",
//         text: "Enter team name:",
//       },
//       element: {
//         type: "plain_text_input" as const,
//         action_id: "team_name",
//         placeholder: {
//           type: "plain_text",
//           text: "e.g., Watchdogs",
//         },
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "team_members_block",
//       label: {
//         type: "plain_text",
//         text: "Select team members:",
//       },
//       element: {
//         type: "multi_users_select" as const, // Use multi_users_select
//         action_id: "team_members",
//         placeholder: {
//           type: "plain_text" as const,
//           text: "Select members from your workspace",
//         },
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "standup_questions_block",
//       label: {
//         type: "plain_text",
//         text: "Enter custom standup questions (separated by commas or new lines):",
//       },
//       element: {
//         type: "plain_text_input" as const,
//         action_id: "standup_questions",
//         multiline: true,
//         placeholder: {
//           type: "plain_text",
//           text: "e.g., What did you accomplish yesterday?\nWhat will you work on today?\nAny blockers?",
//         },
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "standup_day_block",
//       label: {
//         type: "plain_text",
//         text: "Set standup days:",
//       },
//       element: {
//         type: "multi_static_select" as const,
//         action_id: "standup_days",
//         placeholder: {
//           type: "plain_text",
//           text: "Select days to send standups checkins",
//         },
//         options: [
//           {
//             text: {
//               type: "plain_text",
//               text: "Monday",
//             },
//             value: "Monday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Tuesday",
//             },
//             value: "Tuesday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Wednesday",
//             },
//             value: "Wednesday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Thursday",
//             },
//             value: "Thursday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Friday",
//             },
//             value: "Friday",
//           },
//         ],
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "standup_time_block",
//       label: {
//         type: "plain_text",
//         text: "Select standup time:",
//       },
//       element: {
//         type: "timepicker" as const,
//         action_id: "standup_time",
//         placeholder: {
//           type: "plain_text",
//           text: "Select time",
//         },
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "time_zone_block",
//       label: {
//         type: "plain_text",
//         text: "Select team time zone:",
//       },
//       element: {
//         type: "static_select" as const,
//         action_id: "time_zone",
//         placeholder: {
//           type: "plain_text",
//           text: "Select time zone",
//         },
//         options: [
//           {
//             text: {
//               type: "plain_text",
//               text: "GMT",
//             },
//             value: "GMT",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "UTC",
//             },
//             value: "UTC",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "PST (Pacific Standard Time)",
//             },
//             value: "PST",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "EST (Eastern Standard Time)",
//             },
//             value: "EST",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "CST (Central Standard Time)",
//             },
//             value: "CST",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "IST (Indian Standard Time)",
//             },
//             value: "IST",
//           },
//         ],
//       },
//     },
//     // {
//     //   type: "section" as const,
//     //   block_id: "reminder_schedule_block",
//     //   text: {
//     //     type: "mrkdwn",
//     //     text: "Set reminder days and times:",
//     //   },
//     // },
//     {
//       type: "input" as const,
//       block_id: "reminder_day_block",
//       label: {
//         type: "plain_text",
//         text: "Set reminder days:",
//       },
//       element: {
//         type: "multi_static_select" as const,
//         action_id: "reminder_days",
//         placeholder: {
//           type: "plain_text",
//           text: "Select days to send reminders if users haven't submitted standups",
//         },
//         options: [
//           {
//             text: {
//               type: "plain_text",
//               text: "Monday",
//             },
//             value: "Monday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Tuesday",
//             },
//             value: "Tuesday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Wednesday",
//             },
//             value: "Wednesday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Thursday",
//             },
//             value: "Thursday",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "Friday",
//             },
//             value: "Friday",
//           },
//         ],
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "reminder_time_block",
//       label: {
//         type: "plain_text",
//         text: "Set reminder times:",
//       },
//       element: {
//         type: "multi_static_select" as const,
//         action_id: "reminder_times",
//         placeholder: {
//           type: "plain_text",
//           text: "Select times to send reminders if users haven't submitted standups",
//         },
//         options: [
//           {
//             text: {
//               type: "plain_text",
//               text: "09:00 AM",
//             },
//             value: "09:00",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "12:00 PM",
//             },
//             value: "12:00",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "03:00 PM",
//             },
//             value: "15:00",
//           },
//           {
//             text: {
//               type: "plain_text",
//               text: "06:00 PM",
//             },
//             value: "18:00",
//           },
//         ],
//       },
//     },
//     {
//       type: "actions",
//       elements: [
//         {
//           type: "button",
//           action_id: "save_standup_button",
//           text: {
//             type: "plain_text",
//             text: "Save Standup",
//           },
//           style: "primary",
//         },
//       ],
//     },
    
//   ],
// };



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
        type: "multi_users_select" as const,
        action_id: "team_members",
        placeholder: {
          type: "plain_text" as const,
          text: "Select members from your workspace",
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
          text: "Select team time zone",
        },
        options: [
          {
            text: { type: "plain_text", text: "GMT" },
            value: "GMT",
          },
          {
            text: { type: "plain_text", text: "UTC" },
            value: "UTC",
          },
          {
            text: { type: "plain_text", text: "PST (Pacific Standard Time)" },
            value: "PST",
          },
          {
            text: { type: "plain_text", text: "EST (Eastern Standard Time)" },
            value: "EST",
          },
          {
            text: { type: "plain_text", text: "CST (Central Standard Time)" },
            value: "CST",
          },
          {
            text: { type: "plain_text", text: "IST (Indian Standard Time)" },
            value: "IST",
          },
        ],
      },
      optional: true,
    },
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
      optional: true,
    },
    {
      type: "input" as const,
      block_id: "standup_day_block",
      label: {
        type: "plain_text",
        text: "Set standup days:",
      },
      element: {
        type: "multi_static_select" as const,
        action_id: "standup_days",
        placeholder: {
          type: "plain_text",
          text: "Select days to send standups checkins",
        },
        options: [
          {
            text: { type: "plain_text", text: "Monday" },
            value: "Monday",
          },
          {
            text: { type: "plain_text", text: "Tuesday" },
            value: "Tuesday",
          },
          {
            text: { type: "plain_text", text: "Wednesday" },
            value: "Wednesday",
          },
          {
            text: { type: "plain_text", text: "Thursday" },
            value: "Thursday",
          },
          {
            text: { type: "plain_text", text: "Friday" },
            value: "Friday",
          },
        ],
      },
      optional: true,
    },
    {
      type: "input" as const,
      block_id: "standup_time_block",
      label: {
        type: "plain_text",
        text: "Set Standup times:",
      },
      element: {
        type: "multi_static_select" as const,
        action_id: "standup_times",
        placeholder: {
          type: "plain_text",
          text: "Select times to send standups",
        },
        options: [
          {
            "text": { "type": "plain_text", "text": "09:00 AM" },
            "value": "09:00"
          },
          {
            "text": { "type": "plain_text", "text": "10:00 AM" },
            "value": "10:00"
          },
          {
            "text": { "type": "plain_text", "text": "11:00 AM" },
            "value": "11:00"
          },
          {
            "text": { "type": "plain_text", "text": "12:00 PM" },
            "value": "12:00"
          },
          {
            "text": { "type": "plain_text", "text": "01:00 PM" },
            "value": "13:00"
          },
          {
            "text": { "type": "plain_text", "text": "02:00 PM" },
            "value": "14:00"
          },
          {
            "text": { "type": "plain_text", "text": "03:00 PM" },
            "value": "15:00"
          },
          {
            "text": { "type": "plain_text", "text": "04:00 PM" },
            "value": "16:00"
          },
          {
            "text": { "type": "plain_text", "text": "05:00 PM" },
            "value": "17:00"
          },
          {
            "text": { "type": "plain_text", "text": "06:00 PM" },
            "value": "18:00"
          },
          {
            "text": { "type": "plain_text", "text": "07:00 PM" },
            "value": "19:00"
          },
          {
            "text": { "type": "plain_text", "text": "08:00 PM" },
            "value": "20:00"
          }
        ],
      },
      optional: true,
    },
    // {
    //   type: "input" as const,
    //   block_id: "standup_time_block",
    //   label: {
    //     type: "plain_text",
    //     text: "Select standup time:",
    //   },
    //   element: {
    //     type: "timepicker" as const,
    //     action_id: "standup_time",
    //     placeholder: {
    //       type: "plain_text",
    //       text: "Select time",
    //     },
    //   },
    //   optional: true,
    // },

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
          text: "Select times to send reminders",
        },
        options: [
          {
            text: { type: "plain_text", text: "09:00 AM" },
            value: "09:00",
          },
          {
            text: { type: "plain_text", text: "12:00 PM" },
            value: "12:00",
          },
          {
            text: { type: "plain_text", text: "03:00 PM" },
            value: "15:00",
          },
          {
            text: { type: "plain_text", text: "06:00 PM" },
            value: "18:00",
          },
        ],
      },
      optional: true,
    },
    {
      type: "actions",
      block_id: "save_standup_block",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Save Standup",
          },
          action_id: "save_standup",
          style: "primary",
        },
      ],
    },
    {
      type: "section",
      block_id: "saved_standups_section",
      text: {
        type: "mrkdwn",
        text: "Saved Standups will appear here",
      },
    },
  ],
};