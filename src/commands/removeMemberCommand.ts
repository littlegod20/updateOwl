import { App } from "@slack/bolt";
import { removeTeamMember } from "../functions/removeTeamMember";

export const removeMemberCommand = (app:App) =>{
  // removing a member from a team;
  app.command("/remove-member", async ({ command, ack, client }) => {
    await ack();

    const [teamId, memberId] = command.text.trim().split(" ");

    if (!teamId || !memberId) {
      await client.chat.postMessage({
        channel: command.user_id,
        text: "❌ Please provide both team ID and the member ID to remove",
      });
      return;
    }

    const result = await removeTeamMember(teamId, memberId, client);

    await client.chat.postMessage({
      channel: command.user_id,
      text: result.success ? `✅ ${result.message}` : `❌ ${result.message}`,
    });

    if (result.success) {
      console.log("Success:", result.message);
    } else {
      console.log("Failed:", result.message);
    }
  });
}