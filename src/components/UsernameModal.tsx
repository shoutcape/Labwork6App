import {
    IonButton,
    IonContent,
    IonInput,
    IonModal,
} from '@ionic/react'
import { firebase, db } from '../firebaseConfig'
import React, { useRef, useState } from 'react'
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

    const submitUsername = async (event:React.FormEvent) => {
        event.preventDefault()
        if (!username || username.trim().length < 1) {
            console.log('failed here is the username:',username)
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
        console.log('Username Created:', username)
        // close the modal and wipe the inputvalue
        setUsername('')
        modal.current?.dismiss()
    }

    return (
        <IonModal
            onDidDismiss={() => setShowUsernameModal(false)}
            isOpen={showUsernameModal}
            ref={modal}
        >
            <IonContent className='ion-padding'>

                <form className='usernameForm'
                    onSubmit={submitUsername}
                >
                <h1 className='ion-text-center title'>Create username</h1>
                    <IonInput
                        value={username}
                        // on each change update the username
                        onIonInput={(e) => setUsername(e.detail.value!)}
                    />
                    <IonButton className='usernameSubmit' onClick={submitUsername}>Confirm</IonButton>
                </form>

            </IonContent>
        </IonModal>
    )
}

export default UsernameModal
