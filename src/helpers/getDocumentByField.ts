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

    console.log("Document data:", document.data());
    const doc: { [key: string]: string | string[] } = {
      id: document.id,
      ...document.data(),
    };
    return doc;
  } catch (error) {
    console.error("Error fetching document by field:", error);
    throw new Error("Failed to fetch document by field.");
  }
};
