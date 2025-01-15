import { WebClient } from "@slack/web-api";
import db from "../services/database";
import { getDocumentByField } from "../helpers/getDocumentByField";

export const removeTeam = async (teamId: string, client: WebClient) => {
  try {
    // Query the "teams" collection to find the team by ID or name
    const teamDoc = await getDocumentByField("teams", "teamId", teamId); // Replace with "name" if you prefer

    if (!teamDoc) {
      return { success: false, message: "Team not found" };
    }
    // Extract necessary data from team document
    const teamData = teamDoc;

    console.log("Team Data:", teamData);

    // Archiving the Slack channel if it exists
    if (teamData.teamId) {
      console.log("archiving...");
      await client.conversations.archive({ channel: teamData.teamId });
    }

    // Deleting the team from Firestore using the document ID
    await db.collection("teams").doc(teamData.id).delete();

    return { success: true, message: "Team removed successfully" };
  } catch (error) {
    console.error("Error removing team:", error);
    return { success: false, message: "Failed to remove the team" };
  }
};
