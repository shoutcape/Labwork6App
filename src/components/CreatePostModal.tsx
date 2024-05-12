import {
    IonButton,
    IonButtons,
    IonContent,
    IonTextarea,
    IonToolbar,
} from '@ionic/react'
import React, { useState } from 'react'
import { firebase, db } from '../firebaseConfig'

interface CreatePostModalProps {
    setShowCreatePostModal: (show: boolean) => void
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
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

        // const createDummyPosts = async () => {
        //     for (let i = 1; i < 4; i++) {
        //         // setTimeout to test the currentdate/order of the posts
        //         await new Promise((resolve) => setTimeout(resolve, 1000))
        //         const currentDate = new Date()
        //         const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
        //         const newPost = db.collection('posts').doc()
        //         const newPostData = {
        //             id: newPost.id,
        //             username: username + i,
        //             title: title + i,
        //             content: content + i,
        //             // create dummy arrays for likes and comments
        //             likes: Array.from(
        //                 { length: i },
        //                 (_, index) => `user${index + 1}`
        //             ),
        //             comments: [],
        //             createdAt: formattedDate,
        //         }
        //         newPost.set(newPostData)
        //         console.log('new post added to db')
        //     }
        //     setShowCreatePostModal(false)
        // }
        // createDummyPosts()

        const currentDate = new Date()
        const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`
        const newPost = db.collection('posts').doc()
        const newPostData = {
            id: newPost.id,
            username: username,
            title: title,
            content: content,
            likes: [],
            comments: [],
            createdAt: formattedDate,
        }
        newPost.set(newPostData)
        setShowCreatePostModal(false)
    }

    return (
        <IonContent>
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
            <IonContent className="ion-padding">
                <h1 className="ion-text-center title">Create A Post</h1>
                <form>
                    <label htmlFor="title">Title</label>
                    <IonTextarea
                        name="title"
                        autoGrow={true}
                        className="input"
                        value={title}
                        onIonInput={(e) => setTitle(e.detail.value!)}
                    />
                    <label htmlFor="content">Content</label>
                    <IonTextarea
                        name="content"
                        className="input"
                        autoGrow={true}
                        value={content}
                        onIonInput={(e) => setContent(e.detail.value!)}
                    />
                </form>
                <IonButton onClick={createNewPost}>Submit Post</IonButton>
            </IonContent>
        </IonContent>
    )
}

export default CreatePostModal
