import { App, LogLevel } from "@slack/bolt";
import { OverflowAction, BlockAction,Middleware, SlackActionMiddlewareArgs } from "@slack/bolt";
// import db from "./services/database";
import dotenv from "dotenv";
import { registerAddTeamCommand } from "./commands/addTeamCommand";
import { removeMemberCommand } from "./commands/removeMemberCommand";
import { removeTeamCommand } from "./commands/removeTeamCommand";
import {goBack_action, goBackToManageTeams_action} from "./actions/goBack_action"
import {viewStandups_action} from "./actions/viewStandups_action"
import {editMemberOverflowActionListener, manageTeams_action, createTeams_action, addTeamModal_action, overflowMenu_action, deleteTeam_action, deleteStandup_action, addStandUp_action, addStandupModal_action , addNewMember_action, updateTeamName_action } from "./actions/manageTeams_action"
import { app } from "./config/bot.config";
import { appHome_event } from "./events/appHome_event";

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

goBack_action(app)

goBackToManageTeams_action(app);

viewStandups_action(app);

manageTeams_action(app);

createTeams_action(app);
addTeamModal_action(app);
updateTeamName_action(app);

addNewMember_action(app);
editMemberOverflowActionListener(app);

addStandUp_action(app)
addStandupModal_action(app)

overflowMenu_action(app);

deleteTeam_action(app);
deleteStandup_action(app);
// deleteMember_action(app);


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
  } catch (error) {
    console.error("Unable to start the app:", error);
  }
})();











