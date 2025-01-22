import { View, ModalView } from "@slack/types"; // Ensure you import the necessary types

export const standUpModal = (
  private_metadata: string,
//   questions: any[]
): ModalView => {
//   const questionBlocks = JSON.parse(private_metadata).map((question, index) => ({
//     type: "input",
//     block_id: `question_${index}`,
//     element: {
//       type: "plain_text_input",
//       action_id: `answer_${index}`,
//       placeholder: {
//         type: "plain_text",
//         text: "Enter your question",
//       },
//     },
//     label: {
//       type: "plain_text",
//       text: `Question ${index + 1}`,
//     },
//   }));

  return {
    type: "modal",
    callback_id: "add_standup_modal",
    title: {
      type: "plain_text",
      text: "Add New Standup",
    },
    private_metadata: private_metadata, // Include the private metadata here
    blocks: [
    //   ...questionBlocks,
    //   {
    //     type: "actions",
    //     block_id: "add_question_action",
    //     elements: [
    //       {
    //         type: "button",
    //         action_id: "add_new_question",
    //         text: {
    //           type: "plain_text",
    //           text: "Add Question",
    //         },
    //         value: JSON.stringify({ questions }),
    //       },
    //     ],
    //   },
      {
        type: "input",
        block_id: "questions",
        label: {
          type: "plain_text",
          text: "Enter custom standup questions (separated by commas or new lines):",
        },
        element: {
          type: "plain_text_input",
          action_id: "input",
          multiline: true,
          placeholder: {
            type: "plain_text",
            text: "e.g., What did you accomplish yesterday?\nWhat will you work on today?\nAny blockers?",
          },
        },
      },
      {
        type: "input",
        block_id: "standupDays",
        label: {
          type: "plain_text",
          text: "Set standup days:",
        },
        element: {
          type: "multi_static_select",
          action_id: "input",
          placeholder: {
            type: "plain_text",
            text: "Select days to send standups check-ins",
          },
          options: [
            { text: { type: "plain_text", text: "Monday" }, value: "Monday" },
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
            { text: { type: "plain_text", text: "Friday" }, value: "Friday" },
          ],
        },
      },
      {
        type: "input",
        block_id: "standupTimes",
        label: {
          type: "plain_text",
          text: "Set Standup times:",
        },
        element: {
          type: "multi_static_select",
          action_id: "input",
          placeholder: {
            type: "plain_text",
            text: "Select times to send standups",
          },
          options: [
            {
              text: { type: "plain_text", text: "09:00 AM" },
              value: "09:00",
            },
            {
              text: { type: "plain_text", text: "10:00 AM" },
              value: "10:00",
            },
            {
              text: { type: "plain_text", text: "11:00 AM" },
              value: "11:00",
            },
            {
              text: { type: "plain_text", text: "12:00 PM" },
              value: "12:00",
            },
            {
              text: { type: "plain_text", text: "01:00 PM" },
              value: "13:00",
            },
            {
              text: { type: "plain_text", text: "02:00 PM" },
              value: "14:00",
            },
            {
              text: { type: "plain_text", text: "03:00 PM" },
              value: "15:00",
            },
            {
              text: { type: "plain_text", text: "04:00 PM" },
              value: "16:00",
            },
            {
              text: { type: "plain_text", text: "05:00 PM" },
              value: "17:00",
            },
            {
              text: { type: "plain_text", text: "06:00 PM" },
              value: "18:00",
            },
            {
              text: { type: "plain_text", text: "07:00 PM" },
              value: "19:00",
            },
            {
              text: { type: "plain_text", text: "08:00 PM" },
              value: "20:00",
            },
          ],
        },
      },
      {
        type: "input",
        block_id: "reminderTimes",
        label: {
          type: "plain_text",
          text: "Set reminder times:",
        },
        element: {
          type: "multi_static_select",
          action_id: "input",
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
            // Add more options as needed
          ],
        },
      },
    ],
    submit: {
      // Add a submit button here
      type: "plain_text",
      text: "Submit",
    },
  };
};
