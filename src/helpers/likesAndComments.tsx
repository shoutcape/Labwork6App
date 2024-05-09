import { db, firebase } from '../firebaseConfig'
import { PostData } from '../pages/ForumPage'

export const handleLikes = async (postData: PostData) => {
    const currentPostId = postData.id
    const userId = firebase.auth().currentUser?.uid!

    // if no user in the 
    if (!postData!.likes.includes(userId)) {
        await db
            .collection('posts')
            .doc(currentPostId)
            .update({
                // this only allows the addition of new data and prevents duplicates
                likes: firebase.firestore.FieldValue.arrayUnion(userId),
            })
    } else {

        await db
        .collection('posts')
        .doc(currentPostId)
        .update({
            likes: firebase.firestore.FieldValue.arrayRemove(userId)
        })
    }
}


export const handleComments = async () => {
    // TODO: MARK: create a function to handle addition of new comments to database
}
