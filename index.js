import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://fnwaivfwqcsxfvxfxies.supabase.co' 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZud2FpdmZ3cWNzeGZ2eGZ4aWVzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzY1MjI3MywiZXhwIjoyMDYzMjI4MjczfQ.ZjOgb6OT-DMX0nXENfLta57NTbH_jVF5E6zi-NBIF5I' 
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }

  const { limit = 5, emo_marker, confidence_min = 0.0 } = req.body || {}

  try {
    let query = supabase
      .from('alina_rael')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (emo_marker) query = query.eq('emo_marker', emo_marker)
    if (confidence_min) query = query.gte('confidence', confidence_min)

    const { data, error } = await query

    if (error) {
      return res.status(500).json({ error: error.message })
    }

    res.status(200).json({ imprints: data })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

