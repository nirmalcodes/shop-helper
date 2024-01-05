import { firestore } from './firebase'
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    addDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    onSnapshot,
} from 'firebase/firestore'

// Access a Firestore instance from your initialized Firebase app
const firestore = getFirestore(firebaseApp)

// Function to get all documents from a collection
export const getDocs = async (collectionName) => {
    try {
        const snapshot = await getDocs(collection(firestore, collectionName))
        const docs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        return docs
    } catch (error) {
        console.error('Error getting documents:', error)
    }
}

// Function to add a document to a collection
export const addDoc = async (collectionName, data) => {
    try {
        const docRef = await addDoc(collection(firestore, collectionName), data)
        console.log('Document added:', docRef.id)
        return docRef.id // Return the new document ID
    } catch (error) {
        console.error('Error adding document:', error)
    }
}

// Function to get a single document by ID
export const getDoc = async (collectionName, docId) => {
    try {
        const doc = await getDoc(doc(firestore, collectionName, docId))
        if (doc.exists) {
            return doc.data()
        } else {
            console.log('Document does not exist')
        }
    } catch (error) {
        console.error('Error getting document:', error)
    }
}

// Function to update a document
export const updateDoc = async (collectionName, docId, data) => {
    try {
        await updateDoc(doc(firestore, collectionName, docId), data)
        console.log('Document updated')
    } catch (error) {
        console.error('Error updating document:', error)
    }
}

// Function to delete a document
export const deleteDoc = async (collectionName, docId) => {
    try {
        await deleteDoc(doc(firestore, collectionName, docId))
        console.log('Document deleted')
    } catch (error) {
        console.error('Error deleting document:', error)
    }
}

// Function to query documents based on conditions
export const queryDocs = async (collectionName, queryConditions) => {
    try {
        const querySnapshot = await getDocs(
            query(collection(firestore, collectionName), queryConditions)
        )
        const docs = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        return docs
    } catch (error) {
        console.error('Error querying documents:', error)
    }
}

// Function to listen for realtime updates
export const onSnapshot = (collectionName, callback) => {
    const unsubscribe = onSnapshot(
        collection(firestore, collectionName),
        callback
    )
    // Call unsubscribe() to stop listening for updates
}
