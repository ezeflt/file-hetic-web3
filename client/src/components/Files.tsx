import React, { useEffect, useState } from 'react';
import { fetchFiles, deleteFile, shareFile } from '../services/api';

interface FileListProps {
    token: string;
}

interface File {
    _id: string;
    filename: string;
    size: number;
    tokenShare: string;
    uploadDate: string;
}

const FileList: React.FC<FileListProps> = ({ token }) => {
    const [files, setFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);

    const loadFiles = async () => {
        setError(null);
        try {
            const response = await fetchFiles(token);
            setFiles(response.data);
        } catch (err: any) {
            setError(err.response.data.error || 'Une erreur est survenue');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        console.log(date);
        const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        let interval = Math.floor(seconds / 31536000);
        if (interval >= 1) return `ajouté il y a ${interval} an${interval > 1 ? 's' : ''} `;

        interval = Math.floor(seconds / 2592000);
        if (interval >= 1) return `ajouté il y a ${interval} mois `;

        interval = Math.floor(seconds / 86400);
        if (interval >= 1) return `ajouté il y a ${interval} jour${interval > 1 ? 's' : ''} `;

        interval = Math.floor(seconds / 3600);
        if (interval >= 1) return `ajouté il y a ${interval} heure${interval > 1 ? 's' : ''} `;

        interval = Math.floor(seconds / 60);
        if (interval >= 1) return ` ajouté il y a ${interval} minute${interval > 1 ? 's' : ''}`;

        return 'À l\'instant';
    };


    const handleDelete = async (fileId: string) => {
        try {
            await deleteFile(fileId, token);
            loadFiles();
        } catch (err: any) {
            setError(err.response.data.error || 'Une erreur est survenue');
        }
    };

    const handleShare = async (tokenShare: string) => {
        console.log(tokenShare);
        const shareLink = `${window.location.origin}/share/${tokenShare}`;
        alert(`Lien de partage : ${shareLink}`);
    };

    useEffect(() => {
        loadFiles();
    }, [token]);

    return (
        <div>
            <h2>Vos fichiers</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul>
                {files.map(file => (
                    <li key={file._id}>
                        {file.filename} - {file.size} octets - {formatDate(file.uploadDate)} -
                        <button onClick={() => handleDelete(file._id)}>Supprimer</button>
                        <button onClick={() => handleShare(file.tokenShare)}>Partager</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
