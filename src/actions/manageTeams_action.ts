import { App, UsersSelectAction, ViewSubmitAction  } from "@slack/bolt";
import { Block, ModalView, InputBlock, PlainTextInput, MultiStaticSelect,MultiUsersSelect, StaticSelect, SectionBlock } from '@slack/web-api';
import { addTeams } from "../functions/addTeams";
import { deleteTeamByID } from "../functions/deleteTeamByID";
import { updateTeamByID } from "../functions/updateTeamByID";
import { getTeamByID } from "../functions/getTeamByID";
import { OverflowAction, BlockAction,BlockElementAction, Middleware, SlackActionMiddlewareArgs } from "@slack/bolt";
import { publishManageTeamsView, publishEditTeamView, publishDeleteTeamView, publishCreateTeamModal, publishAddStandupModal } from "../views/manageTeams_view";


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


export const addStandUp_action = (app:App) => {
  //Listen for the add standup action
  app.action<BlockAction>("add_standup", async ({ ack, client, body }) => {
    await ack();
    const triggerId = body.trigger_id; // Get the trigger ID from the body

    // Extract the private metadata from the original view
    const privateMetadata = body.view?.private_metadata; // Get the private metadata
    if (!privateMetadata) {
        throw new Error("PrivateMetaData was not found in the Edit View");
    }

    try {
      await publishAddStandupModal(client, triggerId, privateMetadata)
      
    } catch (error) {
      console.error("❌ Error opening Add Standup Modal:", error);
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
        // Create the admins array including the user who is creating the team
        const admins:string[] = [body.user.id]; // Add the creator's ID as the first admin 

        // Get saved standups from private_metadata
        const savedStandups = JSON.parse(view.private_metadata || '{"standups":[]}').standups || [];

        const result = await addTeams(teamName, memberNames, admins, timeZone, client, savedStandups);
  
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
        
        console.log("Overflow Action Body Selected Option", body.actions[0].selected_option.value);
        // Access the selected option
        const selectedOption = body.actions[0].selected_option;
        const actionValue = selectedOption.value; // Get the value from the selected option

        const [actionType, teamId] = actionValue.split('-'); // Split to get action type and teamId
        const userId = body.user.id; // Get the user ID
        const triggerId = body.trigger_id; // Get the trigger ID from the body
    
        try {
        if (actionType === "edit") {
            // If "Edit Team" is selected
            await publishEditTeamView(client, userId, teamId);
            console.log("✅ Updated App Home with Edit Team Data");
        } else if (actionType === "delete") {
            // If "Delete Team" is selected
            await publishDeleteTeamView(client, triggerId, teamId);
            console.log("✅ Updated App Home with Delete Team Data");
        }
        } catch (error) {
        console.error("❌ Error handling overflow action:", error);
        }
      });

}

interface Team {
  id: string;
  createdAt: string; // ISO 8601 date string
  members: string[]; // Array of user IDs
  admins: string[];
  name: string; // Team name
  teamId: string; // Unique team identifier
  teamstandupQuestions: StandupQuestion[]; // Array of standup questions
  // reminderTimes: string[]; // Array of reminder times as strings
  // standupDays: string[]; // Array of standup days as strings
  // standupTimes: string[]; // Array of standup times as strings
  timeZone: string; // Time zone string
}

interface StandupQuestion {
  id: string; // Unique identifier for the question set
  questions: string[]; // Array of questions
  reminderTimes: string[]; // Array of reminder times as strings
  standupDays: string[]; // Array of standup days as strings
  standupTimes: string[]; // Array of standup times as strings
}

export const deleteStandup_action = (app:App) => {
    
  app.action(/delete_standup_\d+/, async ({ ack, action, client, body }) => {
    await ack();
  
    // Check if the action is of type BlockElementAction
    if ("action_id" in action) {
      try {
        // Extract the index of the standup to delete
        const standupIndex = parseInt(action.action_id.split("_").pop() || "0");
        const teamId = JSON.parse((body as BlockAction<OverflowAction>).view?.private_metadata || "").teamId; // Ensure private_metadata contains the team ID
  
        if (!teamId) {
          throw new Error("Team ID is missing.");
        }
  
        const team: Team = await getTeamByID(teamId);
  
        if (!team.teamstandupQuestions[standupIndex]) {
          throw new Error("Standup not found.");
        }
  
        // Remove the selected standup
        team.teamstandupQuestions.splice(standupIndex, 1);
  
        // Update the database
        await updateTeamByID(teamId, { teamstandupQuestions: team.teamstandupQuestions });
  
        // Re-publish the edit team view
        await publishEditTeamView(client, body.user.id, teamId);
  
        console.log(`✅ Standup ${standupIndex + 1} deleted for team ${teamId}`);
      } catch (error) {
        console.error("❌ Error deleting standup:", error);
  
        // Notify the user of the failure
        await client.chat.postMessage({
          channel: body.user.id,
          text: "❌ Failed to delete the standup. Please try again.",
        });
      }
    } else {
      console.error("❌ Unexpected action type.");
    }
  });  
  
}


export const editMemberOverflowActionListener = (app: App) => {
  app.action<BlockAction<OverflowAction>>(/overflow-action_.*/, async ({ ack, action, body, client }) => {
    await ack();

    try {
      const lastUnderscoreIndex = action.selected_option.value.lastIndexOf('_');
      const actionType = action.selected_option.value.substring(0, lastUnderscoreIndex);
      const memberId = action.selected_option.value.substring(lastUnderscoreIndex + 1);
      const teamId = JSON.parse(body.view?.private_metadata || "").teamId;

      if (!teamId) {
        throw new Error("Team ID was not found in the private metadata");
      }

      const team: Team = await getTeamByID(teamId); // Fetch team data

      // Assign admin role
      if (actionType === "assign_admin") {
        console.log(`Assigning admin role to member: ${memberId}`);
        if (!team.admins.includes(memberId)) {
          team.admins.push(memberId);
          await updateTeamByID(teamId, { admins: team.admins });

          try {
            let isUserInChannel = false;
            try{
              const membersResponse = await client.conversations.members({
              channel: team.teamId,
              });
              isUserInChannel = membersResponse.members?.includes(memberId) || false;
            } catch (error) {
              console.error("Error checking channel membership:", error);
            }

            // Invite the user if not in the channel
            if (!isUserInChannel) {
              await client.conversations.invite({
                channel: team.teamId,
                users: memberId,
              });
            }

            // Notify the user about their new role
            await client.chat.postMessage({
              channel: memberId,
              text: `Congratulations! You have been assigned as an admin for the team *${team.name}*.`,
            });

            // Optionally set Slack status (requires `users.profile:write` permission)
            await client.users.profile.set({
              user: memberId,
              profile: {
                status_text: 'Team Admin',
                status_emoji: ':crown:',
              },
            });
          } catch (error) {
            console.error("Error assigning admin role:", error);
          }
        }
      }

      // Remove admin role
      else if (actionType === "remove_admin") {
        console.log(`Removing admin role from member: ${memberId}`);
        if (team.admins.length > 1) {
          team.admins = team.admins.filter((admin) => admin !== memberId);
          await updateTeamByID(teamId, { admins: team.admins });
        } else {
          console.warn("Cannot remove the last admin from the team");
        }
      }

      // Remove member
      else if (actionType === "delete_member") {
        console.log(`Deleting member: ${memberId}`);
        if (team.members.length > 1) {
          team.members = team.members.filter((member) => member !== memberId);
          await updateTeamByID(teamId, { members: team.members });

          // Remove the member from the Slack channel
          try {
            await client.conversations.kick({
              channel: team.teamId,
              user: memberId,
            });
          } catch (error) {
            console.error("Error removing member from channel:", error);
          }

          // Notify the user about their removal
          await client.chat.postMessage({
            channel: memberId,
            text: `You have been removed from the team: *${team.name}*. If you think this was a mistake, please contact the admin.`,
          });
        } else {
          console.warn("Cannot remove the last member from the team");
        }
      }

      // Unrecognized action type
      else {
        console.error(`Unhandled action type: ${actionType}`);
      }

      // Refresh the view
      await publishEditTeamView(client, body.user.id, teamId);
      console.log(`Action ${actionType} completed successfully for member: ${memberId}`);
    } catch (error) {
      console.error("Error handling overflow action:", error);
    }
  });
};







export const addNewMember_action = (app: App) => {
  // Listener for adding a new user
  app.action<BlockAction>('users_select-action', async ({ ack, body, client }) => {
    await ack();

    try {
      // Ensure body.actions is not empty and the correct action type is accessed
      const selectedAction = body.actions[0];
      if (selectedAction && 'selected_user' in selectedAction) {
        const newUserId = selectedAction.selected_user; // Access selected_user directly
        const privateMetadata = body.view?.private_metadata;

        if (!privateMetadata) {
          throw new Error('Missing teamId in private_metadata');
        }

        const teamId = JSON.parse(privateMetadata).teamId; // Access teamId from view.private_metadata

        if (!teamId || !newUserId) {
          throw new Error('Missing required data in action');
        }

        const team: Team = await getTeamByID(teamId);

        // Add the new member to the team if not already in
        if (!team.members.includes(newUserId)) {
          team.members.push(newUserId); // Add the new member
          await updateTeamByID(teamId, { members: team.members });
        }

        // Add the member to the Slack channel
        try {
          await client.conversations.invite({
            channel: team.teamId, // Replace with your team's Slack channel ID
            users: newUserId,
          });

          // Notify the user they have been added
          await client.chat.postMessage({
            channel: newUserId,
            text: `You have been added to the team: *${team.name}* and its Slack channel.`,
          });

          console.log(`Successfully added user ${newUserId} to channel ${team.teamId}`);
        } catch (inviteError: any) {
          console.error('Error inviting user to channel:', inviteError);
          if (inviteError.data?.error === 'already_in_channel') {
            console.log('User is already a member of the channel.');
          } else if (inviteError.data?.error === 'not_in_channel') {
            console.log('Bot is not in the channel.');
          } else {
            console.warn('Failed to add user to the channel for another reason.');
          }
        }

        // Refresh the view
        await publishEditTeamView(client, body.user.id, teamId); // Refresh the view using context.user.id
      } else {
        throw new Error('Invalid action structure');
      }
    } catch (error) {
      console.error('Error adding new member:', error);
    }
  });
};



export const updateTeamName_action = (app: App) => {
  app.action<BlockAction>('plain_text_input-action', async ({ ack, body, action, client }) => {
    await ack();

    try {
      console.log("Inside Update Team Name");
      
      // Get the new name from the action
      const newName = (action as any).value;
      
      // Get teamId from private metadata
      const teamId = JSON.parse(body.view?.private_metadata || "").teamId;

      if (!newName || !teamId) {
        console.log("No new name provided or team ID missing");
        return;
      }

      // Format the channel name to meet Slack's requirements
      const formattedChannelName = newName
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, "")
        .replace(/\s+/g, "-")
        .slice(0, 80);

      // Update channel name in Slack
      await client.conversations.rename({
        channel: teamId,
        name: formattedChannelName,
      });

      // Update team name in database
      await updateTeamByID(teamId, { name: newName });
      
      // Refresh the view
      await publishEditTeamView(client, body.user.id, teamId);

      console.log(`Team name updated to: ${newName}`);
      
    } catch (error) {
      console.error('Error updating team name:', error);
      
      // If it's a Slack API error, log more details
      // if (error.data?.error) {
      //   console.error('Slack API error:', error.data.error);
      // }
    }
  });
};





