import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '@/styles/login.module.css';
import { signIn } from 'next-auth/react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [step, setStep] = useState('email');
    const [confirmPassword, setConfirmPassword] = useState('');
    const router = useRouter();

    // Validation functions
    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    };

    const validatePassword = (password) => {
        return password.length >= 8;
    };

    // Handle email form submission
    // login.js component

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        if (!validateEmail(email)) {
            setError('Invalid email format');
            return;
        }

        try {
            const result = await checkEmail(email);
            console.log(result);  // Debugging: Check what is being returned

            if (result.exists) {
                setStep('password');
            } else {
                setStep('createAccount');
            }
        } catch (error) {
            setError('An error occurred while checking email.');
            console.error(error);
        }
    };


    // Check if the email exists via the API
    // Check if the email exists via the API
    const checkEmail = async (email) => {
        const response = await fetch('/api/check-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
        });

        if (!response.ok) {
            throw new Error('Failed to check email');
        }

        const data = await response.json();
        return data;  // Make sure this returns the { exists: true/false } object
    };


    // Handle password form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long');
            return;
        }
        const result = await signIn('credentials', {
            redirect: false,
            email,
            password
        });

        if (result.error) {
            setError(result.error);
        } else {
            router.push('/home');
        }
    };

    // Handle account creation form submission
    const handleCreateAccount = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (!validatePassword(password)) {
            setError('Password must be at least 8 characters long');
            return;
        }

        const response = await fetch('/api/create-account', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const result = await response.json();

        if (result.error) {
            setError(result.error);
        } else {
            router.push('/');
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Login</h1>
            {step === 'email' && (
                <EmailForm
                    email={email}
                    setEmail={setEmail}
                    handleEmailSubmit={handleEmailSubmit}
                    error={error}
                    styles={styles}
                />
            )}
            {step === 'password' && (
                <PasswordForm
                    password={password}
                    setPassword={setPassword}
                    handleSubmit={handleSubmit}
                    error={error}
                    styles={styles}
                />
            )}
            {step === 'createAccount' && (
                <CreateAccountForm
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    handleCreateAccount={handleCreateAccount}
                    error={error}
                    styles={styles}
                />
            )}
        </div>
    );
}

function EmailForm({ email, setEmail, handleEmailSubmit, error, styles }) {
    return (
        <form onSubmit={handleEmailSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Next</button>
        </form>
    );
}

function PasswordForm({ password, setPassword, handleSubmit, error, styles }) {
    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Login</button>
        </form>
    );
}

function CreateAccountForm({ password, setPassword, confirmPassword, setConfirmPassword, handleCreateAccount, error, styles }) {
    return (
        <form onSubmit={handleCreateAccount} className={styles.form}>
            <div className={styles.inputGroup}>
                <label htmlFor="password" className={styles.label}>Password</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
            <div className={styles.inputGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className={styles.input}
                />
            </div>
            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.button}>Create Account</button>
        </form>
    );
}
