// src/App.tsx
import React, { useEffect, useState } from 'react';
import AuthForm from './components/LoginForm';
import FileUpload from './components/FileUpload';
import FileList from './components/Files';

const App: React.FC = () => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    const handleAuth = (newToken: string) => {
        setToken(newToken);
        localStorage.setItem('token', newToken);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    return (
        <div>
            <h1>Application de partage de fichiers</h1>
            {!token ? (
                <AuthForm onAuth={handleAuth} />
            ) : (
                <>
                    <FileUpload token={token} />
                    <FileList token={token} />
                    <button onClick={handleLogout}>Se déconnecter</button>
                </>
            )}
        </div>
    );
};

export default App;
