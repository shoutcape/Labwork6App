import { db } from '../firebaseConfig'

export const usernameCheck = async (username: string): Promise<boolean> => {
    const usernameRef = db.collection('usernames').doc(username)
    const doc = await usernameRef.get()
    return doc.exists
}
