import { db, firebase } from '../firebaseConfig'

export const handleLikes = async (collection: string, postId: string, likesArray: string[]) => {
    const userId = firebase.auth().currentUser?.uid!

    // if no user in the 
    if (!likesArray!.includes(userId)) {
        await db
            .collection(collection)
            .doc(postId)
            .update({
                // this only allows the addition of new data and prevents duplicates
                likes: firebase.firestore.FieldValue.arrayUnion(userId),
            })
    } else {

        await db
        .collection(collection)
        .doc(postId)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove(userId)
        })
    }
}