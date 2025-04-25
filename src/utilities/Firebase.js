import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc, addDoc} from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // to make file names unique

const firebaseConfig = {
    apiKey: "AIzaSyDcHuv1kED49BkhHyi0xE9HKh5wu3_ynq4",
    authDomain: "kis-makerspace.firebaseapp.com",
    projectId: "kis-makerspace",
    storageBucket: "kis-makerspace.firebasestorage.app",
    messagingSenderId: "21835125775",
    appId: "1:21835125775:web:1344c0a45725a9a26fbf7a",
    measurementId: "G-S2RSTQK2MG"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export async function createRequest({ email_address, type, file_url, status, notes }) {
    const requestsCol = collection(db, "requests");
  
    try {
        await addDoc(requestsCol, {
        email_address,
        type,
        file_url,
        status,
        notes,
        date_submitted: serverTimestamp(), // Firestore will use server time
        });
        console.log("Request created successfully");
    } catch (error) {
        console.error("Error creating request:", error);
    }
}

export async function getCurrentRequests() {
    const requestsCol = collection(db, 'requests');
    const requestsSnapshot = await getDocs(requestsCol);
}

export async function getAllRequests() {
    const requestsCol = collection(db, 'requests');
    const requestsSnapshot = await getDocs(requestsCol);
    const requestList = requestsSnapshot.docs.map(doc => doc.data());
    return requestList;
}

export async function finishRequest() {

}

export async function deleteRequest(docId) {
    const requestRef = collection(db, "requests", docId);
    try {
      await deleteDoc(requestRef);
      console.log(`Request ${docId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
}

export async function updateRequestField(docId, field, value) {
    const requestRef = doc(db, "requests", docId);
    const updateData = { [field]: value };
  
    try {
      await updateDoc(requestRef, updateData);
      console.log(`Field '${field}' updated successfully in request ${docId}`);
    } catch (error) {
      console.error("Error updating field:", error);
    }
}

export async function uploadFile(file) {
    if (file) {
        const fileRef = ref(storage, `uploads/${uuidv4()}-${file.name}`);
        const snapshot = await uploadBytes(fileRef, file);
        // Get the file's download URL
        const url = await getDownloadURL(snapshot.ref);
        return url;
    }
}