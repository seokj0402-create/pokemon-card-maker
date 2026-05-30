export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_KEY = process.env.GEMINI_KEY;

  if (!GEMINI_KEY) {
    console.error('GEMINI_KEY env var is missing');
    return res.status(500).json({ error: 'GEMINI_KEY not set in environment variables' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();

    if (!response.ok) {
      console.error('Gemini API error:', response.status, text);
      return res.status(response.status).json({ error: text });
    }

    res.status(200).json(JSON.parse(text));
  } catch (err) {
    console.error('Handler error:', err.message);
    res.status(500).json({ error: err.message });
  }
}
