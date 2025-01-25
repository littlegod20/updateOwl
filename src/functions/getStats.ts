import db from "../services/database";
import { getDocumentByField } from "../helpers/getDocumentByField";
import { getTeamByID } from "./getTeamByID";
  
interface IResponse{
    answer: string; 
    questionId: string;      // Unique identifier for the question
    questionType: string;    // Type of the question (e.g., "rating")
}

interface Standup{
response: IResponse[]          // The answer provided by the user
responseTime: string;     // Timestamp of when the response was given
userId: string;
}

interface StandupResponse {
teamId: string;
// userId?: string;
messageTs: string; // ISO 8601 format for date-time
responses: Standup[]; // Array of response objects
}

// Define the type for a single question
interface StandupQuestion {
    id: string; // e.g., "1737640585993"
    options: string[]; // e.g., ["1", "2", "3", "4", "5"]
    required: boolean; // e.g., true
    text: string; // e.g., "How difficult is today's task"
    type: string; // e.g., "rating"
}

// Define the type for the team structure
interface Team {
admins: string[]; // e.g., ["U0889H52ABF", "U087XTCCQUF"]
createdAt: string; // e.g., "2025-01-23T13:56:38.378Z"
members: string[]; // e.g., ["U087XTCCQUF", "U0889H52ABF"]
name: string; // e.g., "theo's new team"
teamId: string; // e.g., "C089JDX9C15"
teamstandupQuestions: {
    questions: StandupQuestion[]; // Array of StandupQuestion
};
reminderTimes: string[]; // e.g., ["15:00", "12:00"]
standupDays: string[]; // e.g., ["Monday", "Thursday"]
standupTimes: string[]; // e.g., ["13:58", "15:00"]
timeZone: string; // e.g., "GMT"
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

