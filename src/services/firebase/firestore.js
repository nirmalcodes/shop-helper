import { firestore } from './firebase'
import {
    collection,
    addDoc,
    setDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
} from 'firebase/firestore'

export const getCollectionRef = (collectionName) => {
    return collection(firestore, collectionName)
}

export const addDocument = async (collectionName, data) => {
    try {
        const collectionRef = getCollectionRef(collectionName)
        const docRef = await addDoc(collectionRef, data)
        return docRef.id
    } catch (error) {
        console.error('Error adding document:', error)
    }
}

export const addDocumentWithCustomId = async (
    collectionName,
    customId,
    data
) => {
    try {
        const collectionRef = getCollectionRef(collectionName)
        const docRef = doc(collectionRef, customId)
        await setDoc(docRef, data)
    } catch (error) {
        console.error('Error adding document with custom ID:', error)
    }
}

export const getAllDocuments = async (collectionName) => {
    try {
        const collectionRef = getCollectionRef(collectionName)
        const querySnapshot = await getDocs(collectionRef)
        const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))
        return documents
    } catch (error) {
        console.error('Error fetching documents:', error)
    }
}

export const getDocumentById = async (collectionName, id) => {
    try {
        const collectionRef = getCollectionRef(collectionName)
        const docSnapshot = await getDocs(collectionRef.doc(id)).get()
        if (docSnapshot.exists()) {
            return docSnapshot.data()
        } else {
            return null // Or throw an error if document not found
        }
    } catch (error) {
        console.error('Error getting document:', error)
    }
}

export const updateDocument = async (collectionName, id, data) => {
    try {
        const collectionRef = getCollectionRef(collectionName)
        await updateDoc(collectionRef.doc(id), data)
    } catch (error) {
        console.error('Error updating document:', error)
    }
}

export const deleteDocument = async (collectionName, id) => {
    try {
        const collectionRef = getCollectionRef(collectionName)
        await deleteDoc(collectionRef.doc(id))
    } catch (error) {
        console.error('Error deleting document:', error)
    }
}
