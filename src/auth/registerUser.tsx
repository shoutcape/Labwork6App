// tänne tulee register logiikka
import { firebase } from '../firebaseConfig';

export async function registerUser(email: string, password: string) {
    try {
        await firebase
            .auth()
            .createUserWithEmailAndPassword(email, password);
    } catch (error) {
        throw error;
    }
}
