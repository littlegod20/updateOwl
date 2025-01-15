import { registerAddTeamCommand } from "./commands/addTeamCommand";
import { app } from "./config/bot.config";
import { removeTeam } from "./functions/removeTeam";

// Register the add-team command
registerAddTeamCommand(app);

app.command("/remove-team", async ({ command, ack, client }) => {
  await ack();

  const teamId = command.text.trim();

  console.log('TeamID:',teamId)

  if (!teamId) {
    await client.chat.postMessage({
      channel: command.user_id,
      text: "❌ Please provide a valid team ID to remove",
    });
    return;
  }

  const result = await removeTeam(teamId, client);

  if(result.success){
    console.log(result.message)
  } else{
    console.log(result.message)
  }

  await client.chat.postMessage({
    channel: command.user_id,
    text: result.success ? `✅ ${result.message}` : `.❌ ${result.message}`,
  });
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("Bolt app is running!");
  } catch (error) {
    console.error("Unable to start the app:", error);
  }
})();
