import db from "../services/database";
import { FieldValue } from "firebase-admin/firestore";

export const handleModalSubmission = async (payload: any) => {
  // console.log("payload frm sbms:", payload);
  if (
    payload.type === "view_submission" &&
    payload.view.callback_id === "standup_submission"
  ) {
    const { standupId, teamId } = JSON.parse(payload.view.private_metadata);
    // const teamId = payload.team.id;
    const userId = payload.user.id;

    console.log("teamId from submission:", teamId);

    // console.log("teamId from modal submission:", payload);
    // console.log("userId from modal submission:", userId);
    // console.log("standupId from modal submission:", standupId);

    // Extract responses from modal submission
    const answers = Object.entries(payload.view.state.values).map(
      ([, blockData]) => {
        const answerKey = Object.keys(blockData as object)[0]; // e.g., "answer_0"
        const typedBlockData = blockData as {
          [key: string]: { value: string };
        };
        return typedBlockData[answerKey].value; // Return only the answer string
      }
    );

    console.log(`Standup answers from ${userId} for team ${teamId}:`, answers);

    // Current response time
    const responseTime = new Date().toISOString();

    try {
      // Reference to the standup document
      const standupDocRef = db.collection("standups").doc(standupId);
      // Check if the standup document exists
      const standupDoc = await standupDocRef.get();
      console.log("reference:", standupDoc);
      if (!standupDoc.exists) {
        // If the document does not exist, create it with an initial structure
        await standupDocRef.set({
          id: standupId,
          teamId,
          responses: [
            {
              userId,
              response: answers,
              responseTime,
            },
          ],
        });
        console.log("Standup document created successfully!");
      } else {
        // If the document exists, update the `responses` array
        await standupDocRef.update({
          responses: FieldValue.arrayUnion({
            userId,
            response: answers,
            responseTime,
          }),
        });
        console.log("Standup response added successfully!");
      }
      console.log("Standup responses saved successfully!");
    } catch (error) {
      console.error("Error saving standup responses:", error);
    }
  } else {
    console.log("No submission action has taken place");
  }
};
