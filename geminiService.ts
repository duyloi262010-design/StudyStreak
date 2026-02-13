
import { GoogleGenAI, Type } from "@google/genai";
import { Question, SubjectLesson, TextbookSet, UserProfile, Language } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStudyQuiz(
  grade: string,
  lessons: SubjectLesson[],
  language: Language = 'vi'
): Promise<Question[]> {
  // Sử dụng Gemini 3 Flash - Model nhanh nhất hiện tại
  const model = 'gemini-3-flash-preview';
  
  // Tối ưu prompt: Yêu cầu số lượng câu hỏi vừa đủ (3 câu/môn) để giảm thời gian sinh văn bản
  const prompt = `
    Generate a concise multiple-choice quiz for a ${grade} student.
    Context:
    ${lessons.map(l => `- Subject: ${l.subject} (Book: ${l.textbook}): ${l.lesson}`).join('\n')}
    
    Rules:
    1. Exactly 3 high-quality questions per subject (to ensure speed).
    2. Output in ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
    3. Short explanations (max 15 words).
    4. Mix difficulty: easy, medium, hard.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // Vô hiệu hóa thinking để giảm độ trễ (latency) tối đa
      thinkingConfig: { thinkingBudget: 0 },
      // Giới hạn tokens để model không viết quá dài
      maxOutputTokens: 1500,
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
                  items: { type: Type.STRING }
                },
                correctAnswerIndex: { type: Type.INTEGER },
                explanation: { type: Type.STRING },
                difficulty: { 
                  type: Type.STRING, 
                  description: "easy, medium, or hard" 
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
  return JSON.parse(text).questions;
}

export async function chatWithPetStream(
  profile: UserProfile, 
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[],
  context: { todaySubjects: string[], timeStudiedToday: number }
) {
  const model = 'gemini-3-flash-preview';
  const lang = profile.language === 'vi' ? 'Vietnamese' : 'English';
  
  const dailyGoalSeconds = (profile.dailyGoalHours || 3) * 3600;
  const progressPercent = Math.min(100, Math.floor((context.timeStudiedToday / dailyGoalSeconds) * 100));
  const remainingSubjects = context.todaySubjects.join(', ');

  const systemInstruction = `
    Bạn là ${profile.pet.name}, linh vật học tập. Trò chuyện với ${profile.username} bằng tiếng ${lang}.
    Streak: ${profile.streak} ngày. Tiến độ: ${progressPercent}%. Cần học: ${remainingSubjects}.
    
    PHONG CÁCH: 
    - TRẢ LỜI CỰC NGẮN (dưới 15 từ).
    - Năng động, lém lỉnh, dùng emoji (🦖, ✨, ⚡).
    - Không giải thích dài dòng.
  `;

  const responseStream = await ai.models.generateContentStream({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: { 
      systemInstruction,
      temperature: 0.5, // Thấp hơn để phản hồi nhanh và ổn định hơn
      thinkingConfig: { thinkingBudget: 0 },
      maxOutputTokens: 150 // Giới hạn độ dài để stream nhanh hơn nữa
    }
  });

  return responseStream;
}
