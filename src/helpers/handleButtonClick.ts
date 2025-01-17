import { WebClient } from "@slack/web-api";
import db from "../services/database";
import { getDocumentByField } from "./getDocumentByField";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN as string);

export const handleButtonClick = async (payload: any) => {
  const teamId = payload.channel.id;

  // console.log("TeamId:", payload);

  try {
    // parsing standupId from the button's value
    const standupId = payload.actions[0].value.split("standup_TeamA_")[1];

    console.log("payloadStandupID:", standupId);
    // console.log("standupId:", JSON.parse(payload.actions[0].value));

    // Fetch standup questions for the team from the database
    const teamDoc = await getDocumentByField("teams", "teamId", teamId);

    if (!teamDoc) {
      console.error(`No data found for teamId: ${teamId}`);
      return;
    }

    const teamData = teamDoc;
    // console.log("TeamData:", teamData);
    const standupQuestions = teamData?.teamstandupQuestions || [];

    console.log("Stanup Questions:", standupQuestions);

    if (standupQuestions.length === 0) {
      console.log(`No standup questions configured for teamId: ${teamId}`);
      return;
    }

    // Find the matching standup configuration
    const standupConfig = standupQuestions.find((config) => {
      console.log("configId:", config.id);
      console.log("standupID:", standupId);
      console.log("type of confitgID:", typeof config.id)
      console.log("type of standupID:", typeof standupId);
      return config.id === standupId;
    });

    console.log("standup Config:", standupConfig);

    if (!standupConfig) {
      console.error(`Standup configuration not found for ID: ${standupId}`);
      return;
    }

    // console.log("Matched standup configuration:", standupConfig);

    // Dynamically generate modal blocks based on fetched questions
    const modalBlocks = standupConfig.questions.map(
      (question: string, index: number) => ({
        type: "input",
        block_id: `question_${index}`,
        element: {
          type: "plain_text_input",
          action_id: `answer_${index}`,
        },
        label: {
          type: "plain_text",
          text: question,
        },
      })
    );

    // Open the modal with dynamically generated blocks
    await slackClient.views.open({
      trigger_id: payload.trigger_id,
      view: {
        type: "modal",
        callback_id: "standup_submission",
        private_metadata: JSON.stringify({
          standupId,
          teamId:teamData.teamId,
        }),
        title: {
          type: "plain_text",
          text: "Submit Your Standup",
        },
        blocks: modalBlocks,
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    console.error("Error handling button click:", error);
  }
};
