import React from 'react'
import { IonButton, IonCard, IonIcon } from '@ionic/react'
import { thumbsUpOutline, chatboxEllipsesOutline } from 'ionicons/icons'


interface Comment {
    id: string
    username: string
    content: string
    createdAt: string
    likes: string[]
    comments: string[]
    replyTo: string
    parentId: string
}

interface RenderCommentsProps {
    comments: Comment[]
    parentId: string | null
    toggleLikeStatus: (collection: string, targetId: string, likesArray: string[]) => void
    createComment: (replyTarget: string, parentId: string) => void
}

const RenderComments: React.FC<RenderCommentsProps> = ({ comments, parentId, toggleLikeStatus, createComment }) => {
    return (
        <>
            {comments
                .filter((comment: Comment) => comment.parentId === parentId)
                .map((comment: Comment) => {
                    const nestedCommentsCount = comments.filter((c: Comment) => c.parentId === comment.id).length

                    return (
                        <IonCard key={comment.id} className="userPost userComment">
                            <div className="details">
                                <p className="username">User: {comment.username}</p>
                                <p className="username">Replied to user: {comment.replyTo}</p>
                                <div className="date">
                                    <p>{comment.createdAt}</p>
                                </div>
                            </div>
                            <div className="content">
                                <p className="textcontent">{comment.content}</p>
                            </div>
                            <div className="likesAndComments">
                                <IonButton
                                    size="small"
                                    fill="clear"
                                    className="likes reactionCircle"
                                    onClick={() => {
                                        toggleLikeStatus('comments', comment.id, comment.likes)
                                    }}
                                >
                                    <div>
                                        <IonIcon className="icon" icon={thumbsUpOutline}></IonIcon>
                                        <span>{comment.likes.length}</span>
                                    </div>
                                </IonButton>

                                <IonButton
                                    size="small"
                                    fill="clear"
                                    className="comments reactionCircle"
                                    onClick={() => {
                                        createComment(comment.username, comment.id)
                                    }}
                                >
                                    <div>
                                        <IonIcon className="icon" icon={chatboxEllipsesOutline}></IonIcon>
                                        <span>{nestedCommentsCount}</span>
                                    </div>
                                </IonButton>
                            </div>
                            <div className="nestedComments">{<RenderComments comments={comments} parentId={comment.id} toggleLikeStatus={toggleLikeStatus} createComment={createComment} />}</div>
                        </IonCard>
                    )
                })}
        </>
    )
}

export default RenderComments
