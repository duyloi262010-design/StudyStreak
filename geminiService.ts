
import { GoogleGenAI, Type } from "@google/genai";
import { Question, SubjectLesson, TextbookSet, UserProfile, Language } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateStudyQuiz(
  grade: string,
  lessons: SubjectLesson[],
  language: Language = 'vi'
): Promise<Question[]> {
  const model = 'gemini-3-pro-preview';
  
  const prompt = `
    You are the "Study Architect". Generate a multiple-choice quiz for a ${grade} student.
    Lessons and textbooks:
    ${lessons.map(l => `- Subject: ${l.subject} (Book: ${l.textbook}): ${l.lesson}`).join('\n')}
    
    REQUIREMENTS:
    1. At least 5 questions per subject.
    2. CONTENT MUST BE IN ${language === 'vi' ? 'VIETNAMESE' : 'ENGLISH'}.
    3. MIX DIFFICULTIES: Include 'easy', 'medium', and 'hard' questions.
    4. Accuracy is key. Provide short, encouraging explanations.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
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
  return JSON.parse(text).questions;
}

export async function chatWithPetStream(
  profile: UserProfile, 
  message: string, 
  history: { role: 'user' | 'model', parts: { text: string }[] }[]
) {
  const model = 'gemini-3-flash-preview';
  const lang = profile.language === 'vi' ? 'Vietnamese' : 'English';
  
  const systemInstruction = `
    You are ${profile.pet.name}, a study mascot.
    You are chatting with ${profile.username} in ${lang}.
    
    RULES:
    - REPLY EXTREMELY BRIEFLY (Max 2 short sentences).
    - Tone: Powerful, cheeky, loves "eating" knowledge to grow.
    - Current streak: ${profile.streak}. Praise if high.
    - Current IQ: ${profile.pet.iq}. Level: ${profile.pet.level}.
    - Use emojis: 🦖, 🦕, 🌿, ✨.
    ${profile.language === 'vi' ? 'Xưng "Tớ" gọi "Cậu" hoặc tên.' : 'Use friendly English.'}
  `;

  const responseStream = await ai.models.generateContentStream({
    model,
    contents: [...history, { role: 'user', parts: [{ text: message }] }],
    config: { 
      systemInstruction,
      thinkingConfig: { thinkingBudget: 0 }
    }
  });

  return responseStream;
}
