import { WebClient } from "@slack/web-api";
import db from "../services/database";
import { getDocumentByField } from "./getDocumentByField";

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN as string);

export const handleButtonClick = async (payload: any) => {
  const teamId = payload.channel.id;
  const userId = payload.user.id


  try {
    // parsing standupId from the button's value
    const standupId = payload.actions[0].value.split("standup_")[1];

    // Fetch standup questions for the team from the database
    const teamDoc = await getDocumentByField("teams", "teamId", teamId);

    if (!teamDoc) {
      console.error(`No data found for teamId: ${teamId}`);
      return;
    }

    const teamData = teamDoc;
    const standupQuestions = teamData?.teamstandupQuestions || [];

    if (standupQuestions.length === 0) {
      console.log(`No standup questions configured for teamId: ${teamId}`);
      return;
    }

    // Find the matching standup configuration
    const standupConfig = standupQuestions.find((config) => {
      return config.id === standupId;
    });


    if (!standupConfig) {
      console.error(`Standup configuration not found for ID: ${standupId}`);
      return;
    }

    // Check if the user has already submitted for today
    const today = new Date().toISOString().split("T")[0];
    const standupDocRef = db.collection("standups").doc(standupId);
    const standupDoc = await standupDocRef.get();


     if (standupDoc.exists) {
       const responses = standupDoc.data()?.responses || [];
       const hasRespondedToday = responses.some(
         (response: any) =>
           response.userId === userId && response.date === today
       );

       if (hasRespondedToday) {
         // Open a modal indicating the user has already submitted
         await slackClient.views.open({
           trigger_id: payload.trigger_id,
           view: {
             type: "modal",
             callback_id: "standup_already_submitted",
             title: {
               type: "plain_text",
               text: "Already Submitted",
             },
             close: {
               type: "plain_text",
               text: "Close",
             },
             blocks: [
               {
                 type: "section",
                 text: {
                   type: "mrkdwn",
                   text: `You have already submitted your standup responses for <#${teamId}|${teamData.name}> today!`,
                 },
               },
             ],
           },
         });
         return;
       }
     }

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
          teamId: teamData.teamId,
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
