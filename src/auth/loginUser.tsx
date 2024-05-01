// tänne tulee login logiikka
import { firebase } from '../firebaseConfig';

export async function loginUser(email: string, password: string) {
    try {
        await firebase
            .auth()
            .signInWithEmailAndPassword(email, password);
    } catch (error) {
        throw error;
    }
}
