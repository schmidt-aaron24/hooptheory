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

  if (error || !data) return res.status(404).send('Team not found');

  const rosterLines = data.roster.map(r =>
    `${r.filledAs || r.pos}: ${r.player ? r.player.name : r.name} (${r.player ? r.player.teamShort : r.teamShort} · ${r.player ? r.player.decade : r.decade})`
  ).join('\n');

  const title = `${data.wins}-${data.losses} ${data.grade_label} | Hoop Theory`;
  const description = `Can you beat this team? ${data.roster.map(r => r.player ? r.player.name : r.name).join(', ')} | Play free at hooptheory.app`;
  const url = `https://hooptheory.app/share/${id}`;
  const imageUrl = `https://hooptheory.app/api/share-image?id=${id}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:url" content="${url}">
  <meta property="og:type" content="website">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${imageUrl}">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #060d14; color: #fff; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; }
    .card { background: linear-gradient(135deg, #0f1923, #1a2535); border: 1px solid #f4a42640; border-radius: 20px; padding: 28px; max-width: 420px; width: 100%; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .brand { color: #f4a426; font-size: 13px; font-weight: 900; letter-spacing: 3px; font-family: Georgia, serif; }
    .subtitle { color: #4a6a8a; font-size: 9px; letter-spacing: 3px; margin-top: 2px; }
    .score { font-size: 36px; font-weight: 900; line-height: 1; }
    .losses { color: #f87171; }
    .grade-label { font-size: 11px; font-weight: 700; letter-spacing: 1px; margin-top: 4px; }
    .divider { border-top: 1px solid #ffffff15; margin: 16px 0; }
    .player { display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #ffffff08; }
    .pos { background: #2a3a4a; border-radius: 4px; padding: 2px 7px; font-size: 9px; font-weight: 700; color: #60a5fa; margin-right: 8px; }
    .name { font-size: 13px; font-weight: 600; }
    .team { color: #8899aa; font-size: 10px; }
    .footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; font-size: 10px; color: #8899aa; }
    .cta { background: #f4a426; color: #000; font-weight: 800; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 50px; display: inline-block; margin-top: 24px; letter-spacing: 1px; }
    .shared-by { color: #8899aa; font-size: 12px; margin-bottom: 8px; text-align: center; }
  </style>
</head>
<body>
  ${data.username ? `<div class="shared-by">${data.username}'s team</div>` : ''}
  <div class="card">
    <div class="header">
      <div>
        <div class="brand">HOOP THEORY</div>
        <div class="subtitle">BALANCED ROSTER BUILDER</div>
      </div>
      <div style="text-align:right">
        <div class="score">${data.wins}<span class="losses">-${data.losses}</span></div>
        <div class="grade-label" style="color:${data.grade==='S'?'#f4a426':data.grade==='A'?'#4ade80':'#60a5fa'}">${data.grade_label}</div>
      </div>
    </div>
    <div class="divider"></div>
    ${data.roster.map(r => `
      <div class="player">
        <div style="display:flex;align-items:center">
          <span class="pos">${r.filledAs || r.pos}</span>
          <div>
            <div class="name">${r.player ? r.player.name : r.name}</div>
            <div class="team">${r.player ? r.player.teamShort : r.teamShort} · ${r.player ? r.player.decade : r.decade}</div>
          </div>
        </div>
        <div style="text-align:right;color:#f4a426;font-size:12px;font-weight:700">${r.player ? r.player.ppg : ''}pts</div>
      </div>
    `).join('')}
    <div class="footer">
      <span>Can you beat this team?</span>
      <span style="color:#f4a426;font-weight:700">hooptheory.app</span>
    </div>
  </div>
  <a href="https://hooptheory.app" class="cta">PLAY NOW</a>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
};