export const addStandupModal_action = (app: App) => {
  app.view("add_standup_modal", async ({ ack, view, client, body }) => {
      await ack();

      try {

          const teamId = JSON.parse(body.view.private_metadata).teamId; // Ensure the team ID is in private metadata
          if (!teamId) {
              throw new Error("Team Id was not found in the Private Metadata");
          }

          // Safely access values with null checks
          const questions = view.state.values?.questions?.input?.value?.split("\n") || [];
          const reminderTimes = view.state.values?.reminderTimes?.input?.selected_options?.map(option => option.value) || [];
          const standupDays = view.state.values?.standupDays?.input?.selected_options?.map(option => option.value) || [];
          const standupTimes = view.state.values?.standupTimes?.input?.selected_options?.map(option => option.value) || [];

          const newStandup = {
            id: Date.now().toString(),
            questions: questions.map((q) => q.trim()),
            reminderTimes: reminderTimes.map((time) => time.trim()),
            standupDays: standupDays.map((day) => day.trim()),
            standupTimes: standupTimes.map((time) => time.trim()),
          };

          console.log("New Standup", newStandup);
          
          const team: Team = await getTeamByID(teamId);
          
          // Add the new standup
          team.teamstandupQuestions.push(newStandup);
          
          console.log("BEFORE UPDATING TEAM BY ID");
          // Update the database
          await updateTeamByID(teamId, { teamstandupQuestions: team.teamstandupQuestions });


          // Notify all team members
          const channelId = team.teamId; // Assume you have a channelId for the team
          await client.chat.postMessage({
            channel: channelId,
            text: `:tada: A new standup has been created! Here are the details:\n\n*Questions:* ${newStandup.questions.join(', ')}\n*Standup Days:* ${newStandup.standupDays.join(', ')}\n*Standup Times:* ${newStandup.standupTimes.join(', ')}\n*Reminder Times:* ${newStandup.reminderTimes.join(', ')}`
          });

          // Re-publish the edit team view
          await publishEditTeamView(client, body.user.id, teamId);

          console.log(`✅ New standup added for team ${teamId}`);
          // Notify the user of the failure
          await client.chat.postMessage({
            channel: body.user.id,
            text: `✅ New standup added for team ${teamId}`,
        });
      } catch (error) {
          console.error("❌ Error adding standup:", error);

          // Notify the user of the failure
          await client.chat.postMessage({
              channel: body.user.id,
              text: "❌ Failed to add the standup. Please try again.",
          });
      }
  });
};


