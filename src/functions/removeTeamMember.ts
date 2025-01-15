import { WebClient } from "@slack/web-api";
import db from "../services/database";
import { getDocumentByField } from "../helpers/getDocumentByField";

export const removeTeamMember = async (
  teamId: string,
  memberId: string,
  client: WebClient
) => {
  try {
    // fetching team data

    const teamDoc = await getDocumentByField("teams", "teamId", teamId);

    if (!teamDoc) {
      return { success: false, message: "Team not found!" };
    }

    // updating the members list in the database
    const membersArr = teamDoc.members as string[];
    const updatedMembers = membersArr?.filter((id) => id !== memberId);

    if (updatedMembers.length === teamDoc?.members.length) {
      return { success: false, message: "Member not found in the team" };
    }

    // Updating the firestore document
    const teamRef = db.collection("teams").doc(teamDoc.id as string);
    await teamRef.update({ members: updatedMembers });

    // removing the member from the slack channel
    if (teamDoc?.teamId) {
      await client.conversations.kick({
        channel: teamDoc.teamId as string,
        user: memberId,
      });
    }

    return { success: true, message: "Member removed successfully" };
  } catch (error) {
    console.error("Error removing team member:", error);
    return { success: false, message: "Failed to remove member from team" };
  }
};
