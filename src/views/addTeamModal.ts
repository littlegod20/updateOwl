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
        text: "Please enter the name of the team:",
      },
      element: {
        type: "plain_text_input" as const,
        action_id: "team_name",
        placeholder: {
          type: "plain_text" as const,
          text: "Enter team name",
        },
      },
    },
    {
      type: "input" as const,
      block_id: "team_admin_block",
      label: {
        type: "plain_text" as const,
        text: "Enter admin emails, usernames, or display names (comma-separated):",
      },
      element: {
        type: "multi_external_select" as const,
        action_id: "team_admins",
        placeholder: {
          type: "plain_text" as const,
          text: "e.g. johndoes@example.com, Ishmael",
        },
        min_query_length: 1,
      },
    },
  ],
};
