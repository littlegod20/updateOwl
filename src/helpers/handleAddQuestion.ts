export const handleAddQuestion = async (
  view: any,
  client: any,
  existingBlocks: any
) => {
  // Find the index of the "Add Another Question" button
  const buttonIndex = existingBlocks.findIndex(
    (block: any) => block.block_id === "add_question_button_block"
  );

  if (buttonIndex === -1) {
    console.error("Button not found in the blocks.");
    return;
  }

  // Count the existing question blocks
  const questionCount = existingBlocks.filter((block: any) =>
    block.block_id?.startsWith("question_")
  ).length;

  // Calculate the new question number for the label
  const newQuestionNumber = questionCount + 1;

  // Create new blocks for the question and format type
  const newBlocks = [
    {
      type: "input",
      block_id: `question_${newQuestionNumber}`,
      label: {
        type: "plain_text",
        text: `Question ${newQuestionNumber}`,
        emoji: true,
      },
      element: {
        type: "plain_text_input",
        action_id: `question_input_${newQuestionNumber}`,
        placeholder: {
          type: "plain_text",
          text: "Enter your question",
        },
      },
    },
    {
      type: "section",
      block_id: `format_${newQuestionNumber}`,
      text: {
        type: "mrkdwn",
        text: "Select format Type:",
      },
      accessory: {
        type: "static_select",
        action_id: `format_select_${newQuestionNumber}`,
        placeholder: {
          type: "plain_text",
          text: "Choose a format",
        },
        options: [
          {
            text: {
              type: "plain_text",
              text: "Text",
              emoji: true,
            },
            value: "text",
          },
          {
            text: {
              type: "plain_text",
              text: "Number",
              emoji: true,
            },
            value: "number",
          },
          {
            text: {
              type: "plain_text",
              text: "Multiple Choice",
              emoji: true,
            },
            value: "multiple_choice",
          },
        ],
      },
    },
  ];

  // Insert new blocks right after the button block
  const updatedBlocks = [
    ...existingBlocks.slice(0, buttonIndex + 1), // All blocks up to and including the button
    ...newBlocks, // Add the new question/format blocks
    ...existingBlocks.slice(buttonIndex + 1), // Add the remaining blocks after the button
  ];

  // Update the modal view with the new blocks
  await client.views.update({
    view_id: view.id,
    hash: view.hash, // To prevent race conditions
    view: {
      type: "modal",
      callback_id: "add_team_modal",
      title: {
        type: "plain_text",
        text: "Add Team",
      },
      blocks: updatedBlocks,
      submit: {
        type: "plain_text",
        text: "Submit",
      },
    },
  });
};
