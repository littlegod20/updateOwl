import { App, LogLevel } from "@slack/bolt";
import { OverflowAction, BlockAction,Middleware, SlackActionMiddlewareArgs } from "@slack/bolt";
import db from "./services/database";
import dotenv from "dotenv";
import { publishHomeView } from "./services/home_view";
import { publishStandupView } from "./services/standup_view";
import { publishManageTeamsView, publishEditTeamView, publishDeleteTeamView, publishCreateTeamModal } from "./services/manageTeams_view";


dotenv.config();




const app = new App({
  token: process.env.SLACK_BOT_TOKEN as string,
  signingSecret: process.env.SLACK_SIGNING_SECRET as string,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN as string,
  // logLevel: LogLevel.DEBUG,
});

app.message(/hello/i, async ({ say }) => {
  try {
    say("Hello there");
  } catch (err) {
    console.log("err");
  }
});


// addStandupResponse({
//   userId: "U01ABCD1234",
//   teamId: "team123",
//   updates: {
//     yesterday: "Worked on project setup",
//     today: "Continue with API development",
//     blockers: ["Waiting for code review"],
//   },
// });


// addStandupResponse();
// app.event("app_home_opened", async ({ event, say }) => {
//   say(`Hello World and <@${event.user}>!.Would You Like Me To Take You Through How Too Use The UpdateOwl Bot?`)
// });


app.event("app_home_opened", async ({ event, client }) => {
  try {
    // Fetch user info to personalize the greeting
    const userInfo = await client.users.info({ user: event.user });
    const userName = userInfo.user?.real_name || "there";

    // Call the reusable function to publish the default App Home view
    await publishHomeView(client, userName, event.user);

    console.log("✅ App Home updated with dashboard view");

  } catch (error) {

    console.error("❌ Error updating App Home:", error);

  }
});


app.action("go_back", async ({ ack, client, body }) => {
  await ack(); // Acknowledge the action

  try{    
    // Fetch user info to personalize the greeting
    const userInfo = await client.users.info({ user: body.user.id });
    const userName = userInfo.user?.real_name || "there";
    
    // Re-publish the default App Home view
    await publishHomeView(client, userName, body.user.id)
    
    console.log("✅ Reset App Home to default view");
  }catch (error) {

    console.error("❌ Error Going Back To App Home:", error);

  }
});

app.action("go_back_to_manage_teams_view", async ({ ack, client, body }) => {
  await ack(); // Acknowledge the action

  try{    
    // Fetch user info to personalize the greeting
    const userInfo = await client.users.info({ user: body.user.id });
    const userName = userInfo.user?.real_name || "there";
    
    // Re-publish the default Manage Teams view
    await publishManageTeamsView(client, body.user.id);

    
    console.log("✅ Reset App Home to Manage Teams view");
  }catch (error) {

    console.error("❌ Error Going Back To Manage Teams View:", error);

  }
});


app.action("view_standups", async ({ ack, client, body }) => {
  console.log("Viewing Standups");
  await ack(); // Acknowledge the action

  try{

    await publishStandupView(client, body.user.id);
    
    console.log("✅ Updated App Home with standup data");
  }catch (error) {

    console.error("❌ Error Fetching Standup View: ", error);

  }
});

app.action("manage_teams", async ({ ack, client, body }) => {
  console.log("Viewing Manage Teams");
  await ack(); // Acknowledge the action

  try{

    await publishManageTeamsView(client, body.user.id);
    
    console.log("✅ Updated App Home with Manage Teams Data");
  }catch (error) {

    console.error("❌ Error Fetching Manage Teams View: ", error);

  }
});


// Listen for the Create Team button action
app.action<BlockAction>("create_team", async ({ ack, body, client }) => {
  await ack(); // Acknowledge the action

  // const userId = body.user.id; // Get the user ID
  const triggerId = body.trigger_id; // Get the trigger ID from the body

  try {
    // Call the function to handle creating a new team
    await publishCreateTeamModal(client, triggerId);
    console.log("✅ Opened modal for creating a new team");
    
  } catch (error) {
    console.error("❌ Error handling create team action:", error);
  }
});



// Listen for overflow menu actions
app.action<BlockAction<OverflowAction>>("overflow-action", async ({ ack, body, client }) => {
  await ack(); // Acknowledge the action

  const selectedValue = body.actions[0].selected_option.value; // Get the selected option's value
  const userId = body.user.id; // Get the user ID
  const triggerId = body.trigger_id; // Get the trigger ID from the body

  try {
    if (selectedValue === "value-0") {
      // If "Edit Team" is selected
      await publishEditTeamView(client, userId);
      console.log("✅ Updated App Home with Edit Team Data");
    } else if (selectedValue === "value-1") {
      // If "Delete Team" is selected
      await publishDeleteTeamView(client, triggerId);
      console.log("✅ Updated App Home with Delete Team Data");
    }
  } catch (error) {
    console.error("❌ Error handling overflow action:", error);
  }
});

app.view("delete_team_modal", async ({ ack, body, client }) => {
  // Acknowledge the modal submission
  await ack();

  // Perform your deletion logic (e.g., delete from your database)
  console.log(`Standup deleted by user: ${body.user.id}`);

  // Send a confirmation message
  await client.chat.postMessage({
    channel: body.user.id,
    text: "This team has been successfully deleted.",
  });
});


(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Bolt app is running!");
})();


