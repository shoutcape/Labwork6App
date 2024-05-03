import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonModal,
    IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { firebase, db } from '../firebaseConfig'

interface CreatePostModalProps {
    showCreatePostModal: boolean
    setShowCreatePostModal: (show: boolean) => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
    showCreatePostModal,
    setShowCreatePostModal,
}) => {
    const createNewPost = async () => {
        const username = firebase.auth().currentUser?.displayName

        // check if user has username
        if (!username) {
            console.log('Create Username First')
            return
        }
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

        // select database collection, create new document, set new document contents
        db.collection('posts').doc().set(newPostData)
        console.log('new post added to db')
    }

    return (
        <IonModal
            onDidDismiss={() => setShowCreatePostModal(false)}
            className="clear-backdrop"
            isOpen={showCreatePostModal}
        >
            <IonHeader>
                <IonToolbar color="primary">
                    <IonButtons slot="end">
                        <IonButton
                            onClick={() => {
                                setShowCreatePostModal(false)
                            }}
                        >
                            Cancel
                        </IonButton>
                    </IonButtons>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <p>This is working yes?</p>
                <IonButton onClick={createNewPost}>Submit Post</IonButton>
            </IonContent>
        </IonModal>
    )
}

export default CreatePostModal
