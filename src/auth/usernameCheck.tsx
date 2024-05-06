import { db } from '../firebaseConfig'

// function for checking if the username already exists in the database to prevent duplicates
export const usernameCheck = async (username: string): Promise<boolean> => {
    const usernameRef = db.collection('usernames').doc(username)
    const doc = await usernameRef.get()
    return doc.exists
}
