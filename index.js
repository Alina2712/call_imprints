import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const SUPABASE_URL = 'https://fnwaivfwqcsxfvxfxies.supabase.co';
const SUPABASE_KEY = 'eeyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZud2FpdmZ3cWNzeGZ2eGZ4aWVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY1MjI3MywiZXhwIjoyMDYzMjI4MjczfQ.ZjOgb6OT-DMX0nXENfLta57NTbH_jVF5E6zi-NBIF5I'; // service_role key

app.post('/get', async (req, res) => {
  const { limit = 10, emo_marker, confidence_min = 0.0 } = req.body;

  const filters = [];
  if (emo_marker) filters.push(`emo_marker=eq.${emo_marker}`);
  if (confidence_min) filters.push(`confidence=gte.${confidence_min}`);
  const filterQuery = filters.length ? `&${filters.join('&')}` : '';

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/alina_rael?select=*&order=created_at.desc&limit=${limit}${filterQuery}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      return res.status(500).json({ status: 'error', detail: errorData });
    }

    const data = await response.json();
    res.status(200).json({ status: 'ok', imprints: data });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});
