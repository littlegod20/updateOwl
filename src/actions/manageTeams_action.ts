import { App, ViewSubmitAction  } from "@slack/bolt";
import { ModalView, InputBlock, PlainTextInput, MultiStaticSelect, StaticSelect, SectionBlock } from '@slack/web-api';
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

  // Handle saving individual standups
  app.action('save_standup', async ({ ack, body, client }) => {
    await ack();


    try {

    const viewState = ( body as BlockAction).view?.state?.values;
    const standupQuestions = viewState?.standup_questions_block?.standup_questions?.value || "";
    const standupDays = viewState?.standup_day_block?.standup_days?.selected_options?.map((o: any) => o.value) || [];
    const standupTimes = viewState?.standup_time_block?.standup_times?.selected_options?.map((o: any) => o.value) || [];
    const timeZone = viewState?.time_zone_block?.time_zone?.selected_option?.value;
    // const reminderDays = viewState?.reminder_day_block?.reminder_days?.selected_options?.map((o: any) => o.value) || [];
    const reminderTimes = viewState?.reminder_time_block?.reminder_times?.selected_options?.map((o: any) => o.value) || [];

    // Logging the values
    // console.log("Payload:", JSON.stringify(body, null, 2));
    console.log("View State:", JSON.stringify((body as BlockAction).state, null, 2));
    console.log("Standup Questions:", standupQuestions);
    // viewState?.standup_day_block?.standup_days?.selected_options?.map((o: any) => console.log(o.value))
    console.log("Standup Days:", standupDays);
    console.log("Standup Times:", standupTimes);
    console.log("Time Zone:", timeZone);
    // console.log("Reminder Days:", reminderDays);
    console.log("Reminder Times:", reminderTimes);

    // Create new standup object
    const newStandup = {
      id: Date.now().toString(),
      questions: standupQuestions.includes('\n') ? standupQuestions.split('\n'): [standupQuestions],
      standupDays,
      standupTimes,
      timeZone,
      reminderTimes
    };
    
    console.log("New Standup: ", newStandup);

    // Update the view to show saved standup
    const currentBlocks = (body as BlockAction).view?.blocks;
    const savedStandupsIndex: number | undefined = currentBlocks?.findIndex((block: any) => block.block_id === 'saved_standups_section');
    
    //Prepare the success message block
    const successMessageBlock = {
      type: "section",
      text: {
          type: "mrkdwn",
          text: ":white_check_mark: Standup saved successfully!.Feel Free To Create Another Standup" // Success message
      }
    };

    if (savedStandupsIndex && savedStandupsIndex !== -1  && currentBlocks) {
      console.log("Inside savedStandupsIndex && savedStandupsIndex !== -1  && currentBlocks")
      currentBlocks.splice(savedStandupsIndex, 0, successMessageBlock); // Insert before

      let savedStandupText = "Saved Standups:\n";
      savedStandupText += `• Questions: ${newStandup.questions.join(', ')}\n`;
      savedStandupText += `• Days: ${newStandup.standupDays.join(', ')}\n`;
      savedStandupText += `• Time: ${newStandup.standupTimes.join(', ')} ${newStandup.timeZone}\n`;
      savedStandupText += `• Reminders: ${newStandup.standupDays.join(', ')} at ${newStandup.reminderTimes.join(', ')}`;
      

      const existingSavedStandupsBlock  = currentBlocks?.find(block => block.block_id === 'saved_standups_section') as SectionBlock;

      if (existingSavedStandupsBlock && existingSavedStandupsBlock.text) {
        existingSavedStandupsBlock.text = {
          type: "mrkdwn",
          text: savedStandupText,
        };
      } else {
        currentBlocks[savedStandupsIndex] = {
          type: "section",
          block_id: "saved_standups_section",
          text: {
            type: "mrkdwn",
            text: savedStandupText
          }
        };
        console.error("Error: saved_standups_section block not found");
      }
    } else {
      console.error("saved_standups_section block not found");
    }



    // Type guard function
    function isInputBlock(block: any): block is InputBlock {
      return block.type === 'input';
    }

    console.log("Before updating view")

    const updatedView: ModalView = {
      type: "modal",
      callback_id: "add_team_modal",
      title: (body as BlockAction).view?.title || { type: "plain_text", text: "Standup Settings" },
      submit: (body as BlockAction).view?.submit || { type: "plain_text", text: "Save" },
      close: (body as BlockAction).view?.close || { type: "plain_text", text: "Cancel" },
      blocks: currentBlocks?.map((block, index) => {
          console.log("inside block " + index);
          if (isInputBlock(block) && block.element) {
              if (block.element.type === 'plain_text_input') {
                  (block.element as PlainTextInput).initial_value = '';
              } else if (block.element.type === 'multi_static_select') {
                  const multiSelectElement = block.element as MultiStaticSelect;
                  if (multiSelectElement.initial_options) {
                      multiSelectElement.initial_options = [];
                  }
                  // if (multiSelectElement.options) {
                  //     delete multiSelectElement.options
                  // }
              } else if (block.element.type === 'static_select') {
                  const staticSelectElement = block.element as StaticSelect;
                   if (staticSelectElement.initial_option) {
                      delete staticSelectElement.initial_option;
                  }
                  // (block.element as MultiStaticSelect).selected_options = [];
                  //  if (staticSelectElement.options) {
                  //     delete staticSelectElement.options
                  // }
              }
          }
          return block;
      }) || [],
      private_metadata: JSON.stringify({
          standups: [...JSON.parse((body as BlockAction).view?.private_metadata || '{"standups":[]}').standups, newStandup]
      })
  };

    
    console.log("Before  await client.views.update ")
    await client.views.update({
      view_id: (body as BlockAction).view?.id || "",
      hash: (body as BlockAction).view?.hash,
      view: updatedView
    });
    
    // Clear the input fields
    // Note: Slack doesn't provide a direct way to clear input fields in a modal
    // The best practice is to show success feedback and let users input new values
  } catch (error) {
    console.error("Error handling action:", error);
  }
});
  
  
  
  
  // handling the modal submission
   app.view<ViewSubmitAction>("add_team_modal",  async ({ ack, body, view, client }) => {
    
    const errors: { [key: string]: string } = {};
    // Extract input values safely
    const teamName = view.state.values?.team_name_block?.team_name?.value || "";
    const memberNames = view.state.values.team_members_block.team_members.selected_users; 

    // Safely extract standup questions, standup time, and time zone
    // const standupQuestions = view.state.values?.standup_questions_block?.standup_questions?.value || "";
    // const standupTime = view.state.values?.standup_time_block?.standup_time?.selected_time;
    const timeZone = view.state.values?.time_zone_block?.time_zone?.selected_option?.value;
    // const reminderTimes = view.state.values.reminder_time_block.reminder_times.selected_options?.map(
    //   (option) => option.value
    // );

      // if (!reminderTimes || reminderTimes.length === 0) {
      //   errors["reminder_time_block"] = "Please select at least one Reminder Time.";
      //   throw new Error("No reminder times selected");
      // }

      // Get saved standups from private_metadata
      const savedStandups = JSON.parse(view.private_metadata || '{"standups":[]}').standups || [];

      if (savedStandups.length === 0) {
        errors["saved_standups_section"] = "Please save at least one standup configuration before creating the team.";
        throw new Error("Please save at least one standup configuration before creating the team.");
      }

      if (!memberNames || memberNames.length === 0) {
        errors["team_members_block"] = "Please select at least one team member.";
        throw new Error("No valid admins selected");
      }

      if (!teamName) {
        errors["team_name_block"] = "Please enter a team name.";
        throw new Error("Team name is empty");
      }
      
      // if (!standupQuestions) {
      //   errors["standup_questions_block"] = "Please enter at least one standup question.";
      //   throw new Error("StandUp Questions is empty");
      // }
      
      // if (!standupTime) {

      //   errors["standup_time_block"] = "Please select a time for the standup.";
      //   throw new Error("Please Select A StandUp Time");
      // }
  
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
        // Get saved standups from private_metadata
        const savedStandups = JSON.parse(view.private_metadata || '{"standups":[]}').standups || [];

        const result = await addTeams(teamName, memberNames, timeZone, client, savedStandups);
  
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


