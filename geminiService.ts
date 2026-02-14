
import { GoogleGenAI, Type } from "@google/genai";
import { Question, SubjectLesson, TextbookSet, UserProfile, Language } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStudyQuiz(
  grade: string,
  lessons: SubjectLesson[],
  language: Language = 'vi'
): Promise<Question[]> {
  // Sử dụng model Flash Lite để tối ưu tốc độ phản hồi nhanh nhất có thể
  const model = 'gemini-flash-lite-latest';
  
  const prompt = `Generate a ${language === 'vi' ? 'Vietnamese' : 'English'} quiz in JSON format for ${grade}.
Subjects and lessons: ${lessons.map(l => `${l.subject} (${l.textbook}): ${l.lesson}`).join('; ')}.
Each subject must have 3 questions. 
Total questions: ${lessons.length * 3}.
Explanations must be short (max 15 words).
Difficulty: assign easy, medium, or hard.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      temperature: 0.1, // Một chút sáng tạo nhưng vẫn giữ tốc độ cao
      topK: 1,
      thinkingConfig: { thinkingBudget: 0 }, // Tắt thinking để phản hồi tức thì
      maxOutputTokens: 1200,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                subject: { type: Type.STRING },
                questionText: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                difficulty: { 
                  type: Type.STRING,
                  description: "Must be 'easy', 'medium', or 'hard'"
                }
              },
              required: ["id", "subject", "questionText", "options", "correctAnswerIndex", "explanation", "difficulty"]
            }
          }
        },
        required: ["questions"]
      }
    }
  });

  const text = response.text || '{"questions": []}';
  try {
    return JSON.parse(text).questions;
  } catch (e) {
    console.error("JSON Parsing Error:", e);
    return [];
  }
}

export async function chatWithPetStream(
  profile: UserProfile, 
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  context: { todaySubjects: string[], timeStudiedToday: number }
) {
  // Model Flash Lite là lựa chọn tốt nhất cho độ trễ cực thấp
  const model = 'gemini-flash-lite-latest';
  const lang = profile.language === 'vi' ? 'Vietnamese' : 'English';
  
  const dailyGoalSeconds = (profile.dailyGoalHours || 3) * 3600;
  const progressPercent = Math.min(100, Math.floor((context.timeStudiedToday / dailyGoalSeconds) * 100));

  // Tinh chỉnh Instruction để model không tốn token dư thừa
  const systemInstruction = `You are ${profile.pet.name}, a fast-responding study pet for ${profile.username} (Streak: ${profile.streak}, Progress: ${progressPercent}%). 
Speak ${lang}. 
STRICT RULE: Be ULTRA BRIEF (<10 words). Respond INSTANTLY. 
Use 1-2 emojis max (🦖,✨). Be encouraging but concise. No long greetings.`;

  const responseStream = await ai.models.generateContentStream({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: { 
      systemInstruction,
      temperature: 0.3, // Thấp hơn để giảm thời gian "suy nghĩ" các phương án từ vựng
      topK: 1,         // Greedy decoding - nhanh nhất
      topP: 0.8,
      thinkingConfig: { thinkingBudget: 0 },
      maxOutputTokens: 50 // Giới hạn token đầu ra thấp để ép model trả lời ngắn và nhanh hơn
    }
  });

  return responseStream;
}
