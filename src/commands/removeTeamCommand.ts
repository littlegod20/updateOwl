import { App } from "@slack/bolt";
import { removeTeam } from "../functions/removeTeam";

export const removeTeamCommand = (app:App) => {
  // removing a team
  app.command("/remove-team", async ({ command, ack, client }) => {
    await ack();

    const teamId = command.text.trim();

    console.log("TeamID:", teamId);

    if (!teamId) {
      await client.chat.postMessage({
        channel: command.user_id,
        text: "❌ Please provide a valid team ID to remove",
      });
      return;
    }

    const result = await removeTeam(teamId, client);

    if (result.success) {
      console.log(result.message);
    } else {
      console.log(result.message);
    }

    await client.chat.postMessage({
      channel: command.user_id,
      text: result.success ? `✅ ${result.message}` : `.❌ ${result.message}`,
    });
  });
}