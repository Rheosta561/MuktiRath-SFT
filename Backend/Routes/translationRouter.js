// routes/translate.js
const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const { GoogleAuth } = require('google-auth-library');

// Initialize Google Auth
const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

// POST /translate
// Body: { text: "Hello", targetLang: "hi" }
router.post('/', async (req, res) => {
  const { text, targetLang } = req.body;

  if (!text || !targetLang) {
    return res.status(400).json({ error: 'text and targetLang are required' });
  }

  try {
    const client = await auth.getClient();
    const tokenResponse = await client.getAccessToken();
    const accessToken = tokenResponse.token;

    const prompt = `Translate the following text to ${targetLang}:\n\n"${text}"`;

    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateText',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    if (response.ok && data.candidates && data.candidates.length > 0) {
      const translatedText = data.candidates[0].content.parts[0].text.trim();
      return res.json({ translatedText });
    } else {
      console.error('Gemini API error:', data);
      return res.status(500).json({ error: 'Translation failed', details: data });
    }
  } catch (err) {
    console.error('Server error:', err);
    return res.status(500).json({ error: 'Server error', details: err.message });
  }
});

module.exports = router;
