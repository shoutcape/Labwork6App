import {
    IonChip,
    IonPage,
    IonContent,
    IonToolbar,
    IonButton,
    IonModal,
    IonButtons,
    IonHeader,
    IonCard,
    IonItem,
    IonIcon,
} from '@ionic/react'
import './ForumPage.css'
import { Redirect } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { db } from '../firebaseConfig'
import { useState } from 'react'
import { chatboxEllipsesOutline, thumbsUpOutline } from 'ionicons/icons'

const ForumPage: React.FC = () => {
    // useAuth checks if user is logged in
    const { loggedIn, loading } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const modal = document.querySelector('ion-modal')
    // while loading returns blank page
    if (loading) {
        return <IonPage></IonPage>
    }
    // if not logged in return to login screen
    // if (!loggedIn) {
    // return <Redirect to="/login" />
    // }

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
            db.collection('posts')
                .doc(`postId${count + 1}`)
                .set(newPostData)
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
                        className="postButton"
                        onClick={() => {
                            setShowModal(true)
                        }}
                        expand="block"
                    >
                        Post
                    </IonButton>
                </div>
                <IonCard className="userPost">
                    <div className="details">
                        <p className="username">User: Dummy</p>
                        <div className="rightside">
                            <div className="likesandcomments">
                                <div className="likes">
                                    <IonIcon icon={thumbsUpOutline}></IonIcon>
                                    <span>100</span>
                                </div>
                                <div className="comments">
                                    <IonIcon
                                        icon={chatboxEllipsesOutline}
                                    ></IonIcon>
                                    <span>500</span>
                                </div>
                            </div>
                            <div className="date">
                                <p>12/01/2020</p>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <h4 className="title">Title of the post</h4>
                        <p className="textcontent">
                            Contents of the post go here and may end up being
                            quite long, but thats okay. If neccessary we can
                            limit the amount of characters that go here.
                        </p>
                    </div>
                </IonCard>
                <IonModal className="clear-backdrop" isOpen={showModal}>
                    <IonHeader>
                        <IonToolbar>
                            <IonButtons slot="end">
                                <IonButton
                                    onClick={() => {
                                        setShowModal(false)
                                    }}
                                >
                                    Cancel
                                </IonButton>
                            </IonButtons>
                        </IonToolbar>
                    </IonHeader>
                    <IonContent>
                        <p>This is working yes?</p>
                    </IonContent>
                </IonModal>
            </IonContent>
        </IonPage>
    )
}

export default ForumPage
