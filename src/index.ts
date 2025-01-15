import { registerAddTeamCommand } from "./commands/addTeamCommand";
import { removeMemberCommand } from "./commands/removeMemberCommand";
import { removeTeamCommand } from "./commands/removeTeamCommand";
import { app } from "./config/bot.config";

// Register the add-team command
registerAddTeamCommand(app);

// Remove team from db and channel from slack
removeTeamCommand(app);

// Remove team member from channel and dbs
removeMemberCommand(app);

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("Bolt app is running!");
  } catch (error) {
    console.error("Unable to start the app:", error);
  }
})();
