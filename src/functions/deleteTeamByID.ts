import db from "../services/database"; // Import the Firestore database instance

/**
 * Deletes a team from the Firebase Firestore database using the team ID.
 * @param {string} teamId - The ID of the team to be deleted.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the deletion was successful, otherwise throws an error.
 */
export const deleteTeamByID = async (teamId: string): Promise<boolean> => {
  try {
    // Reference to the specific document in the "teams" collection
    const teamRef = db.collection("teams");

    const querySnapshot = await teamRef.where("teamId", "==", teamId).get();

    // Check if any documents matched
    if (querySnapshot.empty) {
      console.log(`Team with teamId ${teamId} not found.`);
      return false; // Return false if no matching document was found
    }


    // Iterate over the results (in case of multiple matches, though ideally, there should be only one)
    querySnapshot.forEach(async (doc) => {
      // Delete the document
      await db.collection("teams").doc(doc.id).delete();
      console.log(`Team with ID ${doc.id} successfully deleted.`);
    });


    return true; // Return true after successful deletion
  } catch (error) {
    console.error("Error deleting team:", error);
    throw new Error(`Failed to delete team with ID "${teamId}".`);
  }
};
