import { scheduledJobs } from "node-schedule";
import db from "../services/database";
import { scheduleStandUpMessage } from "./schedule";

export const listenForTeamUpdates = () => {
  db.collection("teams").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const teamData = {...change.doc.data() } as TeamDocumentTypes;

      if (change.type === "added" || change.type === "modified") {
        console.log(`Team ${teamData.teamId} added/modified.`);
        scheduleStandUpMessage(teamData.teamId, teamData); // Add or update schedules
      }

      if (change.type === "removed") {
        console.log(`Team ${teamData.teamId} removed.`);
        if (scheduledJobs[teamData.teamId]) {
          Object.values(scheduledJobs[teamData.teamId])
            .flat()
            .forEach((job) => job.cancel());
          delete scheduledJobs[teamData.teamId];
          console.log(`Jobs for team ${teamData.teamId} canceled.`);
        }
      }
    });
  });
};
