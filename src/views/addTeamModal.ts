

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
//         type: "multi_users_select" as const,
//         action_id: "team_members",
//         placeholder: {
//           type: "plain_text" as const,
//           text: "Select members from your workspace",
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
//           text: "Select team time zone",
//         },
//         options: [
//           {
//             text: { type: "plain_text", text: "GMT" },
//             value: "GMT",
//           },
//           {
//             text: { type: "plain_text", text: "UTC" },
//             value: "UTC",
//           },
//           {
//             text: { type: "plain_text", text: "PST (Pacific Standard Time)" },
//             value: "PST",
//           },
//           {
//             text: { type: "plain_text", text: "EST (Eastern Standard Time)" },
//             value: "EST",
//           },
//           {
//             text: { type: "plain_text", text: "CST (Central Standard Time)" },
//             value: "CST",
//           },
//           {
//             text: { type: "plain_text", text: "IST (Indian Standard Time)" },
//             value: "IST",
//           },
//         ],
//       },
//       optional: true,
//     },
//     {
//       type: "section",
//       block_id: "questions_section",
//       text: {
//         type: "mrkdwn",
//         text: "*Standup Questions and Formats*",
//       },
//     },
//     {
//       type: "actions",
//       block_id: "add_question_button_block",
//       elements: [
//         {
//           type: "button",
//           action_id: "add_question",
//           text: {
//             type: "plain_text",
//             text: "Add Another Question",
//           },
//           style: "primary",
//         },
//       ],
//     },
//     // {
//     //   type: "input" as const,
//     //   block_id: "standup_questions_block",
//     //   label: {
//     //     type: "plain_text",
//     //     text: "Enter custom standup questions (separated by commas or new lines):",
//     //   },
//     //   element: {
//     //     type: "plain_text_input" as const,
//     //     action_id: "standup_questions",
//     //     multiline: true,
//     //     placeholder: {
//     //       type: "plain_text",
//     //       text: "e.g., What did you accomplish yesterday?\nWhat will you work on today?\nAny blockers?",
//     //     },
//     //   },
//     //   optional: true,
//     // },
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
//             text: { type: "plain_text", text: "Monday" },
//             value: "Monday",
//           },
//           {
//             text: { type: "plain_text", text: "Tuesday" },
//             value: "Tuesday",
//           },
//           {
//             text: { type: "plain_text", text: "Wednesday" },
//             value: "Wednesday",
//           },
//           {
//             text: { type: "plain_text", text: "Thursday" },
//             value: "Thursday",
//           },
//           {
//             text: { type: "plain_text", text: "Friday" },
//             value: "Friday",
//           },
//         ],
//       },
//       optional: true,
//     },
//     {
//       type: "input" as const,
//       block_id: "standup_time_block",
//       label: {
//         type: "plain_text",
//         text: "Set Standup times:",
//       },
//       element: {
//         type: "multi_static_select" as const,
//         action_id: "standup_times",
//         placeholder: {
//           type: "plain_text",
//           text: "Select times to send standups",
//         },
//         options: [
//           {
//             text: { type: "plain_text", text: "09:00 AM" },
//             value: "09:00",
//           },
//           {
//             text: { type: "plain_text", text: "10:00 AM" },
//             value: "10:00",
//           },
//           {
//             text: { type: "plain_text", text: "11:00 AM" },
//             value: "11:00",
//           },
//           {
//             text: { type: "plain_text", text: "12:00 PM" },
//             value: "12:00",
//           },
//           {
//             text: { type: "plain_text", text: "01:00 PM" },
//             value: "13:00",
//           },
//           {
//             text: { type: "plain_text", text: "02:00 PM" },
//             value: "14:00",
//           },
//           {
//             text: { type: "plain_text", text: "03:00 PM" },
//             value: "15:00",
//           },
//           {
//             text: { type: "plain_text", text: "04:00 PM" },
//             value: "16:00",
//           },
//           {
//             text: { type: "plain_text", text: "05:00 PM" },
//             value: "17:00",
//           },
//           {
//             text: { type: "plain_text", text: "06:00 PM" },
//             value: "18:00",
//           },
//           {
//             text: { type: "plain_text", text: "07:00 PM" },
//             value: "19:00",
//           },
//           {
//             text: { type: "plain_text", text: "08:00 PM" },
//             value: "20:00",
//           },
//         ],
//       },
//       optional: true,
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
//           text: "Select times to send reminders",
//         },
//         options: [
//           {
//             text: { type: "plain_text", text: "09:00 AM" },
//             value: "09:00",
//           },
//           {
//             text: { type: "plain_text", text: "12:00 PM" },
//             value: "12:00",
//           },
//           {
//             text: { type: "plain_text", text: "03:00 PM" },
//             value: "15:00",
//           },
//           {
//             text: { type: "plain_text", text: "06:00 PM" },
//             value: "18:00",
//           },
//         ],
//       },
//       optional: true,
//     },
//     {
//       type: "actions",
//       block_id: "save_standup_block",
//       elements: [
//         {
//           type: "button",
//           text: {
//             type: "plain_text",
//             text: "Save Standup",
//           },
//           action_id: "save_standup",
//           style: "primary",
//         },
//       ],
//     },
//     {
//       type: "section",
//       block_id: "saved_standups_section",
//       text: {
//         type: "mrkdwn",
//         text: "Saved Standups will appear here",
//       },
//     },
//   ],
// };

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
//         type: "input" as const,
//         block_id: "team_name_block",
//         label: {
//           type: "plain_text",
//           text: "Enter team name:",
//         },
//         element: {
//           type: "plain_text_input" as const,
//           action_id: "team_name",
//           placeholder: {
//             type: "plain_text",
//             text: "e.g., Watchdogs",
//           },
//         },
//       },
//       {
//         type: "input" as const,
//         block_id: "team_members_block",
//         label: {
//           type: "plain_text",
//           text: "Select team members:",
//         },
//         element: {
//           type: "multi_users_select" as const,
//           action_id: "team_members",
//           placeholder: {
//             type: "plain_text" as const,
//             text: "Select members from your workspace",
//           },
//         },
//       },
//       {
//         type: "input" as const,
//         block_id: "time_zone_block",
//         label: {
//           type: "plain_text",
//           text: "Select team time zone:",
//         },
//         element: {
//           type: "static_select" as const,
//           action_id: "time_zone",
//           placeholder: {
//             type: "plain_text",
//             text: "Select team time zone",
//           },
//           options: [
//             {
//               text: { type: "plain_text", text: "GMT" },
//               value: "GMT",
//             },
//             {
//               text: { type: "plain_text", text: "UTC" },
//               value: "UTC",
//             },
//             {
//               text: { type: "plain_text", text: "PST (Pacific Standard Time)" },
//               value: "PST",
//             },
//             {
//               text: { type: "plain_text", text: "EST (Eastern Standard Time)" },
//               value: "EST",
//             },
//             {
//               text: { type: "plain_text", text: "CST (Central Standard Time)" },
//               value: "CST",
//             },
//             {
//               text: { type: "plain_text", text: "IST (Indian Standard Time)" },
//               value: "IST",
//             },
//           ],
//         },
//         optional: true,
//       },
//     // ... Previous blocks remain the same until questions_section ...
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
//             text: { type: "plain_text", text: "Monday" },
//             value: "Monday",
//           },
//           {
//             text: { type: "plain_text", text: "Tuesday" },
//             value: "Tuesday",
//           },
//           {
//             text: { type: "plain_text", text: "Wednesday" },
//             value: "Wednesday",
//           },
//           {
//             text: { type: "plain_text", text: "Thursday" },
//             value: "Thursday",
//           },
//           {
//             text: { type: "plain_text", text: "Friday" },
//             value: "Friday",
//           },
//         ],
//       },
//       optional: true,
//     },
//     {
//       type: "input" as const,
//       block_id: "standup_time_block",
//       label: {
//         type: "plain_text",
//         text: "Set Standup times:",
//       },
//       element: {
//         type: "multi_static_select" as const,
//         action_id: "standup_times",
//         placeholder: {
//           type: "plain_text",
//           text: "Select times to send standups",
//         },
//         options: [
//           {
//             text: { type: "plain_text", text: "09:00 AM" },
//             value: "09:00",
//           },
//           {
//             text: { type: "plain_text", text: "10:00 AM" },
//             value: "10:00",
//           },
//           {
//             text: { type: "plain_text", text: "11:00 AM" },
//             value: "11:00",
//           },
//           {
//             text: { type: "plain_text", text: "12:00 PM" },
//             value: "12:00",
//           },
//           {
//             text: { type: "plain_text", text: "01:00 PM" },
//             value: "13:00",
//           },
//           {
//             text: { type: "plain_text", text: "02:00 PM" },
//             value: "14:00",
//           },
//           {
//             text: { type: "plain_text", text: "03:00 PM" },
//             value: "15:00",
//           },
//           {
//             text: { type: "plain_text", text: "04:00 PM" },
//             value: "16:00",
//           },
//           {
//             text: { type: "plain_text", text: "05:00 PM" },
//             value: "17:00",
//           },
//           {
//             text: { type: "plain_text", text: "06:00 PM" },
//             value: "18:00",
//           },
//           {
//             text: { type: "plain_text", text: "07:00 PM" },
//             value: "19:00",
//           },
//           {
//             text: { type: "plain_text", text: "08:00 PM" },
//             value: "20:00",
//           },
//         ],
//       },
//       optional: true,
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
//           text: "Select times to send reminders",
//         },
//         options: [
//           {
//             text: { type: "plain_text", text: "09:00 AM" },
//             value: "09:00",
//           },
//           {
//             text: { type: "plain_text", text: "12:00 PM" },
//             value: "12:00",
//           },
//           {
//             text: { type: "plain_text", text: "03:00 PM" },
//             value: "15:00",
//           },
//           {
//             text: { type: "plain_text", text: "06:00 PM" },
//             value: "18:00",
//           },
//         ],
//       },
//       optional: true,
//     },
//     {
//       type: "section",
//       block_id: "questions_section",
//       text: {
//         type: "mrkdwn",
//         text: "*Standup Questions and Formats*",
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "question_format_block",
//       label: {
//         type: "plain_text",
//         text: "Select question format:",
//       },
//       element: {
//         type: "static_select" as const,
//         action_id: "question_format",
//         placeholder: {
//           type: "plain_text",
//           text: "Choose format",
//         },
//         options: [
//           {
//             text: { type: "plain_text", text: "Free Text" },
//             value: "free_text",
//           },
//           {
//             text: { type: "plain_text", text: "Multiple Choice" },
//             value: "multiple_choice",
//           },
//           {
//             text: { type: "plain_text", text: "Rating Scale" },
//             value: "rating",
//           },
//           {
//             text: { type: "plain_text", text: "Yes/No" },
//             value: "boolean",
//           },
//           {
//             text: { type: "plain_text", text: "Numbered List" },
//             value: "numbered_list",
//           }
//         ],
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "question_text_block",
//       label: {
//         type: "plain_text",
//         text: "Question text:",
//       },
//       element: {
//         type: "plain_text_input" as const,
//         action_id: "question_text",
//         placeholder: {
//           type: "plain_text",
//           text: "Enter your question",
//         },
//       },
//     },
//     {
//       type: "input" as const,
//       block_id: "question_options_block",
//       label: {
//         type: "plain_text",
//         text: "Options (for multiple choice/rating, separate by commas):",
//       },
//       element: {
//         type: "plain_text_input" as const,
//         action_id: "question_options",
//         placeholder: {
//           type: "plain_text",
//           text: "Option 1, Option 2, Option 3",
//         },
//       },
//       optional: true,
//     },
//     {
//       type: "input" as const,
//       block_id: "question_required_block",
//       label: {
//         type: "plain_text",
//         text: "Is this question required?",
//       },
//       element: {
//         type: "radio_buttons" as const,
//         action_id: "question_required",
//         options: [
//           {
//             text: { type: "plain_text", text: "Required" },
//             value: "required",
//           },
//           {
//             text: { type: "plain_text", text: "Optional" },
//             value: "optional",
//           },
//         ],
//       },
//     },
//     {
//       type: "actions",
//       block_id: "add_question_actions",
//       elements: [
//         {
//           type: "button",
//           action_id: "add_question",
//           text: {
//             type: "plain_text",
//             text: "Add Question",
//           },
//           style: "primary",
//         },
//         // {
//         //   type: "button",
//         //   action_id: "preview_question",
//         //   text: {
//         //     type: "plain_text",
//         //     text: "Preview",
//         //   },
//         // }
//       ],
//     },
//     {
//       type: "section",
//       block_id: "added_questions_section",
//       text: {
//         type: "mrkdwn",
//         text: "Added Questions:",
//       },
//     },
//     // ... Rest of the blocks remain the same ...
//   ],
// };

