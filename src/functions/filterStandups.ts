import db from "../services/database";

interface Standup{
question: string;
answer: string;
}

interface StandupResponse {
teamId: string;
userId?: string;
messageTs: string; // ISO 8601 format for date-time
responses: Standup[]; // Array of response objects
// hasBlocker: boolean; // Indicates if there are blockers
}
  

// export const filterStandups = async (filters: {
//   date?: string;
//   teamId?: string;
//   memberId?: string;
// }): Promise<StandupResponse[]> => {

//   let query = db.collection("standups") as FirebaseFirestore.Query;

//   // Apply filters dynamically
//   if (filters.date) {
//     const startOfDay = new Date(filters.date).setHours(0, 0, 0, 0);
//     const endOfDay = new Date(filters.date).setHours(23, 59, 59, 999);
//     query = query.where("timestamp", ">=", new Date(startOfDay));
//     query = query.where("timestamp", "<=", new Date(endOfDay));
//   }

//   if (filters.teamId) {
//     query = query.where("teamId", "==", filters.teamId);
//   }

//   if (filters.memberId) {
//     console.log("Inside filter.memberId: ",filters.memberId)
//     query = query.where("userId", "==", filters.memberId);
//   }

//   // Fetch filtered documents
//   const snapshot = await query.get();
//   const results: StandupResponse[] = [];
//   snapshot.forEach((doc) => {
//     results.push(doc.data() as StandupResponse);
//   });

//   console.log("Results from filtering", results);

//   return results;
// };

const standupDoc = db.collection('standups').doc('standupId');
const responseSubcollection = standupDoc.collection('responses');

export const filterStandups = async (filters: {
    date?: string;
    teamId?: string;
    memberId?: string;
  }): Promise<StandupResponse[]> => {
    const results: StandupResponse[] = [];
    
    
    try {
        // Filter by `date` or `memberId`
        if ( filters.memberId) {
          let query = db.collectionGroup('responses') as FirebaseFirestore.Query;
    
          if (filters.memberId) {
              query = query.where('userId', '==', filters.memberId);
          }
    
          const snapshot = await query.get();
    
          for (const doc of snapshot.docs) {
            const parentDoc = await doc.ref.parent.parent?.get();
            if (parentDoc?.exists) {
              const standupData = parentDoc.data();
              const responseData = doc.data();
    
              const standupResponse: StandupResponse = {
                teamId: standupData?.teamId,
                userId: responseData.userId,
                messageTs: standupData?.messageTs,
                responses: responseData.response.map((resp: any) => ({
                  question: resp.questionId,
                  answer: resp.answer,
                })),
            };
    
            results.push(standupResponse);
        }
    }
        }
    
        // Filter by `teamId`
        else if (filters.date || filters.teamId) {
            let query;

            if(filters.teamId){
              query = db.collection('standups').where('teamId', '==', filters.teamId);
            }
            // Apply filters dynamically
            if (filters.date) {
               query = db.collection('standups').where('date', '==', filters.date) ;
            }
            
            const snapshot = await query?.get();
            snapshot?.forEach((doc) => {
                const data = doc.data();
                
            if (data.responses && Array.isArray(data.responses)) {
              data.responses.forEach((responseObj: any) => {
                const standupResponse: StandupResponse = {
                  teamId: data.teamId,
                  userId: responseObj.userId,
                  messageTs: data.messageTs,
                  responses: responseObj.response.map((resp: any) => ({
                    question: resp.questionId,
                    answer: resp.answer,
                  })),
                };
                results.push(standupResponse);
              });
            }
          });
        }
    
        console.log('Filtered Standup Responses:', results);
        return results;
      } catch (error) {
        console.error('Error filtering standups:', error);
        return results; // Return empty results in case of errors
      }
  };