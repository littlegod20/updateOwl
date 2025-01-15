import { WebClient } from "@slack/web-api";
import { resolveUserIds } from "../helpers/resolverUserIds";
import db from "../services/database";

export const addTeams = async (
  teamName: string | null,
  memberNames: string[],
  client: WebClient
) => {
  try {
    if (!teamName) {
      throw new Error("Team name can not be empty");
    }

    if (memberNames.length === 0) {
      throw new Error("No valid memberNames provided");
    }

    // resolve user ids
    const members = await resolveUserIds(memberNames, client);

    if (members.length === 0) {
      throw new Error("No valid members resolved from input");
    }

    const teamRef = db.collection("teams").doc();
    const teamId = teamRef.id;

    // adding the team to the database
    await teamRef.set({
      teamId,
      name: teamName,
      members,
      schedule: "daily at 9am",
      createdAt: new Date().toISOString(),
    });

    // creating a new channel for the created team
    const result = await client.conversations.create({
      name: teamName.toLowerCase().replace(/\s/g, "-"),
      is_private: true,
    });

    if (!result.channel) {
      throw new Error("Channel creation failed");
    }

    // adding the members to the new channelU088CJ04PK5
    for (const member of members) {
      try {
        await client.conversations.invite({
          channel: result.channel.id as string,
          users: member,
        });
      } catch (error) {
        console.error(`Failed to invite user ${member}:`, error);
      }
    }

    return { success: true, teamId, channelId: result.channel.id as string };
  } catch (error) {
    console.error("Error adding team:", error);
    return { success: false, error };
  }
};
