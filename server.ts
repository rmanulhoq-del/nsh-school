import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // AI Bank Statement Reconciliation Endpoint
  app.post('/api/ai-reconcile', async (req, res) => {
    try {
      const { statementText, bankHint } = req.body;
      if (!statementText || typeof statementText !== 'string') {
        return res.status(400).json({ error: 'স্টেটমেন্ট টেক্সট প্রদান করা হয়নি।' });
      }

      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({ 
          error: 'GEMINI_API_KEY কনফিগার করা নেই।',
          fallback: true
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      
      const prompt = `
You are an expert AI data extractor for high school bank fee reconciliation in Bangladesh (Napora Shekherkhil High School, Banshkhali, Chattogram).
Banks involved:
1. বাংলাদেশ কৃষি ব্যাংক (নাপোড়া বাজার শাখা, বাঁশখালী)
2. আইএফআইসি ব্যাংক (নাপোড়া বাজার উপশাখা, বাঁশখালী)

Extract all student fee payment records from the provided raw bank statement text/slips.
Raw text:
"""
${statementText}
"""

Default bank if not mentioned: "${bankHint || 'বাংলাদেশ কৃষি ব্যাংক'}"

Output strictly a valid JSON array of objects with the following schema:
[
  {
    "studentId": string (e.g. "STU-6A-002" or if only roll and class found, construct standard ID or provide roll),
    "roll": number (student roll number if found, or 0),
    "className": string (one of "6", "7", "8", "9", "10"),
    "section": string (one of "A", "B", "C", "D"),
    "studentName": string (student name if mentioned, or empty string),
    "amount": number (deposited amount in BDT),
    "bank": string (must be either "বাংলাদেশ কৃষি ব্যাংক" or "আইএফআইসি ব্যাংক"),
    "txnId": string (e.g. "BKB-XXXXXX" or "IFIC-XXXXXX" or bank transaction ref),
    "paymentDate": string (e.g. "2026-10-13 10:15 AM" or date mentioned)
  }
]

Return ONLY raw JSON without markdown formatting or code blocks.
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      let text = response.text || '';
      // Clean up markdown blocks if any
      text = text.replace(/```json/g, '').replace(/```/g, '').trim();

      const parsedData = JSON.parse(text);
      return res.json({ success: true, records: parsedData });
    } catch (err: any) {
      console.error('AI Reconcile Error:', err);
      return res.status(500).json({ 
        error: err.message || 'AI স্টেটমেন্ট পার্স করতে ব্যর্থ হয়েছে।',
        fallback: true 
      });
    }
  });

  // Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
