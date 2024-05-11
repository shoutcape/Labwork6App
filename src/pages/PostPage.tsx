import {
    IonButton,
    IonButtons,
    IonCard,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonPage,
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
    thumbsUpOutline,
} from 'ionicons/icons'
import { handleLikes } from '../helpers/likesAndComments'
import { Comment } from './ForumPage'
import CreateCommentModal from '../components/CreateCommentModal'

const PostPage: React.FC = () => {
    const { postId } = useParams<{ postId: string }>()
    const [postData, setPostData] = useState<PostData | null>(null)
    const [liked, setLiked] = useState(false)
    const [commenting, setCommenting] = useState(false) // State to track commenting mode
    const [replyTarget, setReplyTarget] = useState('')
    const [comments, setComments] = useState<Comment[] | null>(null)
    const [parentId, setParentId] = useState('')
    const [commentsCount, setCommentsCount] = useState<number>(0); // State to track comments count

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

    const fetchComments = () => {
        db.collection('comments')
            .where('postId', '==', postId)
            .orderBy('createdAt')
            .onSnapshot((snapshot) => {
                const fetchedComments: Comment[] = []
                snapshot.forEach((doc) => {
                    const commentData = doc.data()
                    const date = commentData.createdAt
                    const formattedDate = date.slice(0, -3)
                    fetchedComments.push({
                        id: doc.id,
                        username: commentData.username,
                        content: commentData.content,
                        createdAt: formattedDate,
                        likes: commentData.likes,
                        comments: commentData.comments,
                        replyTo: commentData.replyTo,
                        parentId: commentData.parentId,
                        commentsCount: commentData.commentsCount || 0, // Set default value if commentsCount doesn't exist
                    })
                })
                setComments(fetchedComments)
                setCommentsCount(fetchedComments.length) // Set comments count
            })
    }

    useEffect(() => {
        if (!commenting) {
            fetchComments()
        }
    }, [commenting])

    const toggleLikeStatus = async (
        collection: string,
        targetId: string,
        likesArray: string[]
    ) => {
        handleLikes(collection, targetId, likesArray)
        setLiked(!liked)
    }

    const createComment = (replyTarget: string, parentId: string) => {
        setCommenting(true)
        setReplyTarget(replyTarget)
        setParentId(parentId)
        console.log('comment created lol')
    }

    const renderComments = (comments: Comment[], parentId: string | null = null) => {
        return comments
            .filter((comment: Comment) => comment.parentId === parentId)
            .map((comment: Comment) => (
                <IonCard
                    key={comment.id}
                    className="userPost userComment"
                >
                    <div className="details">
                        <p className="username">
                            User: {comment.username}
                        </p>
                        <p className="username">
                            Replied to user: {comment.replyTo}
                        </p>
                        <div className="date">
                            <p>{comment.createdAt}</p>
                        </div>
                    </div>
                    <div className="content">
                        <p className="textcontent">
                            {comment.content}
                        </p>
                    </div>
                    <div className="likesAndComments">
                        <IonButton
                            size="small"
                            fill="clear"
                            className="likes reactionCircle"
                            onClick={() => {
                                toggleLikeStatus(
                                    'comments',
                                    comment.id,
                                    comment.likes
                                )
                            }}
                        >
                            <div>
                                <IonIcon
                                    className="icon"
                                    icon={thumbsUpOutline}
                                ></IonIcon>
                                <span>{comment.likes.length}</span>
                            </div>
                        </IonButton>
    
                        <IonButton
                            size="small"
                            fill="clear"
                            className="comments reactionCircle"
                            onClick={() => {
                                createComment(
                                    comment.username,
                                    comment.id
                                )
                            }}
                        >
                            <div>
                                <IonIcon
                                    className="icon"
                                    icon={chatboxEllipsesOutline}
                                ></IonIcon>
                                <span>
                                    {comment.commentsCount}
                                </span>
                            </div>
                        </IonButton>
                    </div>
                    <div className='nestedComments'>
                        {renderComments(comments, comment.id)}
                    </div>
                </IonCard>
            ))
    }

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
                <IonCard className="userPost">
                    <div className="details">
                        <p className="username">User: {postData.username}</p>
                        <div className="date">
                            <p>{postData.createdAt.slice(0, -3)}</p>
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
                            onClick={() => {
                                toggleLikeStatus(
                                    'posts',
                                    postData.id,
                                    postData.likes
                                )
                            }}
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
                            onClick={() => {
                                createComment(postData.username, postData.id)
                            }}
                        >
                            <div>
                                <IonIcon
                                    className="icon"
                                    icon={chatboxEllipsesOutline}
                                ></IonIcon>
                                <span>{commentsCount}</span>
                            </div>
                        </IonButton>
                    </div>
                </IonCard>

                <div className="commentsContainer">
                    {comments && renderComments(comments, postId)}
                </div>

                <IonModal
                    onDidDismiss={() => setCommenting(false)}
                    isOpen={commenting}
                >
                    <CreateCommentModal
                        setCommenting={setCommenting}
                        postId={postId}
                        replyTarget={replyTarget}
                        parentId={parentId}
                        commentsCount={commentsCount}
                    />
                </IonModal>
            </IonContent>
        </IonPage>
    )
}

export default PostPage
