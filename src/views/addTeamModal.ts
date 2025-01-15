export const addTeamModal = {
  type: "modal" as const,
  callback_id: "add_team_modal", // Define the callback id for the modal
  title: {
    type: "plain_text" as const,
    text: "Add New Team",
  },
  submit: {
    type: "plain_text" as const,
    text: "Create Team",
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
          type: "plain_text" as const,
          text: "eg. watchdogs",
        },
      },
    },
    {
      type: "input" as const,
      block_id: "team_members_block",
      label: {
        type: "plain_text" as const,
        text: "Enter team member name(s):",
      },
      element: {
        type: "multi_external_select" as const,
        action_id: "team_members",
        placeholder: {
          type: "plain_text" as const,
          text: "e.g. Ishmael",
        },
        min_query_length: 1,
      },
    },
  ],
};
