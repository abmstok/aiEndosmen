
import React, { useState, useCallback, ChangeEvent } from 'react';

interface ImageUploaderProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    onFileSelect: (file: File | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, icon, onFileSelect }) => {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onFileSelect(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            onFileSelect(null);
            setPreview(null);
        }
    }, [onFileSelect]);

    return (
        <div>
            <label className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">{label}</label>
            <div className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                <input
                    id={id}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />
                {preview ? (
                    <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover rounded-lg z-10" />
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500 dark:text-gray-400 z-5">
                        {icon}
                        <p className="mb-2 text-sm font-semibold">Klik untuk mengunggah</p>
                        <p className="text-xs">PNG, JPG, atau WEBP</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
