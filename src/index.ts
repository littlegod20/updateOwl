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
import {viewAnalytics_action} from "./actions/viewAnalytics_action"
import {handleStandupDashboardActions } from "./actions/handleStandupActions_action"
import {handleAnalyticsActions } from "./actions/handleAnalyticsActions_action"
import {
  editMemberOverflowActionListener,
  manageTeams_action,
  createTeams_action,
  addTeamModal_action,
  overflowMenu_action,
  deleteTeam_action,
  deleteStandup_action,
  addStandUp_action,
  addStandupModal_action,
  addNewMember_action,
  updateTeamName_action,
} from "./actions/manageTeams_action";
import { app } from "./config/bot.config";
import { appHome_event } from "./events/appHome_event";
import { initializeSchedules } from "./functions/initializeSchedules";
import { listenForTeamUpdates } from "./helpers/listenForTeamUpdates";
import { handleButtonClick } from "./helpers/handleButtonClick";
import { handleModalSubmission } from "./helpers/handleModalSubmission";
import { handleAddQuestion } from "./helpers/handleAddQuestion";
import db from "./services/database";
import { getDocumentByField } from "./helpers/getDocumentByField";

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
handleStandupDashboardActions(app);

viewAnalytics_action(app);
handleAnalyticsActions(app);

manageTeams_action(app);

createTeams_action(app);
addTeamModal_action(app);
updateTeamName_action(app);

addNewMember_action(app);
editMemberOverflowActionListener(app);

addStandUp_action(app);
addStandupModal_action(app);

overflowMenu_action(app);

deleteTeam_action(app);
deleteStandup_action(app);
// deleteMember_action(app);

// Register the action handler for button clicks
app.action(/standup_/, async ({ body, ack }) => {
  // Acknowledge the action to Slack
  await ack();

  // Pass the payload to the handler
  await handleButtonClick(body);
});


app.view("standup_submission", async ({ ack, body, client }) => {
  await ack(); // Acknowledge the modal submission

  try {
    // Call the submission handler function
    await handleModalSubmission(body);
  } catch (error) {
    console.error("Error handling modal submission:", error);
  }
});


app.action("add_question", async ({ ack, body, client }) => {
  // Acknowledge the action
  await ack();

  // Extract the current blocks from the modal
  const view = (body as any).view; // The current modal view
  const existingBlocks = view.blocks; // Blocks currently in the modal
  const action = (body as any).actions[0];
  const blockId = action.block_id;
  const sharedPrefix = blockId.split("_format")[0];
  console.log(`Format for ${sharedPrefix}:`);
  // Call handleAddQuestion to update the modal
  await handleAddQuestion(view, client, existingBlocks);
});

app.action("format_select", async ({ ack, body, client }) => {
  await ack();
  const action = (body as any).actions[0];
  const selectedFormat = action.selected_option.value;
  const blockId = action.block_id; // E.g., "standup_1_format"

  // Extract the shared prefix (e.g., "standup_1")
  const sharedPrefix = blockId.split("_format")[0];

  console.log(`Format for ${sharedPrefix}: ${selectedFormat}`);
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
