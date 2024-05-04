import {
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonInput,
    IonModal,
    IonText,
    IonTextarea,
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

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const createNewPost = async () => {

        const username = firebase.auth().currentUser?.displayName
        // check if user has username
        if (!username) {
            console.log('Create Username First')
            return
        }

        // get the timestamp when creating a new post
        const currentDate = new Date()
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`

        const newPostData = {
            username: username,
            title: title,
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
            <IonContent className='ion-padding'>
                <h1 className='ion-text-center title'>Create A Post</h1>
                <form>
                    <label htmlFor="title">Title</label>
                    <IonTextarea
                        name='title'
                        autoGrow={true}
                        className='input'
                        value={title}
                        onIonInput={(e) => setTitle(e.detail.value!)}
                    />
                    <label htmlFor="content">Content</label>
                    <IonTextarea
                        name='content'
                        className='input'
                        autoGrow={true}
                        value={content}
                        onIonInput={(e) => setContent(e.detail.value!)}
                    />
                </form>
                <IonButton onClick={createNewPost}>Submit Post</IonButton>
            </IonContent>
        </IonModal>
    )
}

export default CreatePostModal
