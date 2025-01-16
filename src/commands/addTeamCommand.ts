import { App, ViewSubmitAction } from "@slack/bolt";
import { addTeamModal } from "../views/addTeamModal";

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



};


  // Handle the options request
  // app.options("team_members", async ({ payload, ack, client }) => {
  //   try {
  //     const query = payload.value.toLowerCase();
  //     const response = await client.users.list({
  //       limit: 100,
  //       cursor: undefined,
  //     });

  //     if (!response.members) {
  //       await ack({ options: [] });
  //       return;
  //     }

  //     // Filter users based on the query
  //     const matchingUsers = response.members
  //       .filter(
  //         (user) =>
  //           !user.is_bot &&
  //           !user.deleted &&
  //           (user.profile?.email?.toLowerCase().includes(query) ||
  //             user.profile?.real_name?.toLowerCase().includes(query) ||
  //             user.name?.toLowerCase().includes(query))
  //       )
  //       .slice(0, 20); // Limit results to 20

  //     // Map matching users to options
  //     const options = matchingUsers.map((user) => ({
  //       text: {
  //         type: "plain_text" as const,
  //         text: user.profile?.real_name || user.name || '',
  //       },
  //       value: user.id,
  //     }));

  //     await ack({ options });
  //   } catch (error) {
  //     console.error("Error handling options request:", error);
  //     await ack({ options: [] }); // Return an empty array on failure
  //   }
  // });