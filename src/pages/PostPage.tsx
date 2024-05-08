import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { useParams } from 'react-router'
import { PostData } from './ForumPage'

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>()
    const [postData, setPostData] = useState<PostData | null>(null)

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const postRef = db.collection('posts').doc(postId)
                const doc = await postRef.get()
                if (doc.exists) {
                    const postData = doc.data() as PostData
                    setPostData(postData)
                } else {
                    console.log('Document not found')
                }
            } catch (error) {
                console.error('Error fetching document:', error)
            }
        }
        fetchPostData()
    }, [postId])

    if (!postData) {
        return (
            <IonPage>
                <IonHeader>
                    <IonToolbar>
                        <IonTitle>Post</IonTitle>
                    </IonToolbar>
                </IonHeader>
                <IonContent>
                    <p>Loading...</p>
                </IonContent>
            </IonPage>
        )
    }

    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>{postData.title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <p>User: {postData.username}</p>
                <p>Created: {postData.createdAt}</p>
                <p>Content: {postData.content}</p>
                <p>Likes: {postData.likes}</p>
                <p>Comments: {postData.comments}</p>
            </IonContent>
        </IonPage>
    )
}

export default PostPage
