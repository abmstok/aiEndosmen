
import React, { useState, useCallback } from 'react';
import { useTheme } from './hooks/useTheme.ts';
import type { GeneratedImage } from './types.ts';
import { generateEndorsementImage } from './services/geminiService.ts';
import ThemeToggle from './components/ThemeToggle.tsx';
import ImageUploader from './components/ImageUploader.tsx';
import ResultCard from './components/ResultCard.tsx';
import { ImageIcon, ProductIcon } from './components/icons.tsx';

const App: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [modelFile, setModelFile] = useState<File | null>(null);
    const [productFile, setProductFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [isHd, setIsHd] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleGenerateClick = useCallback(async () => {
        if (!modelFile || !productFile) {
            setError("Harap unggah foto model dan foto produk terlebih dahulu.");
            return;
        }

        setIsLoading(true);
        setError(null);
        const initialImages: GeneratedImage[] = Array(6).fill(null).map((_, i) => ({
            id: i,
            src: null,
            status: 'loading'
        }));
        setGeneratedImages(initialImages);

        const userPrompt = prompt.trim() || 'a bright, professional studio setting';
        const qualityPrompt = isHd
            ? "Create an ultra-realistic, 4K resolution, high-detail, professional product endorsement photograph."
            : "Create a high-quality, photorealistic product endorsement collage.";

        const basePrompt = `${qualityPrompt} The person in the first image is the model. The item in the second image is the product. Integrate the model and the product naturally into a scene with a style of: "${userPrompt}". The model should look happy and engaging. The lighting should be professional. The product should be clearly visible and appealing.`;

        const generationPromises = initialImages.map(async (image) => {
            try {
                const variedPrompt = `${basePrompt} Style variation ${image.id + 1}.`;
                const imageUrl = await generateEndorsementImage(variedPrompt, modelFile, productFile);
                setGeneratedImages(prev => prev.map(img => img.id === image.id ? { ...img, src: imageUrl, status: 'success' } : img));
            } catch (err) {
                console.error(`Error generating image ${image.id + 1}:`, err);
                setGeneratedImages(prev => prev.map(img => img.id === image.id ? { ...img, status: 'error' } : img));
            }
        });

        await Promise.allSettled(generationPromises);

        // Check if any failed to show a general error message
        setGeneratedImages(currentImages => {
            if (currentImages.some(img => img.status === 'error')) {
                setError("Beberapa gambar gagal dibuat. Silakan coba lagi.");
            }
            return currentImages;
        });

        setIsLoading(false);

    }, [modelFile, productFile, prompt, isHd]);

    return (
        <div className="container mx-auto px-4 py-8 md:py-12 relative">
            <div className="absolute top-4 right-4 md:top-8 md:right-8 z-30">
                <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            </div>

            <header className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">AI Endorsement Generator</h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">Buat gambar promosi profesional dalam sekejap.</p>
            </header>

            <main>
                <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-lg mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ImageUploader id="model-input" label="1. Unggah Foto Model" onFileSelect={setModelFile} icon={<ImageIcon />} />
                        <ImageUploader id="product-input" label="2. Unggah Foto Produk" onFileSelect={setProductFile} icon={<ProductIcon />} />
                    </div>
                    <div className="mt-6">
                        <label htmlFor="prompt" className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300">3. Deskripsikan Gaya yang Diinginkan</label>
                        <input
                            type="text"
                            id="prompt"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                            placeholder="Contoh: tema alam, studio minimalis, suasana perkotaan..."
                        />
                    </div>
                    <div className="mt-6 flex items-center justify-center">
                        <input
                            id="hd-quality"
                            type="checkbox"
                            checked={isHd}
                            onChange={(e) => setIsHd(e.target.checked)}
                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                        <label htmlFor="hd-quality" className="ml-2 text-md font-medium text-gray-700 dark:text-gray-300">Hasil Resolusi Tinggi (4K)</label>
                    </div>
                    <div className="mt-8 text-center">
                        <button
                            onClick={handleGenerateClick}
                            disabled={isLoading}
                            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800 transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? 'Memproses...' : 'Buat Gambar Endorsement'}
                        </button>
                    </div>
                </div>

                {generatedImages.length > 0 && (
                    <div id="output-section" className="max-w-6xl mx-auto">
                        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">Hasil Generasi AI</h2>
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center mb-8">
                                <p className="mt-4 text-gray-600 dark:text-gray-400">AI sedang bekerja... Proses ini mungkin memakan waktu beberapa saat.</p>
                            </div>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                            {generatedImages.map((image) => (
                                <ResultCard key={image.id} image={image} />
                            ))}
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-4xl mx-auto mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-lg text-center">
                        <p>{error}</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;