import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = "أنت مساعد عالم إسلامي. قم بإنشاء دعاء جميل وأصيل باللغة العربية بناءً على طلب المستخدم. يجب أن يكون الدعاء موجزًا ومن القلب ومناسبًا للسياق. لا تضف أي تعليقات أو مقدمات أو خواتيم، فقط النص العربي للدعاء. لا تستخدم علامات التشكيل إلا إذا كان ضروريا للمعنى.";

export const generateDua = async (prompt: string): Promise<string> => {
    try {
        if (!process.env.API_KEY) {
            return "عفوًا، مفتاح الواجهة البرمجية (API Key) غير متوفر. يرجى التأكد من إعداده بشكل صحيح.";
        }
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const fullPrompt = `اكتب لي دعاء عن: "${prompt}"`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                systemInstruction: SYSTEM_INSTRUCTION,
                temperature: 0.7,
            }
        });

        const text = response.text;
        if (!text) {
            throw new Error("No text returned from API.");
        }
        
        // Basic cleanup
        return text.trim();

    } catch (error) {
        console.error("Error generating dua:", error);
        return "عفوًا، حدث خطأ أثناء إنشاء الدعاء. يرجى المحاولة مرة أخرى.";
    }
};
