import { firebase, db } from '../firebaseConfig'

export const likeCheck = async (currentPostId: string) => {
    const user = firebase.auth().currentUser?.displayName
    if (user) {
        const userHasLiked = db.collection('usernames').doc(user).collection('likedPosts').doc(currentPostId)
        const like = await userHasLiked.get()
        return like.exists
    }
}