import React, { useState } from 'react';
import {
    IonPage,
    IonContent,
    IonCard,
    IonCardContent,
    IonInput,
    IonButton,
    IonAlert,
    IonToast,
    IonLoading,
    IonIcon,
} from '@ionic/react';
import { Link, useHistory } from 'react-router-dom';
import { registerUser } from '../auth/registerUser';
import './SignupAndLogin.css';
import {arrowBack} from 'ionicons/icons'

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState<boolean>(false);
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState('');
    const history = useHistory()

    const handleSignup = async () => {
        try {
            setLoading(true);
            if (password !== passwordConfirm) {
                setErrorMessage('Passwords do not match');
                return;
            }
            await registerUser(email, password);

            setErrorMessage('');
            setPasswordConfirm('');
            setPassword('');
            setEmail('');

            history.push('/login')

            setToastMessage('User Created, now login');
        } catch (error: any) {
            setErrorMessage(`Failed to create an account: ${error.message}`);
        }
        setLoading(false);
        setShowToast(true);
    };

    return (
        <IonPage>
            <IonContent className="ion-padding">
            <div className='back-button' onClick={() => history.push('/login')}>
                <IonIcon icon={arrowBack} size='large' color='medium'  />
            </div>
                <div className="ion-text-center mb-4">Welcome!</div>
                <div className="ion-text-center mb-5">Sign up to get started.</div>
                <IonLoading
                    message={'Creating user please wait...'}
                    duration={0}
                    isOpen={loading}
                ></IonLoading>
                <IonCard>
                    <IonCardContent>
                        <IonAlert
                            isOpen={!!errorMessage}
                            onDidDismiss={() => setErrorMessage('')}
                            message={errorMessage}
                            buttons={['OK']}
                        />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleSignup();
                            }}
                        >
                            <label>Email</label>
                            <IonInput
                                id='input'
                                type="email"
                                value={email}
                                onIonChange={(e) => setEmail(e.detail.value!)}
                                required
                            />
                            <label>Password</label>
                            <IonInput
                                id='input'
                                type="password"
                                value={password}
                                onIonChange={(e) =>
                                    setPassword(e.detail.value!)
                                }
                                required
                            />
                            <label>Confirm Password</label>
                            <IonInput
                                id='input'
                                type="password"
                                value={passwordConfirm}
                                onIonChange={(e) =>
                                    setPasswordConfirm(e.detail.value!)
                                }
                                required
                            />
                            <IonButton
                                expand="block"
                                type="submit"
                                className="w-100"
                            >
                                Sign Up
                            </IonButton>
                        </form>
                    </IonCardContent>
                </IonCard>
                <div className="ion-text-center mt-2">
                    Already have an account? <Link to="/login">Login</Link>
                </div>
                <IonToast
                    message={toastMessage}
                    isOpen={showToast}
                    duration={3000}
                    onDidDismiss={() => setShowToast(false)}
                ></IonToast>
            </IonContent>
        </IonPage>
    );
};

export default SignupPage;
