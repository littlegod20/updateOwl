import admin from "firebase-admin";
import firebaseConfig from "../config/firestore.config";


admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig as admin.ServiceAccount),
});

const db = admin.firestore();

export default db;
