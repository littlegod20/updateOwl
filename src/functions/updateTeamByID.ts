import db from "../services/database";

/**
 * Updates a specific team's data in the Firebase Firestore database.
 * @param {string} teamId - The ID of the team to update.
 * @param {Partial<any>} updateData - An object containing the fields to update.
 * @returns {Promise<void>} Resolves if the update is successful.
 */
export const updateTeamByID = async (teamId: string, updateData: Partial<any>): Promise<void> => {
  try {
    // Reference to the "teams" collection
    const teamsRef = db.collection("teams");

    // Query to find a document with a matching teamId field
    const querySnapshot = await teamsRef.where("teamId", "==", teamId).get();

    // Check if any documents matched
    if (querySnapshot.empty) {
      console.log(`Team with teamId ${teamId} not found.`);
      throw new Error("Team not found.");
    }

    // Get the first matching document's reference
    const docRef = querySnapshot.docs[0].ref;

    // Update the document with the new data
    await docRef.update(updateData);

    console.log(`Team with teamId ${teamId} successfully updated.`);
  } catch (error) {
    console.error("Error updating team by teamId field:", error);
    throw new Error("Unable to update the team. Please try again later.");
  }
};
