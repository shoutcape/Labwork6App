import {
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonIcon,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { useParams } from 'react-router'
import { PostData } from './ForumPage'
import { arrowBack, chatboxEllipsesOutline, thumbsUpOutline } from 'ionicons/icons'

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
                    <IonButtons>
                        <IonButton routerLink='/forumpage'>
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{postData.title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard className="userPost">
                    <div className="details">
                        <p className="username">User: {postData.username}</p>
                        <div className="date">
                            <p>{postData.createdAt}</p>
                        </div>
                    </div>
                    <div className="content">
                        <h4 className="postTitle">{postData.title}</h4>
                        <p className="textcontent">{postData.content}</p>
                    </div>
                    <div className="likesAndComments">
                        <IonButton size='small' fill='clear' className="likes reactionCircle">
                            <div>
                            <IonIcon
                                className="icon"
                                icon={thumbsUpOutline}
                            ></IonIcon>
                            <span>{postData.likes}</span>
                            </div>
                        </IonButton>

                        <IonButton size='small' fill='clear' className="comments reactionCircle">
                            <div>
                            <IonIcon
                                className="icon"
                                icon={chatboxEllipsesOutline}
                            ></IonIcon>
                            <span>{postData.comments}</span>
                            </div>
                        </IonButton>
                    </div>
                    
                </IonCard>
            </IonContent>
        </IonPage>
    )
}

export default PostPage