export const deleteTeam_action = (app:App) => {
    
  app.view("delete_team_modal", async ({ ack, body, view, client }) => {
    await ack(); // Acknowledge the submission
  
    try {
      // Extract the team ID from the view's private metadata
      const {teamId, teamName} = JSON.parse(view.private_metadata);
      if(!teamId){
        throw Error("Team Id was not found in the Private Metadata")
      }
      if(!teamName){
        throw Error("Team Name was not found in the Private Metadata")
      }
  
      // Fetch the channel associated with the teamId
      const channelResponse = await client.conversations.info({ channel: teamId });

      if (!channelResponse.ok || !channelResponse.channel) {
        throw new Error("Channel associated with the teamId could not be found.");
      }

      const channelMembers = (channelResponse.channel as any)?.members || [];

      if (!Array.isArray(channelMembers) || channelMembers.length === 0) {
        console.warn("No members found in the channel to notify.");
      } else {
        // Notify all members of the channel about the deletion
        for (const memberId of channelMembers) {
          await client.chat.postMessage({
            channel: memberId,
            text: `🚨 The channel *${teamName}* (ID: ${teamId}) has been deleted. Please contact your admin if you have questions.`,
          });
        }
      }

      // Delete the channel
      await client.conversations.archive({ channel: teamId });


      // Notify only the user who initiated the delete
      await client.chat.postMessage({
        channel: body.user.id,
        text: `✅ The team *${teamName}* and its associated Slack channel (ID: ${teamId}) have been successfully deleted.`,
      });

      // Call the deleteTeamByID function to remove the team from the database
      await deleteTeamByID(teamId);

      // Republish the manage teams view to update the UI
      await publishManageTeamsView(client, body.user.id);
  
      // Notify the user who initiated the deletion
      await client.chat.postMessage({
        channel: body.user.id,
        text: `✅ The ${teamName} team and its associated Slack channel (ID: ${teamId}) have been successfully deleted.`,
      });
  
      console.log(`✅ Team with ID "${teamId}" deleted.`);
    } catch (error) {
      console.error("❌ Error deleting the team:", error);
  
      // Notify the user about the error
      await client.chat.postMessage({
        channel: body.user.id,
        text: `❌ An error occurred while trying to delete the team. Please try again later.`,
      });
    }
  });

}


