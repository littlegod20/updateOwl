import { scheduledJobs } from "node-schedule";
import db from "../services/database";
import { scheduleStandUpMessage } from "./schedule";

export const listenForTeamUpdates = () => {
  db.collection("teams").onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
      const teamId = change.doc.id;
      const teamData = { teamId, ...change.doc.data() };

      if (change.type === "added" || change.type === "modified") {
        console.log(`Team ${teamId} added/modified.`);
        scheduleStandUpMessage(teamId, teamData); // Add or update schedules
      }

      if (change.type === "removed") {
        console.log(`Team ${change.doc.data().name} removed.`);
        if (scheduledJobs[teamId]) {
          Object.values(scheduledJobs[teamId])
            .flat()
            .forEach((job) => job.cancel());
          delete scheduledJobs[teamId];
          console.log(`Jobs for team ${teamId} canceled.`);
        }
      }
    });
  });
};
