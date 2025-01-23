import db from "../services/database";

interface StandupResponse {
  userId: string;
  date: string;
  responseTime: string;
  response: { questionId: string; answer: string }[];
}

interface Standup {
  teamId: string;
  messageTs: string; // Unique identifier for the standup
  responses: StandupResponse[];
}

export const addStandup = async (standup: Standup) => {
  try {
    if (!standup.teamId) {
      throw new Error("Team ID is required.");
    }

    // Add the standup document to the database
    const standupRef = db.collection("standups").doc();
    await standupRef.set({
      teamId: standup.teamId,
      messageTs: standup.messageTs,
      responses: standup.responses,
      createdAt: new Date().toISOString(),
    });

    return {
      success: true,
      standupId: standupRef.id,
    };
  } catch (error) {
    console.error("Error adding standup:", error);
    return { success: false, error };
  }
};
