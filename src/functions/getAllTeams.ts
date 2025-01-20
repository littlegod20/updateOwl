import db from "../services/database";

/**
 * Fetches all teams from the Firebase Firestore database.
 * @returns {Promise<any[]>} An array of teams.
 */
export const getAllTeams = async (): Promise<any[]> => {
  try {
    // Reference to the "teams" collection in the database
    const teamsRef = db.collection("teams");

    // Retrieve all documents from the "teams" collection
    const snapshot = await teamsRef.get();

    // If no teams are found, return an empty array
    if (snapshot.empty) {
      console.log("No teams found in the database.");
      return [];
    }

    // Map through the documents and return their data
    const teams = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID if needed
      ...doc.data(), // Spread the team data from the document
    }));

    // console.log("Retrieved teams:", teams);
    return teams;
  } catch (error) {
    console.error("Error fetching teams from Firestore:", error);
    throw new Error("Unable to fetch teams. Please try again later.");
  }
};
