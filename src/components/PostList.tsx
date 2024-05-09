import { IonCard, IonIcon, IonRouterLink, useIonViewWillEnter } from '@ionic/react'
import { chatboxEllipsesOutline, thumbsUpOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'
import { PostData } from '../pages/ForumPage'

// define the value for properties
interface props {
    showCreatePostModal: boolean
}

const PostList: React.FC<props> = ({ showCreatePostModal }) => {
    const [posts, setPosts] = useState<PostData[]>([])

    const fetchPosts = () => {
        // check if for modal so the new posts are only fetched when closing the post creation modal
            db.collection('posts')
                .orderBy('createdAt', 'desc')
                .get()
                .then((snapshot) => {
                    const fetchedPosts: PostData[] = []
                    snapshot.forEach((doc) => {
                        const postData = doc.data()
                        const date = postData.createdAt
                        // remove seconds from timestamp to only show HH:MM
                        const formattedDate = date.slice(0, -3)
                        fetchedPosts.push({
                            id: doc.id,
                            username: postData.username,
                            title: postData.title,
                            content: postData.content,
                            createdAt: formattedDate,
                            likes: postData.likes,
                            comments: postData.comments,
                        })
                    })
                    setPosts(fetchedPosts)
                })
            console.log('newPosts Fetched...')
        }
        // each time the createPostModal state changes fetch the posts from the database

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
                                    <span>{post.comments.length}</span>
                                </div>
                            </div>
                        </IonCard>
                    </IonRouterLink>
                ))}
        </div>
    )
}

export default PostList
