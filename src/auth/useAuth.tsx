import { useEffect, useState } from 'react';
import { firebase } from '../firebaseConfig';

export const useAuth = () => {
    const [loggedIn, setLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                setLoggedIn(true);
            } else {
                setLoggedIn(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { loggedIn, loading };
};