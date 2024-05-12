import { IonCard, IonIcon, IonRouterLink, useIonViewWillEnter } from '@ionic/react'
import { chatboxEllipsesOutline, thumbsUpOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { PostData } from '../pages/ForumPage'

interface Props {
    showCreatePostModal: boolean
}

const PostList: React.FC<Props> = ({ showCreatePostModal }) => {
    const [posts, setPosts] = useState<PostData[]>([])

    const fetchPosts = async () => {
        const fetchedPosts: PostData[] = []
        const postSnapshot = await db.collection('posts').orderBy('createdAt', 'desc').get()
        for (const doc of postSnapshot.docs) {
            const postData = doc.data()
            const date = postData.createdAt
            const formattedDate = date.slice(0, -3)
            const commentsSnapshot = await db.collection('comments').where('postId', '==', doc.id).get()
            fetchedPosts.push({
                id: doc.id,
                username: postData.username,
                title: postData.title,
                content: postData.content,
                createdAt: formattedDate,
                likes: postData.likes,
                comments: postData.comments,
                commentsCount: commentsSnapshot.size,
            })
        }
        setPosts(fetchedPosts)
    }

    useIonViewWillEnter(() => {
        if (!showCreatePostModal) {
            fetchPosts()
        }
    })

    useEffect(() => {
        if (!showCreatePostModal) {
            fetchPosts()
        }
    }, [showCreatePostModal])

    return (
        <div className="postsContainer">
            {posts &&
                posts.map((post: PostData) => (
                    <IonRouterLink
                        key={post.id}
                        routerLink={`/Postpage/${post.id}`}
                    >
                        <IonCard className="userPost">
                            <div className="details">
                                <p className="username">
                                    User: {post.username}
                                </p>
                                <div className="date">
                                    <p>{post.createdAt}</p>
                                </div>
                            </div>
                            <div className="content">
                                <h4 className="postTitle">{post.title}</h4>
                                <p className="textcontent">{post.content}</p>
                            </div>
                            <div className="likesAndComments">
                                <div className="likes reactionCircle">
                                    <IonIcon
                                        className="icon"
                                        icon={thumbsUpOutline}
                                    ></IonIcon>
                                    <span>{post.likes.length}</span>
                                </div>
                                <div className="comments reactionCircle">
                                    <IonIcon
                                        className="icon"
                                        icon={chatboxEllipsesOutline}
                                    ></IonIcon>
                                    <span>{post.commentsCount}</span>
                                </div>
                            </div>
                        </IonCard>
                    </IonRouterLink>
                ))}
        </div>
    )
}

export default PostList
