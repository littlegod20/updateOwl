import { App, ViewSubmitAction } from "@slack/bolt";
import { addTeamModal } from "../views/addTeamModal";
import { addTeams } from "../functions/addTeams";

export const registerAddTeamCommand = (app: App) => {
  app.command("/add-team", async ({ command, ack, client }) => {
    await ack();

    // Open the "Add Team" modal when the slash command is used
    try {
      await client.views.open({
        trigger_id: command.trigger_id,
        view: addTeamModal,
      });
    } catch (error) {
      console.error("Error opening modal:", error);
    }
  });

  // handling the modal submission
  app.view<ViewSubmitAction>(
    "add_team_modal",
    async ({ ack, body, view, client }) => {
      await ack();

      // extract input values
      const teamName = view.state.values.team_name_block.team_name.value;
      const memberNames =
        view.state.values.team_members_block.team_members.selected_options?.map(
          (item) => item.text.text
        );

      if (!memberNames || memberNames.length === 0) {
        throw new Error("No valid admins selected");
      }

      if (!teamName) {
        throw new Error("Team name is empty");
      }

      // call the addTeam function to add the team and create the channel
      const result = await addTeams(teamName, memberNames, client);

      // notifying the user that the team and channel have been created
      await client.chat.postMessage({
        channel: body.user.id,
        text: result.success
          ? `🎉 Team "${teamName}" and its channel have been created successfully`
          : "❌ Failed to create the team or the channel. Please try again.",
      });
    }
  );

  // Handle the options request
  app.options("team_members", async ({ payload, ack, client }) => {
    try {
      const query = payload.value.toLowerCase();
      const response = await client.users.list({
        limit: 100,
        cursor: undefined,
      });

      if (!response.members) {
        await ack({ options: [] });
        return;
      }

      // Filter users based on the query
      const matchingUsers = response.members
        .filter(
          (user) =>
            !user.is_bot &&
            !user.deleted &&
            (user.profile?.email?.toLowerCase().includes(query) ||
              user.profile?.real_name?.toLowerCase().includes(query) ||
              user.name?.toLowerCase().includes(query))
        )
        .slice(0, 20); // Limit results to 20

      // Map matching users to options
      const options = matchingUsers.map((user) => ({
        text: {
          type: "plain_text" as const,
          text: user.profile?.real_name || user.name || '',
        },
        value: user.id,
      }));

      await ack({ options });
    } catch (error) {
      console.error("Error handling options request:", error);
      await ack({ options: [] }); // Return an empty array on failure
    }
  });
};
