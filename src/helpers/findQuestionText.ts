
import db from "../services/database";


interface IQuestion {
    id: string;         // Unique identifier for the map
    options: string[];  // Array of options (assuming they are strings)
    required: boolean;  // Indicates if the field is required
    text: string;       // The text associated with the field
    type: "free_text";  // Type of input, in this case, fixed as "free_text"
}
  

// Utility function to find question text by question ID
export const findQuestionText = async (questionId: string): Promise<string | null> => {
    try {
      // Fetch all teams (you may need to adjust the query if teams are filtered)
      const teamsSnapshot = await db.collection("teams").get();
      if (teamsSnapshot.empty) {
        console.error("No teams found in the database.");
        return null;
      }
  
      // Iterate through teams to find the matching question
      for (const doc of teamsSnapshot.docs) {
        const team = doc.data();
        const questions = team.teamstandupQuestions?.questions || [];
  
        // Find the question with the matching ID
        const matchedQuestion = questions.find(
          (q: IQuestion) => q.id === questionId
        );
  
        if (matchedQuestion) {
          return matchedQuestion.text; // Return the question text
        }
      }
  
      console.error(`No matching question found for ID: ${questionId}`);
      return null;
    } catch (error) {
      console.error("Error finding question text:", error);
      return null;
    }
  };