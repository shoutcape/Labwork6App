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


export const handleComments = async (postId: string, newComment: any) => {
    const userId = firebase.auth().currentUser?.uid!;
    // Save the comment to the database
    await db.collection('comments').add({
        postId: postId, 
        ...newComment,
    });
    // Get the latest comment
    const commentsRef = await db.collection('comments').where('postId', '==', postId).orderBy('createdAt', 'desc').limit(1).get();
    let addedComment = null;
    if (!commentsRef.empty) {
        addedComment = commentsRef.docs[0].data();
    }

    return addedComment;
};