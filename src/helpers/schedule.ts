import schedule from "node-schedule";
import { WebClient } from "@slack/web-api";
import { DateTime } from "luxon";
import { config } from "dotenv";
import db from "../services/database";
import { scheduleReminder } from "./scheduleReminder";

config();

// initializing slack web client
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN as string);

// an object to store scheduled jobs by team and standup ID
const scheduledJobs: {
  [teamId: string]: { [standupId: string]: schedule.Job[] };
} = {};

// schedule a standup message for a team
export const scheduleStandUpMessage = (
  teamId: string,
  teamData: TeamDocumentTypes
) => {
  const timezone = teamData.timeZone || "GMT";

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
      .filter((jobs) => Array.isArray(jobs))
      .flat()
      .forEach((job) => {
        if (job) {
          job.cancel();
        }
      });
    delete scheduledJobs[teamId];
    console.log(`Existing jobs for team ${teamId} canceled.`);
  }

  // Schedule standups for each configuration
  scheduledJobs[teamId] = {};

  teamData.teamstandupQuestions.forEach((standupConfig: any) => {
    const { id, standupDays, standupTimes } = standupConfig;

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

    scheduledJobs[teamId][id] = scheduledJobs[teamId][id] || [];

    standupDays.forEach((day: string) => {
      const dayOfWeek = DateTime.fromFormat(day, "cccc").weekday;

      standupTimes.forEach((time: string) => {
        const standUpTime = DateTime.fromISO(time, { zone: timezone });

        if (!standUpTime.isValid) {
          console.error(`Invalid standup time: ${time}, Timezone: ${timezone}`);
          return;
        }

        const jobRule = new schedule.RecurrenceRule();
        jobRule.dayOfWeek = dayOfWeek;
        jobRule.hour = standUpTime.hour;
        jobRule.minute = standUpTime.minute;
        jobRule.tz = timezone;


        const job = schedule.scheduleJob(jobRule, async () => {
          try {
            console.log(
              `Sending standup message from team: ${teamData.name}, Standup ID:${id}`
            );

            const blocks = [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `📢 *Standup Reminder for Team "${teamData.name}"*:\nPlease click the button below to fill out your standup report.`,
                },
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    text: {
                      type: "plain_text",
                      text: "Submit Standup",
                      emoji: true,
                    },
                    value: `standup_${id}`,
                    action_id: `submit_standup_${id}`,
                  },
                ],
              },
            ];

            const message = await slackClient.chat.postMessage({
              channel: teamId,
              blocks: blocks,
              text: `📢 *Standup Reminder for Team "${teamData.name}"*`,
            });

            // triggering reminders for non-respondent members
            if (teamData.teamstandupQuestions) {
              const reminderTimes = standupConfig.reminderTimes || [];
              scheduleReminder(teamId, id, reminderTimes, timezone);
            } else {
              console.log("Nothing in team standupQuestions");
            }

            const standupMessageTs = message.ts;

            // Storing the `ts` in a database for later use
            await db.collection("standups").doc(id).set(
              {
                messageTs: standupMessageTs,
                teamId: teamId,
              },
              { merge: true }
            );
          } catch (error) {
            console.error(
              `Error in standup job for team: ${teamData.name}, Standup ID: ${id}, channelID: ${teamId}`,
              error
            );
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
