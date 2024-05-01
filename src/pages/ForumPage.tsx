import { IonPage, IonContent, IonButton } from '@ionic/react'
import './ForumPage.css'
import { Redirect } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { db } from '../firebaseConfig'


const ForumPage: React.FC = () => {
    // useAuth checks if user is logged in
    const { loggedIn, loading } = useAuth()
    // while loading returns blank page
    if (loading) {
        return <IonPage></IonPage>
    }
    // if not logged in return to login screen
    if (!loggedIn) {
        return <Redirect to="/login" />
    }

    const submitPost = () => {
        const createNewPost = async () => {
            const username = 'dummyUser'
            const content = 'dummyContent'
            // get the timestamp when creating a new post
            const currentDate = new Date()
            const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`

            const newPostData = {
                username: username,
                content: content,
                likes: 0,
                comments: 0,
                createdAt: formattedDate,
            }
            // take the length of the posts document as count
            const postsCollection = db.collection('posts')
            const snapshot = await postsCollection.get()
            const count = snapshot.docs.length
            // console.log(postsCollection)
            // console.log(snapshot)
            // console.log(count)

            // select database collection, create new document, set new document contents
            db.collection('posts').doc(`postId${count+1}`).set(newPostData)
            console.log('new post added to db')
        }
        createNewPost()
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <div className="ion-text-center mb-4">Forum</div>
                <div className="ion-text-center">
                    <IonButton
                        onClick={submitPost}
                        expand="block"
                        type="submit"
                        className="w-100"
                    >
                        Post
                    </IonButton>
                </div>
            </IonContent>
        </IonPage>
    )
}

export default ForumPage
