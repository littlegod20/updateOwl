// import db from "./services/database";
import dotenv from "dotenv";
import { registerAddTeamCommand } from "./commands/addTeamCommand";
import { removeMemberCommand } from "./commands/removeMemberCommand";
import { removeTeamCommand } from "./commands/removeTeamCommand";
import {
  goBack_action,
  goBackToManageTeams_action,
} from "./actions/goBack_action";
import { viewStandups_action } from "./actions/viewStandups_action";
import {
  manageTeams_action,
  createTeams_action,
  addTeamModal_action,
  overflowMenu_action,
  deleteTeam_action,
} from "./actions/manageTeams_action";
import { app } from "./config/bot.config";
import { appHome_event } from "./events/appHome_event";
import { initializeSchedules } from "./functions/initializeSchedules";
import { listenForTeamUpdates } from "./helpers/listenForTeamUpdates";
import { handleButtonClick } from "./helpers/handleButtonClick";
import { handleModalSubmission } from "./helpers/handleModalSubmission";

dotenv.config();

// Register the add-team command
registerAddTeamCommand(app);

// Remove team from db and channel from slack
removeTeamCommand(app);

// Remove team member from channel and dbs
removeMemberCommand(app);

//register listener for app home event
appHome_event(app);

//register listeners for Button actions in the App Home

goBack_action(app);

goBackToManageTeams_action(app);

viewStandups_action(app);

manageTeams_action(app);

createTeams_action(app);
addTeamModal_action(app);

overflowMenu_action(app);

deleteTeam_action(app);

// Listen for button clicks
app.action(/^submit_standup_.*/, async ({ ack, body }) => {
  await ack();
  await handleButtonClick(body);
});

// Listen for modal submissions
app.view("standup_submission", async ({ ack, body }) => {
  await ack();
  await handleModalSubmission(body);
});

app.message(/hello/i, async ({ say }) => {
  try {
    say("Hello there");
  } catch (err) {
    console.log("err");
  }
});

(async () => {
  try {
    await app.start(process.env.PORT || 3000);
    console.log("Bolt app is running!");

    // initializing existing schedules
    await initializeSchedules();

    // start listening for real-time team updates
    listenForTeamUpdates();

    console.log("Bot initialized and ready.");
  } catch (error) {
    console.error("Unable to start the app:", error);
  }
})();
