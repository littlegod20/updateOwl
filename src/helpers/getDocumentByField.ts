import db from "../services/database";

export const getDocumentByField = async (
  collectionName: string,
  field: string,
  value: string
) => {
  try {
    const querySnapshot = await db
      .collection(collectionName)
      .where(field, "==", value)
      .get();

    if (querySnapshot.empty) {
      console.log(`No document found with ${field} = ${value}`);
      return null;
    }

    const document = querySnapshot.docs[0];

    // console.log("Document data:", document.data());
    const doc: TeamDocumentTypes = {
      id: document.id,
      members: document.data().members,
      name: document.data().name,
      teamId: document.data().teamId,
      timeZone: document.data().timeZone,
      teamstandupQuestions: document.data().teamstandupQuestions,
    };

    return doc;
  } catch (error) {
    console.error("Error fetching document by field:", error);
    throw new Error("Failed to fetch document by field.");
  }
};




    // {
    //     id: document.data().teamstandupQuestions.id,
    //     questions: document.data().teamstandupQuestions.questions,
    //     reminderTimes: document.data().teamstandupQuestions.reminderTimes,
    //     standupTimes: document.data().teamstandupQuestions.standupTimes,
    //   }