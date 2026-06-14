const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://inputtools.google.com;"
  );
  next();
});

// Basic rate limiting (in-memory, for demo purposes)
// TODO(security): Use a robust store like Redis + express-rate-limit in production
const rateLimitCache = new Map();
const RATE_LIMIT_WINDOW_MS = 10000; // 10 seconds
const MAX_REQUESTS_PER_WINDOW = 15;

const rateLimitMiddleware = (req, res, next) => {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  if (!rateLimitCache.has(ip)) {
    rateLimitCache.set(ip, []);
  }
  const timestamps = rateLimitCache.get(ip).filter(time => now - time < RATE_LIMIT_WINDOW_MS);
  timestamps.push(now);
  rateLimitCache.set(ip, timestamps);

  if (timestamps.length > MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ error: 'Too many requests. Please slow down.' });
  }
  next();
};

// Limit request body size
app.use(express.json({ limit: '2mb' }));

// Serve the frontend (index.html, etc.) from this same directory
app.use(express.static(__dirname));

// Proxy endpoint: forwards ink data to Google's handwriting recognizer
app.post('/api/recognize', rateLimitMiddleware, async (req, res) => {
  try {
    // Input validation
    if (!req.body || !req.body.requests || !Array.isArray(req.body.requests) || req.body.requests.length === 0) {
      return res.status(400).json({ error: 'Invalid request format.' });
    }

    const firstRequest = req.body.requests[0];
    if (!firstRequest.ink || !Array.isArray(firstRequest.ink) || typeof firstRequest.language !== 'string') {
      return res.status(400).json({ error: 'Invalid ink or language data.' });
    }

    const response = await fetch(
      'https://inputtools.google.com/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('Recognition proxy error:', err);
    res.status(502).json({ error: 'Failed to reach handwriting recognition service.' });
  }
});

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Guru Digital Classroom running at http://127.0.0.1:${PORT}`);
});
