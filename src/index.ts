import { registerAddTeamCommand } from "./commands/addTeamCommand";
import { app } from "./config/bot.config";

// Register the add-team command
registerAddTeamCommand(app);

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("Bolt app is running!");
  } catch (error) {
    console.error("Unable to start the app:", error);
  }
})();