  const getTimeStamps = (date: string) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = startOfDay.getTime() / 1000;
    const endTimestamp = endOfDay.getTime() / 1000;
    return {startTimestamp, endTimestamp};
}

  export const getStats = async (teamId: string | undefined, date: string | undefined): Promise<StandupStats> => {
    try {
      if (!teamId) {
        throw new Error('teamId is missing or invalid');
      }
      if (!date) {
        throw new Error('date is missing or invalid');
      }
  
      console.log("TeamId", teamId)
      console.log("DATE", date)
      // Fetch team details
      const teamData = await getTeamByID(teamId);
  
      if (!teamData) {
        throw new Error('Team not found');
      }
  
      // Set date range for filtering
      const {startTimestamp, endTimestamp} = getTimeStamps(date);
  

      let standupSnapshotQuery, standupSnapshot;
      // Fetch standups for the given date
       standupSnapshotQuery = (db.collection('standups')as  FirebaseFirestore.Query)

        standupSnapshot = standupSnapshotQuery.where('messageTs', '>=', `${startTimestamp}`)
        .where('messageTs', '<=', `${endTimestamp}`)
        
        standupSnapshot = await standupSnapshot.get();

        console.log("Standup Snapshot", standupSnapshot.docs);
        // for(let doc in standupSnapshot.docs){
        //     console.log("Standup Snapshot", doc.data());
        // }

      
  
    const standups: StandupResponse[] = standupSnapshot.docs
    .map((doc) => {
        const standup = doc.data() as StandupResponse;
        return standup.teamId === teamId ? standup : undefined;
    })
    .filter((standup): standup is StandupResponse => standup !== undefined);

    console.log("Standups", standups);
      
  
      // Calculate detailed stats
      const totalExpected = teamData.members.length;
      const totalQuestions = teamData.teamstandupQuestions?.questions?.length || 0;
      
      const respondedUserIds = new Set(
        standups.map(standup => 
          standup.responses.map(response => response.userId)
        )
      );
      const totalResponded = respondedUserIds.size;
  
      const responseRate = totalExpected > 0
        ? Math.round((totalResponded / totalExpected) * 100)
        : 0;
  
      // Calculate average response time
      const responseTimes = standups.flatMap(standup => 
        standup.responses.map(response => 
          new Date(response.responseTime).getTime()
        )
      );
      const averageResponseTime = responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
        : 0;
  
      // Find most active members
      const memberResponseCounts = standups.reduce((counts, standup) => {
        standup.responses.forEach(response => {
          counts[response.userId] = (counts[response.userId] || 0) + 1;
        });
        return counts;
      }, {} as Record<string, number>);
  
      const mostActiveMembers = Object.entries(memberResponseCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(entry => entry[0]);
  
      // Calculate average answer length
      const totalAnswerLength = standups.reduce((sum, standup) => 
        sum + standup.responses.reduce((innerSum, response) => 
          innerSum + response.response.reduce((lengthSum, r) => 
            lengthSum + r.answer.length, 0
          ), 0
        ), 0
      );
  
      return {
        teamId,
        teamName: teamData.name,
        totalExpected,
        totalResponded,
        responseRate,
        averageResponseTime: Math.round(averageResponseTime / 60000), // convert to minutes
        mostActiveMembers,
        pendingResponses: totalExpected - totalResponded,
        totalQuestions,
        averageAnswerLength: Math.round(totalAnswerLength / (totalQuestions || 1))
      };
  
    } catch (error) {
      console.error('Error calculating standup stats:', error);
      throw new Error('Failed to retrieve standup statistics');
    }
  };
  
//   export const getStats = async (teamId: string|undefined, date: Date = new Date()): Promise<StandupStats> => {
//     try {
//       if (!teamId) {
//         throw new Error('teamId is missing or invalid');
//       }
      
//       // Fetch team details
//       const teamSnapshot = await db.collection('teams').doc(teamId).get();
//       const teamData = teamSnapshot.data();
//       const teamMembers = teamData?.members || [];
  
//       // Set date range for filtering
//       const startOfDay = new Date(date);
//       startOfDay.setHours(0, 0, 0, 0);
//       const endOfDay = new Date(date);
//       endOfDay.setHours(23, 59, 59, 999);
  
//       // Fetch standups for the given date
//       const standupSnapshot = await db.collection('standups')
//         .where('teamId', '==', teamId)
//         .where('timestamp', '>=', startOfDay)
//         .where('timestamp', '<=', endOfDay)
//         .get();
  
//       const standups: StandupResponse[] = standupSnapshot.docs.map(doc => 
//         doc.data() as StandupResponse
//       );
  
//       // Calculate detailed stats
//       const totalExpected = teamMembers.length;
//       const totalResponded = standups.length;
//       const responseRate = totalExpected > 0
//         ? Math.round((totalResponded / totalExpected) * 100)
//         : 0;
  
//       // Calculate average response time (mock implementation)
//       const averageResponseTime = standups.length > 0 
//         ? standups.reduce((sum, standup) => 
//             sum + (new Date().getTime() - new Date(standup.timestamp).getTime()), 0) 
//           / (standups.length * 60000) // convert to minutes
//         : 0;
  
//       // Find most active members (mock implementation)
//       const mostActiveMembers = standups
//         .map(standup => standup.userId)
//         .filter((v, i, a) => a.indexOf(v) === i)
//         .slice(0, 3);
  
//       // Calculate total questions and average answer length
//       const totalQuestions = standups.reduce((sum, standup) => 
//         sum + standup.responses.length, 0);
//       const averageAnswerLength = standups.reduce((sum, standup) => 
//         sum + standup.responses.reduce((inner, response) => 
//           inner + response.answer.length, 0), 0) 
//         / (totalQuestions || 1);
  
//       return {
//         teamId,
//         teamName: teamData?.name || 'Unnamed Team',
//         totalExpected,
//         totalResponded,
//         responseRate,
//         averageResponseTime: Math.round(averageResponseTime),
//         mostActiveMembers,
//         pendingResponses: totalExpected - totalResponded,
//         totalQuestions,
//         averageAnswerLength: Math.round(averageAnswerLength)
//       };
//     } catch (error) {
//       console.error('Error calculating standup stats:', error);
//       throw new Error('Failed to retrieve standup statistics');
//     }
//   };