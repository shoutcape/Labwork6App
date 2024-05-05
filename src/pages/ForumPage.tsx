import {
    IonPage,
    IonContent,
    IonButton,
} from '@ionic/react'
import './ForumPage.css'
import { Redirect, useHistory, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { firebase, db } from '../firebaseConfig'
import { useEffect, useRef, useState } from 'react'
import CreatePostModal from '../components/CreatePostModal'
import UsernameModal from '../components/UsernameModal'
import PostList from '../components/PostList'

const ForumPage: React.FC = () => {
    // useAuth checks if user is logged in
    const { loggedIn, loading } = useAuth()
    const [showCreatePostModal, setShowCreatePostModal] = useState(false)
    const [showUsernameModal, setShowUsernameModal] = useState(false)
    const history = useHistory()
    const location = useLocation()
    const isMounted = useRef(true)

    useEffect(() => {
        if (location.pathname === '/forumpage') {
            const unlisten = history.listen(() => {
                // Close the modals on page change
                setShowUsernameModal(false)
                setShowCreatePostModal(false)
            })
            // Cleanup function to prevent memory leaks
            return () => {
                unlisten(), (isMounted.current = false)
            }
        }
    }, [location])

    useEffect(() => {
        if (showCreatePostModal || showUsernameModal) {
            return
        }

        db.collection('posts').orderBy('createdAt').get().then((snapshot) => {
            snapshot.forEach((doc) => {
                const postData = doc.data()
                const post = {
                username : postData.username,
                title : postData.title,
                content : postData.content,
                date : postData.createdAt,
                likes : postData.likes,
                comments : postData.comments
                 }
                 console.log(post)
            })
        })
    }, [showCreatePostModal])

    // while loading returns blank page
    if (loading) {
        return <IonPage></IonPage>
    }
    // if not logged in return to login screen
    if (!loggedIn) {
        return <Redirect to="/login" />
    }

    const submitPost = () => {
        // check if user has a username
        firebase.auth().onAuthStateChanged(function (user) {
            if (user?.displayName == null) {
                console.log('ei käyttäjää')
                setShowUsernameModal(true)
            } else {
                setShowCreatePostModal(true)
            }
        })
    }

    return (
        <IonPage>
            <IonContent className="ion-padding">
                <h1 className="ion-text-center mb-4 title" color="primary">
                    Forum
                </h1>
                <div className="ion-text-center">
                    <IonButton
                        className="postButton"
                        onClick={submitPost}
                        expand="block"
                    >
                        Post
                    </IonButton>
                </div>
               <PostList/> 
                {/* component for post creation */}
                <CreatePostModal
                    showCreatePostModal={showCreatePostModal}
                    setShowCreatePostModal={setShowCreatePostModal}
                />
                <UsernameModal
                    showUsernameModal={showUsernameModal}
                    setShowUsernameModal={setShowUsernameModal}
                />
            </IonContent>
        </IonPage>
    )
}

export default ForumPage
