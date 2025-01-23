import { WebClient } from "@slack/web-api";
import { resolveUserIds } from "../helpers/resolverUserIds";
import db from "../services/database";

interface Team {
  name: string;
  admins: string[];
  members: string[];
  timeZone: string; // Default value can be handled elsewhere
  standup: {standupDays: string[]; // Assuming standupDays is an array of strings
  standupTimes: string[]; // Assuming standupTimes is an array of strings
  reminderTimes: string[]; // Assuming reminderTimes is an array of strings
  questions: Question[]; // Array of Question objects}
}
}

interface Question {
  format: string; // Assuming questionFormat is a string
  text: string; // Assuming questionText is a string
  options: string[]; // Array of options derived from questionOptions
  required: boolean; // Boolean indicating if the question is required
}

export const addTeams = async (
 team: Team, client: WebClient
) => {
  try {
    // let questionsArray:string[] = [];

    if (!team.name) {
      throw new Error("Team name cannot be empty");
    }

    if (team.members.length === 0) {
      throw new Error("No valid memberNames provided");
    }


    console.log("Member Names", team.members);

    // Resolve user IDs
    const members = await resolveUserIds(team.members, client);

    if (members.length === 0) {
      throw new Error("No valid members resolved from input");
    }

    // Format the channel name to meet Slack's naming conventions
    const formattedChannelName = team.name
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
      name: team.name,
      admins: team.admins,
      members,
      teamstandupQuestions: team.standup,
      timeZone: team.timeZone,
      // Keep schedule field for backward compatibility
      // schedule: formattedStandups[0] ? `${formattedStandups[0].standupTime} ${formattedStandups[0].timeZone}` : "",
      createdAt: new Date().toISOString(),
    });

    if (failedInvites.length > 0) {
      return {
        success: true,
        teamId: result.channel.id,
        channelId: result.channel.id as string,
        message: `Team created, but failed to invite some users: ${failedInvites.join(
          ", "
        )}`,
      };
    }

    return {
      success: true,
      teamId: result.channel.id,
      channelId: result.channel.id as string,
    };
  } catch (error) {
    console.error("Error adding team:", error);
    return { success: false, error };
  }
};
