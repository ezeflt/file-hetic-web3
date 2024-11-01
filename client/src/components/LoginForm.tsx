import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';

interface AuthFormProps {
    onAuth: (token: string) => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegister, setIsRegister] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        try {
            if (isRegister) {
                const response = await registerUser(email, password);
                alert(response.data.message);
            } else {
                const response = await loginUser(email, password);
                onAuth(response.data.token);
            }
            setEmail('');
            setPassword('');
        } catch (err: any) {
            setError(err.response.data.error || 'Une erreur est survenue');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{isRegister ? 'S\'inscrire' : 'Se connecter'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <button type="submit">{isRegister ? 'S\'inscrire' : 'Se connecter'}</button>
            <button type="button" onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? 'Déjà inscrit ? Se connecter' : 'Pas encore inscrit ? S\'inscrire'}
            </button>
        </form>
    );
};

export default AuthForm;
