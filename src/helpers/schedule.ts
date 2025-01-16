import schedule from "node-schedule";
import { WebClient } from "@slack/web-api";
import { DateTime } from "luxon";
import { config } from "dotenv";

config();

// initializing slack web client
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN as string);

// schedule a standup message for a team
export const scheduleStandUpMessage = (teamData: any) => {
  const timezone = teamData.timezone || "GMT";
  const standUpTime = DateTime.fromISO(teamData.teamstandupTime, {
    zone: timezone,
  }); // convert time to appropriate time zone

  // schedule jobs for each standup day
  teamData.standupDays.forEach((day: string) => {
    const dayOfWeek = DateTime.fromFormat(day, "cccc").weekday; // for converting day name to week day

    // creating a rule for the specific time and day
    const jobRule = new schedule.RecurrenceRule();
    jobRule.dayOfWeek = dayOfWeek - 1; // node-schedule will use 0(Sunday) to 6(Saturday)
    jobRule.hour = standUpTime.hour;
    jobRule.minute = standUpTime.minute;
    jobRule.tz = timezone;

    // schedule the standup message
    schedule.scheduleJob(jobRule, async () => {
      console.log(`Sending standup message for team: ${teamData.name}`);

      const questions = teamData.teamstandupQuestions.join("\n");

      // send the message to each team member
      for (const memberId of teamData.members) {
        try {
          await slackClient.chat.postMessage({
            channel: memberId,
            text: `📢 *Standup Reminder for Team "${teamData.name}"*:\n${questions}`,
          });
        } catch (error) {
          console.error(`Error sending message to ${memberId}:`, error);
        }
      }
    });
    console.log(
      `Scheduled standup for ${
        teamData.name
      } on ${day} at ${standUpTime.toFormat("HH:mm")} ${timezone}`
    );
  });
};