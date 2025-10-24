
import { GoogleGenAI, Modality } from "@google/genai";

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const result = (reader.result as string).split(',')[1];
            if (result) {
                resolve(result);
            } else {
                reject(new Error("Failed to convert file to base64"));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};

export const generateEndorsementImage = async (prompt: string, modelImageFile: File, productImageFile: File): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const modelImageBase64 = await fileToBase64(modelImageFile);
    const productImageBase64 = await fileToBase64(productImageFile);

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [
                { text: prompt },
                {
                    inlineData: {
                        data: modelImageBase64,
                        mimeType: modelImageFile.type,
                    },
                },
                {
                    inlineData: {
                        data: productImageBase64,
                        mimeType: productImageFile.type,
                    },
                },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }

    throw new Error("No image data received from API.");
};
