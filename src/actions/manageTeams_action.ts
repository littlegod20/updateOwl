import { App, ViewSubmitAction } from "@slack/bolt";
import { addTeams } from "../functions/addTeams";
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


export const addTeamModal_action = (app: App) => {
   // handling the modal submission
   app.view<ViewSubmitAction>("add_team_modal",  async ({ ack, body, view, client }) => {
    
    const errors: { [key: string]: string } = {};
    // Extract input values safely
    const teamName = view.state.values?.team_name_block?.team_name?.value || "";
    const memberNames = view.state.values.team_members_block.team_members.selected_users; 

    // Safely extract standup questions, standup time, and time zone
    const standupQuestions = view.state.values?.standup_questions_block?.standup_questions?.value || "";
    const standupTime = view.state.values?.standup_time_block?.standup_time?.selected_time;
    const timeZone = view.state.values?.time_zone_block?.time_zone?.selected_option?.value;
    const reminderTimes = view.state.values.reminder_time_block.reminder_times.selected_options?.map(
      (option) => option.value
    );

      if (!reminderTimes || reminderTimes.length === 0) {
        errors["reminder_time_block"] = "Please select at least one Reminder Time.";
        throw new Error("No reminder times selected");
      }

      if (!memberNames || memberNames.length === 0) {
        errors["team_members_block"] = "Please select at least one team member.";
        throw new Error("No valid admins selected");
      }

      if (!teamName) {
        errors["team_name_block"] = "Please enter a team name.";
        throw new Error("Team name is empty");
      }
      
      if (!standupQuestions) {
        errors["standup_questions_block"] = "Please enter at least one standup question.";
        throw new Error("StandUp Questions is empty");
      }
      
      if (!standupTime) {

        errors["standup_time_block"] = "Please select a time for the standup.";
        throw new Error("Please Select A StandUp Time");
      }
  
      if (!timeZone) {
        errors["time_zone_block"] = "Please select a time zone.";
        throw new Error("Please Select A Time Zone");

      }
      
      // If there are errors, send them back to the modal
      if (Object.keys(errors).length > 0) {
        await ack({
          response_action: "errors",
          errors,
        });
        return;
      }

      // If no errors, proceed to create the team
      await ack();
      
      try {
        const result = await addTeams(teamName, memberNames, client, standupTime, standupQuestions, timeZone);
  
        // Notify the user that the team and channel have been created
        await client.chat.postMessage({
          channel: body.user.id,
          text: result.success
            ? `🎉 Team "${teamName}" and its channel have been created successfully!`
            : "❌ Failed to create the team or channel. Please try again.",
        });
      } catch (error) {
        console.error("Error creating team:", error);
        await client.chat.postMessage({
          channel: body.user.id,
          text: "❌ An error occurred while creating the team. Please try again.",
        });
      } 
    }
  );
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


