import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PlayerSide } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
}

export async function getBestChessMove(
  base64Image: string,
  mimeType: string,
  side: PlayerSide
): Promise<{ bestMove: string; explanation: string }> {
  try {
    const prompt = `
Analyze the image of this chessboard.
Identify the current position of all pieces.
The player to move is ${side}.
Calculate the single best move for the ${side} player.
Provide the move in UCI notation (e.g., 'e2e4' for pawn to e4, 'g1f3' for knight to f3).
Also provide a brief, one-sentence explanation for why this move is strong.
Do not return markdown.
`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [{ text: prompt }, imagePart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    bestMove: {
                        type: Type.STRING,
                        description: "The best move in UCI notation (e.g., e2e4).",
                    },
                    explanation: {
                        type: Type.STRING,
                        description: "A brief, one-sentence explanation of the move.",
                    },
                },
                required: ["bestMove", "explanation"],
            },
        }
    });
    
    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    
    if (result && typeof result.bestMove === 'string' && typeof result.explanation === 'string') {
        return {
            bestMove: result.bestMove,
            explanation: result.explanation
        };
    } else {
        throw new Error("Invalid response format from API");
    }

  } catch (error) {
    console.error("Error getting best chess move:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to get best move: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the API.");
  }
}