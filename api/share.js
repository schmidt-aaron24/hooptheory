const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wcctupquldbknqvsmaes.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3R1cHF1bGRia25xdnNtYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NjY5NzMsImV4cCI6MjA5NjU0Mjk3M30.f5eAdDHtxptiL95rPO2xkK3mMA-EESjXhqwJgbdE9m8'
);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { wins, losses, grade, grade_label, ovr, roster, user_id, username } = req.body;

    const { data, error } = await supabase
      .from('shared_teams')
      .insert({ wins, losses, grade, grade_label, ovr, roster, user_id: user_id || null, username: username || null })
      .select('id')
      .single();

    if (error) throw error;

    return res.status(200).json({ id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
