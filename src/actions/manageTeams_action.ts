import { App } from "@slack/bolt";
import { OverflowAction, BlockAction,Middleware, SlackActionMiddlewareArgs } from "@slack/bolt";
import { publishManageTeamsView, publishEditTeamView, publishDeleteTeamView, publishCreateTeamModal } from "../views/manageTeams_view";


export const manageTeams_action = (app:App) => {
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
}

export const createTeams_action = (app:App) => {
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
}


export const overflowMenu_action = (app:App) => {
    
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

}
export const deleteTeam_action = (app:App) => {
    
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

}