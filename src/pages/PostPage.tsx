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
import { db, firebase } from '../firebaseConfig'
import { useParams } from 'react-router'
import { PostData } from './ForumPage'
import {
    arrowBack,
    chatboxEllipsesOutline,
    sendOutline,
    thumbsUpOutline,
} from 'ionicons/icons'
import { handleLikes, handleComments } from '../helpers/likesAndComments'

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>()
    const [postData, setPostData] = useState<PostData | null>(null)
    const [liked, setLiked] = useState(false)
    const [commentContent, setCommentContent] = useState('')
    const [commenting, setCommenting] = useState(false) // State to track commenting mode
    const [latestComment, setLatestComment] = useState<any>(null)

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


    const toggleLikeStatus = async () => {
        // check postData exists to prevent errors
        if (postData) {
            handleLikes(postData)
            setLiked(!liked)
        }
    }


    //Need to add index to firestore to work properly
    const toggleCommentStatus = async () => {
        if (commentContent.trim() !== '') {
            if (postData) {
                const userId = firebase.auth().currentUser?.uid || '';
                const newComment = {
                    content: commentContent,
                    createdAt: new Date().toISOString(),
                    userId,
                };
                const addedComment = await handleComments(postId, newComment); 
                setLatestComment(addedComment);
                setCommentContent('');
            }
        }
    };
    
    

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
                        <IonButton routerLink="/forumpage">
                            <IonIcon icon={arrowBack}></IonIcon>
                        </IonButton>
                    </IonButtons>
                    <IonTitle>{postData.title}</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonCard className="userPost"  style={{ margin: '9px' }}>
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
                        <IonButton
                            size="small"
                            fill="clear"
                            className="likes reactionCircle"
                            onClick={toggleLikeStatus}
                        >
                            <div>
                                <IonIcon
                                    className="icon"
                                    icon={thumbsUpOutline}
                                ></IonIcon>
                                <span>{postData.likes.length}</span>
                            </div>
                        </IonButton>

                        <IonButton
                            size="small"
                            fill="clear"
                            className="comments reactionCircle"
                            onClick={() => setCommenting(true)}
                        >
                            <div>
                                <IonIcon
                                    className="icon"
                                    icon={chatboxEllipsesOutline}
                                ></IonIcon>
                                <span>{postData.comments.length}</span>
                            </div>
                        </IonButton>
                    </div>
                </IonCard>
                {commenting && (
                    <>
                            {Array.isArray(postData.comments) &&
                                postData.comments.map((comment, index) => (
                                    <IonCard key={index}>
                                    <IonItem>
                                        <IonLabel>{comment.content}</IonLabel>
                                        {comment.createdAt &&
                                            new Date(
                                                comment.createdAt
                                            ) instanceof Date && (
                                                <p
                                                    style={{
                                                        fontSize: '0.8rem',
                                                        color: '#777',
                                                    }}
                                                >
                                                    {new Date(
                                                        comment.createdAt
                                                    ).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </p>
                                            
                                            )}
                                    </IonItem>
                                    </IonCard>
                                ))}
                        <IonCard className='ion-padding'>
                        <IonItem>
                            <IonTextarea
                                placeholder="Write a comment..."
                                value={commentContent}
                                onIonChange={(e) =>
                                    setCommentContent(e.detail.value!)
                                }
                            ></IonTextarea>
                            <IonButton slot="end" onClick={toggleCommentStatus} style={{marginBottom: '15px'}}>
                                <IonIcon icon={sendOutline}></IonIcon>
                            </IonButton>
                        </IonItem>
                    </IonCard>
                    </>
                )}
        </IonContent>
    </IonPage>
    )
}

export default PostPage
