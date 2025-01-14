import { App, LogLevel, ViewSubmitAction } from "@slack/bolt";
import db from "./services/database";
import { WebClient } from "@slack/web-api";
import { app } from "./bot.config";


const addTeams = async (
  teamName: string | null,
  admins: string[],
  client: WebClient
) => {
  try {
    const teamRef = db.collection("teams").doc();
    const teamId = teamRef.id;

    if (!teamName) {
      alert("Team name cannot be empty");
      throw new Error("Team name can not be empty");
    }

    // adding the team to the database
    await teamRef.set({
      teamId,
      name: teamName,
      admins,
      members: [],
      schedule: "daily at 9am",
      createdAt: new Date().toISOString(),
    });

    // creating a new channel for the created team
    const result = await client.conversations.create({
      name: teamName.toLowerCase().replace(/\s/g, "-"),
      is_private: true,
    });

    if (!result.channel) {
      throw new Error("result is not defined");
    }

    // adding the admins to the new channel
    for (const admin of admins) {
      await client.conversations.invite({
        channel: result.channel.id as string,
        users: admin,
      });
    }

    return { success: true, teamId, channelId: result.channel.id as string };
  } catch (error) {
    console.error("Error adding team:", error);
    return { success: false, error };
  }
};

// handling the modal submission
app.view<ViewSubmitAction>(
  "add_team_modal",
  async ({ ack, body, view, client }) => {
    await ack();

    // extract input values
    const teamName = view.state.values.team_name_block.team_name.value;
    const admins = view.state.values.team_admin_block.team_admins.value
      ?.split(",")
      .map((admin) => admin.trim());

    if (!teamName || !admins) {
      throw new Error("Team name or admin field is empty");
    }

    // call the addTeam function to add the team and create the channel
    const result = await addTeams(teamName, admins, client);

    if (result.success) {
      // notifying the user that the team and channel have been created
      await client.chat.postMessage({
        channel: body.user.id,
        text: `🎉 Team "${teamName}" and its channel have been created successfully`,
      });
    } else {
      await client.chat.postMessage({
        channel: body.user.id,
        text: "❌ Failed to create the team or the channel. Please try again.",
      });
    }
  }
);




// const addStandupResponse = async ({
//   teamId,
//   userId,
//   updates,
// }: {
//   teamId: string;
//   userId: string;
//   updates: {
//     yesterday: string;
//     today: string;
//     blockers: string[];
//   };
// }) => {
//   try {
//     const docRef = await db.collection("standups").add({
//       date: new Date().toISOString(),
//       teamId,
//       userId,
//       updates,
//     });
//     console.log("Standup added with ID:", docRef.id);
//   } catch (error) {
//     console.error("Error adding standup:", error);
//   }
// };

// const fetchStandups = async () => {
//   try {
//     const standups: object[] = [];
//     const snapshot = await db.collection("standups").get();
//     snapshot.forEach((doc) => {
//       standups.push({ id: doc.id, ...doc.data() });
//     });
//     console.log(standups);
//   } catch (error) {
//     console.error("Error fetching standups:", error);
//   }
// };
// fetchStandups();

// addStandupResponse({
//   userId: "U01ABCD1234",
//   teamId: "team123",
//   updates: {
//     yesterday: "Worked on project setup",
//     today: "Continue with API development",
//     blockers: ["Waiting for code review"],
//   },
// });

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("Bolt app is running!");
})();
