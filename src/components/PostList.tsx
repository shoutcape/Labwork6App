import {
    IonCard,
    IonIcon,
} from '@ionic/react'
import { chatboxEllipsesOutline, thumbsUpOutline } from 'ionicons/icons'
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig'

interface PostData {
    id: any
    username: string
    title: string
    content: string
    date: string
    likes: number
    comments: number
}

const PostList: React.FC = () => {
    const [posts, setPosts] = useState<PostData[]>([])

    useEffect(() => {
        db.collection('posts')
            .orderBy('createdAt')
            .get()
            .then((snapshot) => {
                const fetchedPosts: PostData[] = []
                snapshot.forEach((doc) => {
                    const postData = doc.data()
                    fetchedPosts.push({
                        id: doc.id,
                        username: postData.username,
                        title: postData.title,
                        content: postData.content,
                        date: postData.createdAt,
                        likes: postData.likes,
                        comments: postData.comments,
                    })
                    setPosts(fetchedPosts)
                })
            })
    }, [])

    return (
        <div className="postsContainer">
            {posts && posts.map((post: PostData) => (
            <IonCard 
            key={post.id}
            className="userPost">
                <div className="details">
                    <p className="username">User: {post.username}</p>
                    <div className="date">
                        <p>{post.date}</p>
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
                        <span>{post.likes}</span>
                    </div>
                    <div className="comments reactionCircle">
                        <IonIcon
                            className="icon"
                            icon={chatboxEllipsesOutline}
                        ></IonIcon>
                        <span>{post.comments}</span>
                    </div>
                </div>
            </IonCard>
            ))}
        </div>
    )
}

export default PostList