export const addTeamModal = {
  type: "modal" as const,
  callback_id: "add_team_modal",
  private_metadata: JSON.stringify({ questions: [] }),
  title: {
    type: "plain_text",
    text: "Add New Team",
  },
  submit: {
    type: "plain_text",
    text: "Create Team",
  },
  close: {
    type: "plain_text",
    text: "Cancel",
  },
  blocks: [
    {
      type: "input",
      block_id: "team_name_block",
      label: {
        type: "plain_text",
        text: "Enter team name:",
      },
      element: {
        type: "plain_text_input",
        action_id: "team_name",
        placeholder: {
          type: "plain_text",
          text: "e.g., Watchdogs",
        },
      },
    },
    {
      type: "input",
      block_id: "team_members_block",
      label: {
        type: "plain_text",
        text: "Select team members:",
      },
      element: {
        type: "multi_users_select",
        action_id: "team_members",
        placeholder: {
          type: "plain_text",
          text: "Select members from your workspace",
        },
      },
    },
    {
      type: "input",
      block_id: "time_zone_block",
      label: {
        type: "plain_text",
        text: "Select team time zone:",
      },
      element: {
        type: "static_select",
        action_id: "time_zone",
        placeholder: {
          type: "plain_text",
          text: "Select team time zone",
        },
        options: [
          { text: { type: "plain_text", text: "GMT" }, value: "GMT" },
          { text: { type: "plain_text", text: "UTC" }, value: "UTC" },
          { text: { type: "plain_text", text: "PST (Pacific Standard Time)" }, value: "PST" },
          { text: { type: "plain_text", text: "EST (Eastern Standard Time)" }, value: "EST" },
          { text: { type: "plain_text", text: "CST (Central Standard Time)" }, value: "CST" },
          { text: { type: "plain_text", text: "IST (Indian Standard Time)" }, value: "IST" },
        ],
      },
      optional: true,
    },
    {
      type: "input",
      block_id: "reminder_time_block",
      label: {
        type: "plain_text",
        text: "Set reminder times:",
      },
      element: {
        type: "multi_static_select",
        action_id: "reminder_times",
        placeholder: {
          type: "plain_text",
          text: "Select times to send reminders",
        },
        options: [
          { text: { type: "plain_text", text: "09:00 AM" }, value: "09:00" },
          { text: { type: "plain_text", text: "12:00 PM" }, value: "12:00" },
          { text: { type: "plain_text", text: "03:00 PM" }, value: "15:00" },
          { text: { type: "plain_text", text: "06:00 PM" }, value: "18:00" },
        ],
      },
      optional: true,
    },
    {
      type: "section",
      block_id: "standup_days_times_section",
      text: {
        type: "mrkdwn",
        text: "*Set Standup Days and Times*",
      },
    },
    {
      type: "input",
      block_id: "standup_day_block",
      label: {
        type: "plain_text",
        text: "Set standup days:",
      },
      element: {
        type: "multi_static_select",
        action_id: "standup_days",
        placeholder: {
          type: "plain_text",
          text: "Select days to send standups check-ins",
        },
        options: [
          { text: { type: "plain_text", text: "Monday" }, value: "Monday" },
          { text: { type: "plain_text", text: "Tuesday" }, value: "Tuesday" },
          { text: { type: "plain_text", text: "Wednesday" }, value: "Wednesday" },
          { text: { type: "plain_text", text: "Thursday" }, value: "Thursday" },
          { text: { type: "plain_text", text: "Friday" }, value: "Friday" },
        ],
      },
      optional: true,
    },
    {
      type: "input",
      block_id: "standup_time_block",
      label: {
        type: "plain_text",
        text: "Set Standup times:",
      },
      element: {
        type: "multi_static_select",
        action_id: "standup_times",
        placeholder: {
          type: "plain_text",
          text: "Select times to send standups",
        },
        options: [
          { text: { type: "plain_text", text: "09:00 AM" }, value: "09:00" },
          { text: { type: "plain_text", text: "10:00 AM" }, value: "10:00" },
          { text: { type: "plain_text", text: "11:00 AM" }, value: "11:00" },
          { text: { type: "plain_text", text: "12:00 PM" }, value: "12:00" },
          { text: { type: "plain_text", text: "01:00 PM" }, value: "13:00" },
          { text: { type: "plain_text", text: "02:00 PM" }, value: "14:00" },
          { text: { type: "plain_text", text: "03:00 PM" }, value: "15:00" },
          { text: { type: "plain_text", text: "04:00 PM" }, value: "16:00" },
          { text: { type: "plain_text", text: "05:00 PM" }, value: "17:00" },
          { text: { type: "plain_text", text: "06:00 PM" }, value: "18:00" },
          { text: { type: "plain_text", text: "07:00 PM" }, value: "19:00" },
          { text: { type: "plain_text", text: "08:00 PM" }, value: "20:00" },
        ],
      },
      optional: true,
    },

    {
      type: "section",
      block_id: "questions_section",
      text: {
        type: "mrkdwn",
        text: "*Standup Questions and Formats*",
      },
    },
    {
      type: "input",
      block_id: "question_format_block",
      label: {
        type: "plain_text",
        text: "Select question format:",
      },
      element: {
        type: "static_select",
        action_id: "question_format",
        placeholder: {
          type: "plain_text",
          text: "Choose format",
        },
        options: [
          { text: { type: "plain_text", text: "Free Text" }, value: "free_text" },
          { text: { type: "plain_text", text: "Select" }, value: "multiple_choice" },
          { text: { type: "plain_text", text: "Rating Scale" }, value: "rating" },
          { text: { type: "plain_text", text: "Yes/No" }, value: "boolean" },
          { text: { type: "plain_text", text: "Numbered List" }, value: "numbered_list" },
        ],
      },
    },
    {
      type: "input",
      block_id: "question_text_block",
      label: {
        type: "plain_text",
        text: "Question text:",
      },
      element: {
        type: "plain_text_input",
        action_id: "question_text",
        placeholder: {
          type: "plain_text",
          text: "Enter your question",
        },
      },
    },
    {
      type: "input",
      block_id: "question_options_block",
      label: {
        type: "plain_text",
        text: "Options (for multiple choice/rating, separate by commas):",
      },
      element: {
        type: "plain_text_input",
        action_id: "question_options",
        placeholder: {
          type: "plain_text",
          text: "Option 1, Option 2, Option 3",
        },
      },
      optional: true,
    },
    {
      type: "input",
      block_id: "question_required_block",
      label: {
        type: "plain_text",
        text: "Is this question required?",
      },
      element: {
        type: "radio_buttons",
        action_id: "question_required",
        options: [
          { text: { type: "plain_text", text: "Required" }, value: "required" },
          { text: { type: "plain_text", text: "Optional" }, value: "optional" },
        ],
      },
    },
    {
      type: "actions",
      block_id: "add_question_actions",
      elements: [
        {
          type: "button",
          action_id: "add_question",
          text: {
            type: "plain_text",
            text: "Add Question",
          },
          style: "primary",
        },
      ],
    },
    {
      type: "section",
      block_id: "added_questions_section",
      text: {
        type: "mrkdwn",
        text: "Added Questions:",
      },
    },
  ],
};

