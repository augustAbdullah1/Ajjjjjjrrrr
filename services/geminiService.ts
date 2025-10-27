
import { GoogleGenAI } from "@google/genai";

export const generateDua = async (prompt: string): Promise<string> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const systemInstruction = "You are an expert in Islamic supplications. Generate a beautiful, authentic, and heartfelt Dua in Arabic based on the user's request. Provide only the Arabic text of the Dua without any introduction or translation.";
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: systemInstruction,
            }
        });

        return response.text.trim();
    } catch (error) {
        console.error("Error generating Dua with Gemini:", error);
        return "عفوًا، حدث خطأ أثناء إنشاء الدعاء. يرجى المحاولة مرة أخرى.";
    }
};
