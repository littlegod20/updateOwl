import { WebClient } from "@slack/web-api";
import { resolveUserIds } from "../helpers/resolverUserIds";
import db from "../services/database";

export const addTeams = async (
  teamName: string | null,
  memberNames: string[],
  client: WebClient,
  standupTime: string,
  standupQuestions: string,
  timeZone: string,
) => {
  try {

    let questionsArray:string[] = [];

    if (!teamName) {
      throw new Error("Team name cannot be empty");
    }

    if (memberNames.length === 0) {
      throw new Error("No valid memberNames provided");
    }

    if(standupQuestions){
      // Check if standupQuestions contains a newline character
      questionsArray = standupQuestions.includes('\n')
      ? standupQuestions.split('\n')  // Split by newline if it exists
      : [standupQuestions];            // Create an array with the single question

      console.log(questionsArray); // Output the resulting array
    }

    // Resolve user IDs
    const members = await resolveUserIds(memberNames, client);

    if (members.length === 0) {
      throw new Error("No valid members resolved from input");
    }

    // Format the channel name to meet Slack's naming conventions
    const formattedChannelName = teamName
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80);

    // Create a new private channel for the team
    const result = await client.conversations.create({
      name: formattedChannelName,
      is_private: true,
    });

    if (!result.channel) {
      throw new Error("Channel creation failed");
    }

    // Add the members to the new channel
    const failedInvites: string[] = [];
    for (const member of members) {
      try {
        await client.conversations.invite({
          channel: result.channel.id as string,
          users: member,
        });
      } catch (error) {
        console.error(`Failed to invite user ${member}:`, error);
        failedInvites.push(member);
      }
    }

    // Store the team details in the database
    const teamRef = db.collection("teams").doc();
    await teamRef.set({
      teamId: result.channel.id,
      name: teamName,
      members,
      teamstandupQuestions: [{
        questions: questionsArray,
        teamstandupTime: standupTime
      }],
      schedule: `${standupTime} ${timeZone}`,
      createdAt: new Date().toISOString(),
    });

    if (failedInvites.length > 0) {
      return {
        success: true,
        teamId: result.channel.id,
        channelId: result.channel.id as string,
        message: `Team created, but failed to invite some users: ${failedInvites.join(", ")}`,
      };
    }

    return { success: true, teamId: result.channel.id, channelId: result.channel.id as string };
  } catch (error) {
    console.error("Error adding team:", error);
    return { success: false, error };
  }
};
