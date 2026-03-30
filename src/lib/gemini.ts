import { GoogleGenAI } from '@google/genai';

export const HAIRSTYLES = {
  taper_fade: {
    name: 'Taper Fade',
    description: 'Clean and sharp taper fade',
    emoji: '💈',
    prompt: 'Apply a clean, modern taper fade haircut to this person. The sides should be neatly faded from skin to about 1 inch on top, with a sharp line-up at the forehead and temples. Keep the top slightly longer with a natural texture. The result should look like a professional barbershop cut. Maintain the same person, face, skin tone, and background. Only change the hairstyle.',
  },
  curly: {
    name: 'Curly',
    description: 'Defined curly texture',
    emoji: '🌀',
    prompt: 'Style this person\'s hair into defined, voluminous curly hair. The curls should be tight-to-medium spirals with good definition and natural bounce. The hair should look healthy and well-maintained with a trendy modern curly hairstyle. Maintain the same person, face, skin tone, and background. Only change the hairstyle.',
  },
  buzzcut: {
    name: 'Buzz Cut',
    description: 'Clean minimal buzz cut',
    emoji: '✂️',
    prompt: 'Give this person a clean, uniform buzz cut at about a #2 guard length. The hair should be very short and even all around with a sharp, clean hairline. It should look fresh and well-groomed. Maintain the same person, face, skin tone, and background. Only change the hairstyle.',
  },
  mullet: {
    name: 'Mullet',
    description: 'Modern mullet style',
    emoji: '🎸',
    prompt: 'Apply a modern, trendy mullet hairstyle to this person. Short and textured on top and sides, with longer flowing hair at the back reaching the neck/shoulders. It should be a contemporary fashion-forward mullet, not retro. Maintain the same person, face, skin tone, and background. Only change the hairstyle.',
  },
  wolf_cut: {
    name: 'Wolf Cut',
    description: 'Trendy layered wolf cut',
    emoji: '🐺',
    prompt: 'Apply a trendy wolf cut hairstyle to this person. It should have heavy, shaggy layers throughout with volume at the crown, curtain bangs framing the face, and a textured, lived-in look. The style should be edgy and modern. Maintain the same person, face, skin tone, and background. Only change the hairstyle.',
  },
} as const;

export type HairstyleKey = keyof typeof HAIRSTYLES;

export async function generateHairstyle(
  imageBase64: string,
  mimeType: string,
  style: HairstyleKey,
  apiKey?: string
): Promise<{ imageBase64: string; mimeType: string } | null> {
  const key = apiKey || process.env.GEMINI_API_KEY;
  if (!key) throw new Error('No Gemini API key available');

  const ai = new GoogleGenAI({ apiKey: key });

  const hairstyle = HAIRSTYLES[style];
  if (!hairstyle) throw new Error(`Unknown style: ${style}`);

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-image-preview',
    contents: [
      {
        role: 'user',
        parts: [
          { text: hairstyle.prompt },
          {
            inlineData: {
              mimeType: mimeType,
              data: imageBase64,
            },
          },
        ],
      },
    ],
    config: {
      responseModalities: ['TEXT', 'IMAGE'],
    },
  });

  if (!response.candidates?.[0]?.content?.parts) {
    return null;
  }

  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return {
        imageBase64: part.inlineData.data!,
        mimeType: part.inlineData.mimeType!,
      };
    }
  }

  return null;
}
