import { scheduleStandUpMessage } from "../helpers/schedule";
import db from "../services/database";

export const initializeSchedules = async () => {
  try {
    const teamSnapshot = await db.collection("teams").get();

    if (teamSnapshot.empty) {
      console.log("No teams found.");
      return;
    }

    teamSnapshot.docs.forEach((teamDoc) => {
      const teamData = { teamId: teamDoc.id, ...teamDoc.data() };
      scheduleStandUpMessage(teamDoc.id, teamData);
    });
    console.log("All standup schedules initialized.");
  } catch (error) {
    console.log("Error initializing schedules:", error);
  }
};
