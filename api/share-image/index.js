const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://wcctupquldbknqvsmaes.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjY3R1cHF1bGRia25xdnNtYWVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5NjY5NzMsImV4cCI6MjA5NjU0Mjk3M30.f5eAdDHtxptiL95rPO2xkK3mMA-EESjXhqwJgbdE9m8'
);

module.exports = async function handler(req, res) {
  const { id } = req.query;
  if (!id) return res.status(400).send('Missing id');

  const { data, error } = await supabase
    .from('shared_teams')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) return res.status(404).send('Not found');

  const gradeColor = data.grade === 'S' ? '#f4a426' : data.grade === 'A' ? '#4ade80' : '#60a5fa';
  const playerRows = data.roster.map(r => {
    const name = r.player ? r.player.name : r.name;
    const pos = r.filledAs || r.pos;
    const team = r.player ? r.player.teamShort : r.teamShort;
    const decade = r.player ? r.player.decade : r.decade;
    const ppg = r.player ? r.player.ppg : '';
    return `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.06);">
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="background:#2a3a4a;border-radius:4px;padding:2px 7px;font-size:11px;font-weight:700;color:#60a5fa;">${pos}</span>
        <div>
          <div style="color:#fff;font-size:14px;font-weight:600;">${name}</div>
          <div style="color:#8899aa;font-size:11px;">${team} · ${decade}</div>
        </div>
      </div>
      <div style="color:#f4a426;font-size:13px;font-weight:700;">${ppg}pts</div>
    </div>`;
  }).join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#060d14"/>
        <stop offset="100%" stop-color="#0d1d2e"/>
      </linearGradient>
      <linearGradient id="card" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#0f1923"/>
        <stop offset="100%" stop-color="#1a2535"/>
      </linearGradient>
    </defs>
    <rect width="1200" height="630" fill="url(#bg)"/>
    <rect x="60" y="40" width="520" height="550" rx="16" fill="url(#card)" stroke="#f4a42640" stroke-width="1"/>
    
    <!-- Brand -->
    <text x="84" y="80" font-family="Georgia,serif" font-size="18" font-weight="900" fill="#f4a426" letter-spacing="4">HOOP THEORY</text>
    <text x="84" y="98" font-family="Arial,sans-serif" font-size="10" fill="#4a6a8a" letter-spacing="3">BALANCED ROSTER BUILDER</text>
    
    <!-- Score -->
    <text x="556" y="90" font-family="Arial,sans-serif" font-size="48" font-weight="900" fill="#fff" text-anchor="end">${data.wins}</text>
    <text x="570" y="90" font-family="Arial,sans-serif" font-size="48" font-weight="900" fill="#f87171" text-anchor="start">-${data.losses}</text>
    <text x="556" y="112" font-family="Arial,sans-serif" font-size="12" font-weight="700" fill="${gradeColor}" text-anchor="end" letter-spacing="1">${data.grade_label}</text>

    <!-- Divider -->
    <line x1="84" y1="122" x2="556" y2="122" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>

    <!-- Players -->
    ${data.roster.map((r, i) => {
      const name = r.player ? r.player.name : r.name;
      const pos = r.filledAs || r.pos;
      const team = r.player ? r.player.teamShort : r.teamShort;
      const decade = r.player ? r.player.decade : r.decade;
      const ppg = r.player ? r.player.ppg : '';
      const y = 150 + i * 76;
      return `
        <rect x="84" y="${y - 2}" width="32" height="24" rx="4" fill="#2a3a4a"/>
        <text x="100" y="${y + 15}" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#60a5fa" text-anchor="middle">${pos}</text>
        <text x="128" y="${y + 14}" font-family="Arial,sans-serif" font-size="15" font-weight="600" fill="#fff">${name}</text>
        <text x="128" y="${y + 30}" font-family="Arial,sans-serif" font-size="11" fill="#8899aa">${team} · ${decade}</text>
        <text x="552" y="${y + 16}" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#f4a426" text-anchor="end">${ppg}pts</text>
        <line x1="84" y1="${y + 44}" x2="556" y2="${y + 44}" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
      `;
    }).join('')}

    <!-- Footer text -->
    <text x="84" y="565" font-family="Arial,sans-serif" font-size="11" fill="#8899aa">Can you beat this team?</text>
    <text x="556" y="565" font-family="Arial,sans-serif" font-size="11" font-weight="700" fill="#f4a426" text-anchor="end">hooptheory.app</text>

    <!-- Right side CTA -->
    <text x="760" y="200" font-family="Georgia,serif" font-size="52" font-weight="900" fill="#f4a426" text-anchor="middle" letter-spacing="4">HOOP</text>
    <text x="760" y="265" font-family="Georgia,serif" font-size="52" font-weight="900" fill="#f4a426" text-anchor="middle" letter-spacing="4">THEORY</text>
    <text x="760" y="320" font-family="Arial,sans-serif" font-size="16" fill="#4a6a8a" text-anchor="middle" letter-spacing="3">BALANCED ROSTER BUILDER</text>
    <text x="760" y="420" font-family="Arial,sans-serif" font-size="22" fill="#fff" text-anchor="middle">Can you go 82-0?</text>
    <rect x="640" y="450" width="240" height="52" rx="26" fill="#f4a426"/>
    <text x="760" y="483" font-family="Arial,sans-serif" font-size="16" font-weight="800" fill="#000" text-anchor="middle" letter-spacing="2">PLAY FREE</text>
  </svg>`;

  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.status(200).send(svg);
};
