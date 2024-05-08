import {
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonPage,
    IonTextarea,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { useParams } from 'react-router'
import { PostData } from './ForumPage'
import {
    arrowBack,
    chatboxEllipsesOutline,
    sendOutline,
    thumbsUpOutline,
} from 'ionicons/icons'

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>()
    const [postData, setPostData] = useState<PostData | null>(null)
    const [liked, setLiked] = useState(false)
    const [commentContent, setCommentContent] = useState("")
    const [commenting, setCommenting] = useState(false) // State to track commenting mode

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const postRef = db.collection('posts').doc(postId)
                postRef.onSnapshot((doc) => {
                    if (doc.exists) {
                        const postData = doc.data() as PostData
                        setPostData(postData)
                    } else {
                        console.log('Document not found')
                    }
                })
            } catch (error) {
                console.error('Error fetching document:', error)
            }
        }
        fetchPostData()
    }, [postId])

    const handleLike = async () => {
        if (!liked) {
            setLiked(true)
            await db.collection('posts').doc(postId).update({
                likes: postData!.likes + 1 // Increment likes by 1
            })
        }
    }

    const handleComment = async () => {
        if (commentContent.trim() !== "") {
            // Add a new comment to the existing comments array
            await db.collection('posts').doc(postId).update({
                comments: [...postData!.comments, { content: commentContent, createdAt: new Date().toISOString() }]
            })
            setCommentContent("")
        }
    }

    console.log(postData?.comments)

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
                    <IonButtons slot="start">
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
                        <IonButton size='small' fill='clear' className="likes reactionCircle" onClick={handleLike}>
                            <div>
                                <IonIcon
                                    className="icon"
                                    icon={thumbsUpOutline}
                                ></IonIcon>
                                <span>{postData.likes}</span>
                            </div>
                        </IonButton>

                        <IonButton size='small' fill='clear' className="comments reactionCircle" onClick={() => setCommenting(true)}>
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
                {commenting && (
                    <IonCard>
                        <IonList>
                            {Array.isArray(postData.comments) && postData.comments.map((comment, index) => (
                                <IonItem key={index}>
                                    <IonLabel>{comment.content}</IonLabel>
                                    {comment.createdAt && new Date(comment.createdAt) instanceof Date && (
                                        <p style={{ fontSize: '0.8rem', color: '#777' }}>
                                            {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    )}
                                </IonItem>
                            ))}
                        </IonList>
                        <IonItem>
                            <IonTextarea
                                placeholder="Write a comment..."
                                value={commentContent}
                                onIonChange={(e) => setCommentContent(e.detail.value!)}
                            ></IonTextarea>
                            <IonButton slot="end" onClick={handleComment}>
                                <IonIcon icon={sendOutline}></IonIcon>
                            </IonButton>
                        </IonItem>
                    </IonCard>
                )}
            </IonContent>
        </IonPage>
    )
}

export default PostPage
