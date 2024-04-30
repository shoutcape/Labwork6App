// firebaseConfig.tsx

import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

const config = {
    apiKey: import.meta.env.VITE_REACT_APP_API_KEY,
    authDomain: import.meta.env.VITE_REACT_APP_AUTH_DOMAIN,
    databaseURL: import.meta.env.VITE_REACT_APP_DATABASE_URL,
    projectId: import.meta.env.VITE_REACT_APP_PROJECT_ID,
    storageBucket: import.meta.env.VITE_REACT_APP_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_REACT_APP_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_REACT_APP_APP_ID
};

firebase.initializeApp(config)

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)

export default firebase;