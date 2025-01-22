import db from "../services/database";
import { FieldValue } from "firebase-admin/firestore";
import { WebClient } from "@slack/web-api";

// Initialize Slack client
const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

export const handleModalSubmission = async (payload: any) => {
  if (
    payload.type === "view_submission" &&
    payload.view.callback_id === "standup_submission"
  ) {
    const { standupId, teamId } = JSON.parse(payload.view.private_metadata);
    const userId = payload.user.id;

    console.log("standupId:", standupId);

    console.log("userId:", userId);

    // Extract answers dynamically based on input type
    const answers = Object.entries(payload.view.state.values).map(
      ([blockId, blockData]) => {
        const actionId = Object.keys(blockData as object)[0];
        const inputData = (blockData as any)[actionId];

        // Handle different input types (plain_text_input, static_select, etc.)
        if (inputData.type === "plain_text_input") {
          return {
            questionId: blockId,
            answer: inputData.value,
          };
        } else if (inputData.type === "static_select") {
          return {
            questionId: blockId,
            answer: inputData.selected_option?.value,
          };
        } else {
          return { questionId: blockId, answer: null }; // Handle other cases if needed
        }
      }
    );

    const today = new Date().toISOString().split("T")[0];
    const responseTime = new Date().toISOString();

    try {
      const standupDocRef = db.collection("standups").doc(standupId);
      const standupDoc = await standupDocRef.get();

      if (standupDoc.exists) {
        // Add response to the database
        await standupDocRef.update({
          responses: FieldValue.arrayUnion({
            userId,
            response: answers,
            responseTime,
            date: today,
          }),
        });

        // Get the `ts` of the initial standup message
        const standupMessageTs = standupDoc.data()?.messageTs;

        if (standupMessageTs) {
          // Post response in a thread
          await slackClient.chat.postMessage({
            channel: teamId,
            text: `📋 *Response from <@${userId}>:*\n${answers
              .map(
                (answer, index) =>
                  `Q${index + 1}: ${answer.answer || "No response"}`
              )
              .join("\n")}`,
            thread_ts: standupMessageTs,
          });
        }

        await slackClient.chat.postMessage({
          channel: userId,
          text: "Thank you for submitting your standup responses!",
        });
      } else {
        console.error("Standup document not found.");
      }
    } catch (error) {
      console.error("Error handling modal submission:", error);
    }
  } else {
    console.log("No submission action has taken place.");
  }
};
