module.exports=async(req,res)=>{
  if(req.headers['x-admin']!==process.env.ADMIN_KEY)return res.status(401).end();
  const r=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',
    headers:{'x-api-key':process.env.ANTHROPIC_API_KEY,'anthropic-version':'2023-06-01','content-type':'application/json'},
    body:JSON.stringify({model:process.env.CLAUDE_MODEL||'claude-sonnet-4-6',max_tokens:2000,messages:[{role:'user',content:String(req.body.prompt||'')}]})});
  const j=await r.json();
  if(!r.ok)return res.status(502).json(j);
  res.json({text:j.content.map(c=>c.text||'').join('')});
};
