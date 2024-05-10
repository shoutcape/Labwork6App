import {
    IonButton,
    IonButtons,
    IonContent,
    IonTextarea,
    IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { firebase, db } from '../firebaseConfig'

interface createCommentModalprops {
    setCommenting: (show: boolean) => void
    postId: string
    replyTarget: string
}

const CreateCommentModal: React.FC<createCommentModalprops> = ({
    setCommenting,
    postId,
    replyTarget
}) => {
    const [content, setContent] = useState('')

    const createNewComment = async () => {
        const username = firebase.auth().currentUser?.displayName
        // check if user has username
        if (!username) {
            console.log('Create Username First')
            return
        }
        const currentDate = new Date()
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
        const newCommentData = {
            username: username,
            content: content,
            likes: [],
            comments: [],
            createdAt: formattedDate,
            postId: postId,
            replyTo: replyTarget
        }
        // select database collection, create new document, set new document contents
        db.collection('comments').doc().set(newCommentData)
        console.log('new post added to db')
        setCommenting(false)
    }

    return (
        <IonContent>
            <IonToolbar color="primary">
                <IonButtons slot="end">
                    <IonButton
                        onClick={() => {
                            setCommenting(false)
                        }}
                    >
                        Cancel
                    </IonButton>
                </IonButtons>
            </IonToolbar>
            <IonContent className="ion-padding">
                <h1 className="ion-text-center title">Create A Comment</h1>
                <form>
                    <label htmlFor="content">Content</label>
                    <IonTextarea
                        name="content"
                        className="input"
                        autoGrow={true}
                        value={content}
                        onIonInput={(e) => setContent(e.detail.value!)}
                    />
                </form>
                <IonButton onClick={createNewComment}>Submit Post</IonButton>
            </IonContent>
        </IonContent>
    )
}

export default CreateCommentModal