module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GEMINI_KEY = process.env.GEMINI_KEY;

  if (!GEMINI_KEY) {
    return res.status(500).json({ error: 'GEMINI_KEY not set' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body),
      }
    );

    const text = await response.text();
    res.status(response.status).json(JSON.parse(text));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
