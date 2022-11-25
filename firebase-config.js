require('dotenv').config();
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, getDocs, addDoc } = require("firebase/firestore");
const firebaseConfig = {
    apiKey: process.env.FB_API_KEY,
    authDomain: process.env.FB_AUTHDOMAIN,
    projectId: process.env.FB_PROJECT_ID,
    storageBucket: process.env.FB_STORAGE_BUCKET,
    messagingSenderId: process.env.FB_MESSAGING_SENDER_ID,
    appId: process.env.FB_APP_ID
};
const firebaseApp = initializeApp(firebaseConfig);
const database = getFirestore(firebaseApp);

class FireStoreDB {
    constructor(collectionName) {
        this.myCollection = collection(database, collectionName);
    }
    getCollection = async () => {
        const snapshot = await getDocs(this.myCollection);
        const list = snapshot.docs.map(doc => doc.data());
        return list;
    }
    addNewDocument = async (newDocument) => {
        try {
            let document = newDocument
            const docRef = await addDoc(this.myCollection, document);
            console.log(docRef.id);
        } catch (error) {
            console.log(error);
        }
    }
}
module.exports = { FireStoreDB };