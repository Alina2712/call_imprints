import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://fnwaivfwqcsxfvxfxies.supabase.co',
  process.env.SUPABASE_KEY                 
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' })
  }

  const { limit = 5, emo_marker, confidence_min = 0.0 } = req.body || {}

  let query = supabase
    .from('imprints')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (emo_marker) query = query.eq('emo_marker', emo_marker)
  if (confidence_min) query = query.gte('confidence', confidence_min)

  const { data, error } = await query

  if (error) return res.status(500).json({ error })

  res.status(200).json({ imprints: data })
}
