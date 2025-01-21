import db from "../services/database";

/**
 * Fetches a specific team from the Firebase Firestore database based on the teamId.
 * @param {string} teamId - The ID of the team to fetch.
 * @returns {Promise<any>} The team data, or null if not found.
 */

export const getTeamByID = async (teamId: string): Promise<any | null> => {
  try {
    // Reference to the "teams" collection
    const teamsRef = db.collection("teams");

    // Query to find a document with a matching teamId field
    const querySnapshot = await teamsRef.where("teamId", "==", teamId).get();

    // Check if any documents matched
    if (querySnapshot.empty) {
      console.log(`Team with teamId ${teamId} not found.`);
      return null;
    }

    // Return the first matching document's data
    const doc = querySnapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data(),
    };
  } catch (error) {
    console.error("Error fetching team by teamId field:", error);
    throw new Error("Unable to fetch the team. Please try again later.");
  }
};
