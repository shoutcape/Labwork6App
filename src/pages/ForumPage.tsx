import {
    IonChip,
    IonPage,
    IonContent,
    IonToolbar,
    IonButton,
    IonButtons,
    IonHeader,
    IonCard,
    IonItem,
    IonIcon,
} from '@ionic/react'
import './ForumPage.css'
import { Redirect, useHistory, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth'
import { firebase, db } from '../firebaseConfig'
import { useEffect, useRef, useState } from 'react'
import { chatboxEllipsesOutline, thumbsUpOutline } from 'ionicons/icons'
import CreatePostModal from '../components/CreatePostModal'
import UsernameModal from '../components/UsernameModal'

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
            setShowUsernameModal(false); 
            setShowCreatePostModal(false)
        });
        // Cleanup function to prevent memory leaks
        return () => {unlisten(), isMounted.current = false};
     }
    }, [location]); 

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
                console.log('ei käyttäjää');
                setShowUsernameModal(true)
            } else {
                setShowCreatePostModal(true)
            }
        })

    }


    return (
        <IonPage>
            <IonContent className="ion-padding">
                <div className="ion-text-center mb-4">Forum</div>
                <div className="ion-text-center">
                    <IonButton
                        className="postButton"
                        onClick={submitPost}
                        expand="block"
                    >
                        Post
                    </IonButton>
                </div>
                <IonCard className="userPost">
                    <div className="details">
                        <p className="username">User: Dummy</p>
                        <div className="rightside">
                            <div className="likesandcomments">
                                <div className="likes">
                                    <IonIcon icon={thumbsUpOutline}></IonIcon>
                                    <span>100</span>
                                </div>
                                <div className="comments">
                                    <IonIcon
                                        icon={chatboxEllipsesOutline}
                                    ></IonIcon>
                                    <span>500</span>
                                </div>
                            </div>
                            <div className="date">
                                <p>12/01/2020</p>
                            </div>
                        </div>
                    </div>
                    <div className="content">
                        <h4 className="title">Title of the post</h4>
                        <p className="textcontent">
                            Contents of the post go here and may end up being
                            quite long, but thats okay. If neccessary we can
                            limit the amount of characters that go here.
                        </p>
                    </div>
                </IonCard>
                {/* component for post creation */}
               <CreatePostModal showCreatePostModal={showCreatePostModal} setShowCreatePostModal={setShowCreatePostModal} /> 
                <UsernameModal showUsernameModal={showUsernameModal} setShowUsernameModal={setShowUsernameModal}/>
            </IonContent>
        </IonPage>
    )
}

export default ForumPage
