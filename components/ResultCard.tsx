
import React from 'react';
import type { GeneratedImage } from '../types.ts';
import { DownloadIcon } from './icons.tsx';

interface ResultCardProps {
    image: GeneratedImage;
}

const ResultCard: React.FC<ResultCardProps> = ({ image }) => {
    const renderContent = () => {
        switch (image.status) {
            case 'loading':
                return <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>;
            case 'error':
                return (
                    <div className="p-4 text-center text-red-600 dark:text-red-400 flex flex-col items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <span className="text-sm">Gagal memuat gambar</span>
                    </div>
                );
            case 'success':
                if (!image.src) return null;
                return (
                    <>
                        <img src={image.src} alt={`Generated endorsement ${image.id + 1}`} className="w-full h-full object-cover" />
                        <a
                            href={image.src}
                            download={`ai-endorsement-${image.id + 1}.png`}
                            title="Unduh Gambar"
                            className="absolute top-3 right-3 z-20 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <DownloadIcon />
                        </a>
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden aspect-square flex items-center justify-center">
            {renderContent()}
        </div>
    );
};

export default ResultCard;