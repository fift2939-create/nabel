import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Generates a creative description for a book or initiative based on its title and author.
 */
export const generateDescription = async (title: string, author: string, type: 'novel' | 'initiative'): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning placeholder.");
    return "يرجى إضافة مفتاح API لتوليد الوصف تلقائياً.";
  }

  try {
    const prompt = `
      تخيل أنك ناقد أدبي وخبير تسويق.
      اكتب وصفاً قصيراً وجذاباً (حوالي 40-50 كلمة) باللغة العربية لـ ${type === 'novel' ? 'رواية' : 'مبادرة شبابية'} بعنوان: "${title}"
      ${author ? `للمؤلف/المنظم: "${author}"` : ''}
      
      اجعل الوصف مشوقاً ويشجع القارئ على الاطلاع عليها.
      بدون مقدمات، ابدأ الوصف مباشرة.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "لم يتم استرجاع نص.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "حدث خطأ أثناء توليد الوصف. يرجى المحاولة لاحقاً أو كتابة الوصف يدوياً.";
  }
};
