import schedule from "node-schedule";
import { WebClient } from "@slack/web-api";
import { DateTime } from "luxon";
import { config } from "dotenv";

config();

// initializing slack web client
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN as string);

// an object to store scheduled jobs by team and standup ID
const scheduledJobs: {
  [teamId: string]: { [standupId: string]: schedule.Job[] };
} = {};

// schedule a standup message for a team
export const scheduleStandUpMessage = (teamId: string, teamData: any) => {
  const timezone = teamData.timezone || "GMT";
  console.log("TimeZone:", timezone);

  if (
    !teamData.teamstandupQuestions ||
    teamData.teamstandupQuestions.length === 0
  ) {
    console.log(`No standup configurations found for team: ${teamData.name}`);
    return;
  }

  // cancel existing jobs for the team
  if (scheduledJobs[teamId]) {
    Object.values(scheduledJobs[teamId])
      .flat()
      .forEach((job) => job.cancel());
    delete scheduledJobs[teamId];
    console.log(`Existing jobs for team ${teamId} canceled.`);
  }

  // Schedule standups for each configuration
  scheduledJobs[teamId] = {};

  teamData.teamstandupQuestions.forEach((standupConfig: any) => {
    const { id, questions, standupDays, standupTimes } = standupConfig;

    if (
      !standupDays ||
      !standupTimes ||
      standupDays.length === 0 ||
      standupTimes.length === 0
    ) {
      console.log(
        `Skipping invalid standup configuration for team: ${teamData.name}`
      );
      return;
    }

    scheduledJobs[teamId][id] = [];

    standupDays.forEach((day: string) => {
      const dayOfWeek = DateTime.fromFormat(day, "cccc").weekday;

      standupTimes.forEach((time: string) => {
        const standUpTime = DateTime.fromISO(time, { zone: timezone });

        const jobRule = new schedule.RecurrenceRule();
        jobRule.dayOfWeek = dayOfWeek - 1;
        jobRule.hour = standUpTime.hour;
        jobRule.minute = standUpTime.minute;
        jobRule.tz = timezone;

        const job = schedule.scheduleJob(jobRule, async () => {
          console.log(
            `Sending standup message from team: ${teamData.name}, Standup ID:${id}`
          );

          const questionText = questions.join("\n");

          for (const memberId of teamData.members) {
            try {
              await slackClient.chat.postMessage({
                channel: memberId,
                text: `📢 *Standup Reminder for Team "${teamData.name}"*:\n${questionText}`,
              });
            } catch (error) {
              console.error(`Error sending message to ${memberId}:`, error);
            }
          }
        });

        scheduledJobs[teamId][id].push(job);
         console.log(
           `Scheduled standup for ${
             teamData.name
           } on ${day} at ${standUpTime.toFormat(
             "HH:mm"
           )} ${timezone}, Standup ID: ${id}`
         );
      });
    });
  });
};
