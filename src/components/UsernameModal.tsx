import {
    IonButton,
    IonContent,
    IonInput,
} from '@ionic/react'
import { firebase, db } from '../firebaseConfig'
import React, { useState } from 'react'
import { usernameCheck } from '../auth/usernameCheck'


// define props for typescript
interface UsernameModalProps {
    setShowUsernameModal: (show: boolean) => void
}

const UsernameModal: React.FC<UsernameModalProps> = ({
    setShowUsernameModal,
}) => {
    const [username, setUsername] = useState('')
    const user = firebase.auth().currentUser

    const submitUsername = async (event:React.FormEvent) => {
        event.preventDefault()
        if (!username || username.trim().length < 1) {
            console.log('username invalid:',username)
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
        // save the username to the database as a document and set the userId as the contents
        db.collection('usernames').doc(username).set({
            userId: user?.uid,
        })
        console.log('Username Created:', username)
        // close the modal and wipe the inputvalue
        setUsername('')
        setShowUsernameModal(false)
    }

    return (
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
    )
}

export default UsernameModal
