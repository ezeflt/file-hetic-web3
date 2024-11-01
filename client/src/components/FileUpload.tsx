import React, { useState } from 'react';
import { uploadFile } from '../services/api';

interface FileUploadProps {
    token: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ token }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setError(null);

        try {
            await uploadFile(file, token);
            setFile(null);
            window.location.reload();
        } catch (err: any) {
            setError(err.response.data.error || 'Une erreur est survenue');
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload}>Télécharger</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default FileUpload;
