import {
    IonButton,
    IonContent,
    IonGrid,
    IonHeader,
    IonInput,
    IonModal,
    IonPage,
    IonTitle,
    IonToolbar,
} from '@ionic/react'
import { firebase, db } from '../firebaseConfig'
import React, { useReducer, useRef, useState } from 'react'
import { usernameCheck } from '../auth/usernameCheck'

interface UsernameModalProps {
    showUsernameModal: boolean
    setShowUsernameModal: (show: boolean) => void
}

const UsernameModal: React.FC<UsernameModalProps> = ({
    showUsernameModal,
    setShowUsernameModal,
}) => {
    const modal = useRef<HTMLIonModalElement>(null)
    const [username, setUsername] = useState('')
    const user = firebase.auth().currentUser

    const submitUsername = async () => {
        if (!username && username.trim().length < 1) {
            console.log('Username cant be empty')
            return
        }

        // check if username is taken
        const usernameTaken = await usernameCheck(username)
        if (usernameTaken) {
            console.log('This username is taken')
            return
        }
        // update the firebaseauth displayname
        user?.updateProfile({
            displayName: username,
        })
        // save the username to the database
        db.collection('usernames').doc(username).set({
            userId: user?.uid,
        })
        // close the modal
        modal.current?.dismiss()
    }

    return (
        <IonModal
            onDidDismiss={() => setShowUsernameModal(false)}
            isOpen={showUsernameModal}
            ref={modal}
        >
            <IonContent>
                <IonTitle color='primary'>Looks like you don't have a username yet</IonTitle>
                <form>
                    <IonInput
                        value={username}
                        // on each change update the username
                        onIonChange={(e) => setUsername(e.detail.value!)}
                    ></IonInput>
                </form>
                <IonButton onClick={submitUsername}>Create Username</IonButton>
            </IonContent>
        </IonModal>
    )
}

export default UsernameModal
