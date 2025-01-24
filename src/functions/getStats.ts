import db from "../services/database";
  
interface Standup{
  question: string;
  answer: string;
}
  
  interface StandupResponse {
  teamId: string;
  userId: string;
  timestamp: string; // ISO 8601 format for date-time
  responses: Standup[]; // Array of response objects
  // hasBlocker: boolean; // Indicates if there are blockers
  }


  interface TeamDetails {
    name: string;
    totalMembers: number;
    activeProjects: number;
  }
  
  interface StandupStats {
    teamId: string;
    teamName: string;
    totalExpected: number;
    totalResponded: number;
    responseRate: number;
    averageResponseTime: number; // in minutes
    mostActiveMembers: string[]; // top 3 most responsive members
    pendingResponses: number;
    totalQuestions: number;
    averageAnswerLength: number;
  }
  
  export const getStats = async (teamId: string|null|undefined, date: Date = new Date()): Promise<StandupStats> => {
    try {
      if (!teamId) {
        throw new Error('teamId is missing or invalid');
      }
      
      // Fetch team details
      const teamSnapshot = await db.collection('teams').doc(teamId).get();
      const teamData = teamSnapshot.data();
      const teamMembers = teamData?.members || [];
  
      // Set date range for filtering
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
  
      // Fetch standups for the given date
      const standupSnapshot = await db.collection('standups')
        .where('teamId', '==', teamId)
        .where('timestamp', '>=', startOfDay)
        .where('timestamp', '<=', endOfDay)
        .get();
  
      const standups: StandupResponse[] = standupSnapshot.docs.map(doc => 
        doc.data() as StandupResponse
      );
  
      // Calculate detailed stats
      const totalExpected = teamMembers.length;
      const totalResponded = standups.length;
      const responseRate = totalExpected > 0
        ? Math.round((totalResponded / totalExpected) * 100)
        : 0;
  
      // Calculate average response time (mock implementation)
      const averageResponseTime = standups.length > 0 
        ? standups.reduce((sum, standup) => 
            sum + (new Date().getTime() - new Date(standup.timestamp).getTime()), 0) 
          / (standups.length * 60000) // convert to minutes
        : 0;
  
      // Find most active members (mock implementation)
      const mostActiveMembers = standups
        .map(standup => standup.userId)
        .filter((v, i, a) => a.indexOf(v) === i)
        .slice(0, 3);
  
      // Calculate total questions and average answer length
      const totalQuestions = standups.reduce((sum, standup) => 
        sum + standup.responses.length, 0);
      const averageAnswerLength = standups.reduce((sum, standup) => 
        sum + standup.responses.reduce((inner, response) => 
          inner + response.answer.length, 0), 0) 
        / (totalQuestions || 1);
  
      return {
        teamId,
        teamName: teamData?.name || 'Unnamed Team',
        totalExpected,
        totalResponded,
        responseRate,
        averageResponseTime: Math.round(averageResponseTime),
        mostActiveMembers,
        pendingResponses: totalExpected - totalResponded,
        totalQuestions,
        averageAnswerLength: Math.round(averageAnswerLength)
      };
    } catch (error) {
      console.error('Error calculating standup stats:', error);
      throw new Error('Failed to retrieve standup statistics');
    }
  };