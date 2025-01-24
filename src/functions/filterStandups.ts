import db from "../services/database";

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

const getTimeStamps = (date: string) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const startTimestamp = startOfDay.getTime() / 1000;
    const endTimestamp = endOfDay.getTime() / 1000;
    return {startTimestamp, endTimestamp};
}
  


const standupDoc = db.collection('standups').doc('standupId');
const responseSubcollection = standupDoc.collection('responses');

export const filterStandups = async (filters: {
    date?: string;
    teamId?: string;
    memberId?: string;
  }): Promise<StandupResponse[]> => {
    const results: StandupResponse[] = [];
    let query =  db.collection('standups');
    
    
      try {
            if(filters.date && filters.teamId && filters.memberId){
                const {startTimestamp, endTimestamp} = getTimeStamps(filters.date);


                console.log("startTimestamp:", startTimestamp);
                console.log("endTimestamp:", endTimestamp);

                let queryAsFirestoreQuery = query as  FirebaseFirestore.Query;
                let queryResults = queryAsFirestoreQuery
                    .where("messageTs", ">=", `${startTimestamp}`)
                    .where("messageTs", "<=", `${endTimestamp}`)
                    // .where("teamId","==", filters.teamId);
                
                // console.log("Query Reults", queryResults);
                const snapshot = await queryResults.get();
            
                for (const doc of snapshot.docs) {
                    
                    const standupData = doc.data();
                    console.log("standupDatat team id", standupData.teamId);
                    console.log("filter's member id", filters.memberId);
                    if(standupData.teamId == filters.teamId){
                        
                        standupData.responses.map((response: any) => {
                            console.log("standupDatat member id", response.userId);
                            if(response.userId == filters.memberId){
                                console.log("Inside response.userId == filters.memberId for all filters: ", response);
                                const standupResponse = {
                                    teamId: standupData.teamId,
                                    messageTs: standupData.messageTs, // ISO 8601 format for date-time
                                    responses: [response], // Array of response objects
                                }
            
                                results.push(standupResponse);
                            }
                        })
                    }
                    
                }
            }
            else if(filters.date && filters.teamId){
                const {startTimestamp, endTimestamp} = getTimeStamps(filters.date);
                console.log("startTimestamp:", startTimestamp);
                console.log("endTimestamp:", endTimestamp);

                let queryAsFirestoreQuery = query as  FirebaseFirestore.Query;
                let queryResults = queryAsFirestoreQuery.where("messageTs", ">=", `${startTimestamp}`).where("messageTs", "<=", `${endTimestamp}`);
                queryResults = queryResults.where("teamId","==", filters.teamId);
                // console.log("Final Query Results", queryResults);

                const snapshot = await queryResults.get();

                for (const doc of snapshot.docs) {
                    const standupData = doc.data();
                    console.log("StadupData in queryResult in filter for both  filters.date && filters.teamId", standupData);
                    
                    const standupResponse = {
                        teamId: standupData.teamId,
                        messageTs: standupData.messageTs, // ISO 8601 format for date-time
                        responses: standupData.responses, // Array of response objects
                    }

                    results.push(standupResponse);
                }


            }
            else if(filters.date && filters.memberId){
                const {startTimestamp, endTimestamp} = getTimeStamps(filters.date);
                console.log("startTimestamp:", startTimestamp);
                console.log("endTimestamp:", endTimestamp);

                let queryAsFirestoreQuery = query as  FirebaseFirestore.Query;
                let queryResults = queryAsFirestoreQuery.where("messageTs", ">=", `${startTimestamp}`).where("messageTs", "<=", `${endTimestamp}`);

                const snapshot = await queryResults.get();
                
                for (const doc of snapshot.docs) {
                    const standupData = doc.data();
                    console.log("StadupData in queryResult in filter for both  filters.date && filters.memberId", standupData);

                    standupData.responses.map((response: any) => {
                        if(response.userId == filters.memberId){
                            console.log("Inside response.userId == filters.memberId: ", response);
                            const standupResponse = {
                                teamId: standupData.teamId,
                                messageTs: standupData.messageTs, // ISO 8601 format for date-time
                                responses: [response], // Array of response objects
                            }
        
                            results.push(standupResponse);
                        }
                    })
                }

            }
            else if(filters.memberId && filters.teamId){
                let queryAsFirestoreQuery = query as  FirebaseFirestore.Query;
                let queryResults = queryAsFirestoreQuery.where("teamId","==", filters.teamId);

                const snapshot = await queryResults.get();
                for (const doc of snapshot.docs) {
                    const standupData = doc.data();
                    console.log("StadupData in queryResult in filter for both filters.memberId && filters.teamId", standupData);

                    standupData.responses.map((response: any) => {
                        if(response.userId == filters.memberId){
                            console.log("Inside response.userId == filters.memberId: ", response);
                            const standupResponse = {
                                teamId: standupData.teamId,
                                messageTs: standupData.messageTs, // ISO 8601 format for date-time
                                responses: [response], // Array of response objects
                            }
        
                            results.push(standupResponse);
                        }
                    })
                }
            }
            //filter by only `teamId`
            else if (filters.teamId && !filters.date && !filters.memberId ){
                let queryAsFirestoreQuery = query as  FirebaseFirestore.Query;
                let queryResults = queryAsFirestoreQuery.where("teamId","==", filters.teamId);

                const snapshot = await queryResults.get();
                for (const doc of snapshot.docs) {
                    const standupData = doc.data();

                    const standupResponse = {
                        teamId: standupData.teamId,
                        messageTs: standupData.messageTs, // ISO 8601 format for date-time
                        responses: standupData.responses, // Array of response objects
                    }

                    results.push(standupResponse);
                }

            }
            // Filter by only `date` 
            else if (filters.date && !filters.memberId && !filters.teamId) {
                const {startTimestamp, endTimestamp} = getTimeStamps(filters.date);

                console.log("startTimestamp:", startTimestamp);
                console.log("endTimestamp:", endTimestamp);

                let queryAsFirestoreQuery = query as  FirebaseFirestore.Query;
                let queryResults = queryAsFirestoreQuery.where("messageTs", ">=", `${startTimestamp}`).where("messageTs", "<=", `${endTimestamp}`);

                const snapshot = await queryResults.get();
            
                for (const doc of snapshot.docs) {
                    const standupData = doc.data();

                    const standupResponse = {
                        teamId: standupData.teamId,
                        messageTs: standupData.messageTs, // ISO 8601 format for date-time
                        responses: standupData.responses, // Array of response objects
                    }

                    results.push(standupResponse);
                }
            }
            // Filter by only `memberId`
            else if ( filters.memberId && !filters.teamId && !filters.date) {
                console.log("filters.memberId", filters.memberId);
            
                const snapshot = await query.get();
            
                for (const doc of snapshot.docs) {
                    const standupData = doc.data();

                    standupData.responses.map((response: any) => {
                        if(response.userId == filters.memberId){
                            console.log("Inside response.userId == filters.memberId: ", response);
                            const standupResponse = {
                                teamId: standupData.teamId,
                                messageTs: standupData.messageTs, // ISO 8601 format for date-time
                                responses: [response], // Array of response objects
                            }
        
                            results.push(standupResponse);
                        }
                    })
                }
            }
        results?.map((result) => {
            console.log("Standup/Response For Team: ", result.teamId);
            result.responses.map((response) => {
                console.log("Result Response", response)
            }
        )})
        console.log("Results after Filtering: ", results);
        return results;
      } catch (error) {
        console.error('Error filtering standups:', error);
        return results; // Return empty results in case of errors
      }
  };