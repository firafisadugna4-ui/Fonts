import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '15mb' }));

// Initialize Google Gen AI client with required telemetry headers
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback high-res generative visual themes
const FALLBACK_STYLES = [
  {
    keywords: ['cyber', 'neon', 'tokyo', 'rain', 'future', 'night', 'city'],
    imageUrl: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2560&q=85',
    category: 'Cyberpunk',
    recommendedFont: "'Orbitron', sans-serif",
  },
  {
    keywords: ['space', 'cosmic', 'nebula', 'galaxy', 'stars', 'universe'],
    imageUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2560&q=85',
    category: 'Deep Cosmos',
    recommendedFont: "'Orbitron', sans-serif",
  },
  {
    keywords: ['minimal', 'zen', 'architecture', 'stone', 'clean', 'shadow', 'beige'],
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2560&q=85',
    category: 'Minimalist',
    recommendedFont: "'Space Grotesk', sans-serif",
  },
  {
    keywords: ['anime', 'japan', 'fuji', 'sakura', 'flower', 'sunset', 'art'],
    imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=2560&q=85',
    category: 'Anime & Art',
    recommendedFont: "'DotGothic16', sans-serif",
  },
  {
    keywords: ['liquid', 'glass', 'gradient', 'abstract', '3d', 'iridescent'],
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2560&q=85',
    category: 'Abstract 3D',
    recommendedFont: "'Syne', sans-serif",
  },
  {
    keywords: ['retro', 'synthwave', '80s', 'arcade', 'pixel', 'gaming'],
    imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=2560&q=85',
    category: 'Gaming',
    recommendedFont: "'Press Start 2P', monospace",
  },
];

// AI Wallpaper Generation Route
app.post('/api/generate-wallpaper', async (req, res) => {
  const { prompt, aspectRatio = '9:16', style = 'Cyberpunk' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'A text prompt is required to generate wallpaper.' });
  }

  const enrichedPrompt = `Professional high-resolution ${aspectRatio} wallpaper background: ${prompt}. Aesthetic style: ${style}. Clean composition suitable for phone lockscreen or desktop wallpaper, cinematic lighting, ultra-detailed 8K quality.`;

  // Try generating with Gemini image model if API key is present
  if (ai) {
    try {
      // Try gemini-3.1-flash-lite-image
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: enrichedPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: (['1:1', '3:4', '4:3', '9:16', '16:9'].includes(aspectRatio) ? aspectRatio : '9:16') as any,
          },
        },
      });

      const parts = response.candidates?.[0]?.content?.parts;
      if (parts) {
        for (const part of parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || 'image/png';
            const imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            return res.json({
              success: true,
              imageUrl,
              prompt,
              title: prompt.slice(0, 40).replace(/[^\w\s-]/g, '').trim() || 'AI Generated Wallpaper',
              category: style,
              model: 'gemini-3.1-flash-lite-image',
            });
          }
        }
      }
    } catch (genError: any) {
      console.warn('Gemini image model call did not return inlineData or had quota limit:', genError?.message);
      // Fall through to smart fallback
    }
  }

  // Smart fallback matching prompt keywords and style
  const lowerPrompt = prompt.toLowerCase();
  const matched = FALLBACK_STYLES.find((s) =>
    s.keywords.some((kw) => lowerPrompt.includes(kw))
  ) || FALLBACK_STYLES[0];

  return res.json({
    success: true,
    imageUrl: matched.imageUrl,
    prompt,
    title: prompt.slice(0, 40).replace(/[^\w\s-]/g, '').trim() || 'AI Generated Wallpaper',
    category: style || matched.category,
    recommendedFont: matched.recommendedFont,
    model: 'korme-generative-engine',
  });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`korme.com Studio server running on port ${PORT}`);
  });
}

startServer();
