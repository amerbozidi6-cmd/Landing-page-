const U=process.env.SUPABASE_URL+'/rest/v1/docs';
const H={apikey:process.env.SUPABASE_SERVICE_KEY,Authorization:'Bearer '+process.env.SUPABASE_SERVICE_KEY,'content-type':'application/json'};
const up=(c,id,data,ignore)=>fetch(U+'?on_conflict=col,id',{method:'POST',
  headers:{...H,Prefer:(ignore?'resolution=ignore-duplicates':'resolution=merge-duplicates')+',return=minimal'},body:JSON.stringify({col:c,id,data})});
module.exports=async(req,res)=>{
  const{c,id}=req.query,m=req.method,adm=req.headers['x-admin']===process.env.ADMIN_KEY;
  if(!['pages','orders'].includes(c))return res.status(400).end();
  const q=`?col=eq.${c}`+(id?`&id=eq.${encodeURIComponent(id)}`:'');
  if(m==='GET'){
    if(!adm&&!(c==='pages'&&id))return res.status(401).end();
    const rows=await(await fetch(U+q+'&select=id,data',{headers:H})).json();
    if(!id)return res.json(rows);
    if(!rows[0]||(!adm&&rows[0].data.status!=='published'))return res.status(404).end();
    return res.json(rows[0].data);
  }
  if(m==='PUT'){
    if(adm)return (await up(c,id,req.body)).ok?res.json({ok:1}):res.status(500).end();
    if(c!=='orders')return res.status(401).end();
    const d=req.body||{},s=(v,n)=>String(v||'').slice(0,n);
    if(s(d.name,100).trim().length<3||!/^(\+|00)?\d{8,14}$/.test(s(d.phone,20).replace(/[\s.-]/g,''))||!s(d.wilaya,60).trim())return res.status(400).end();
    const r=await up('orders',id,{name:s(d.name,100),phone:s(d.phone,20),wilaya:s(d.wilaya,60),commune:s(d.commune,200),option:s(d.option,100),qty:Math.max(1,+d.qty||1),pageId:s(d.pageId,40),pageName:s(d.pageName,200),status:'new',created:Date.now()},true);
    return r.ok?res.json({ok:1}):res.status(500).end();
  }
  if(!adm)return res.status(401).end();
  if(m==='PATCH'){
    const rows=await(await fetch(U+q+'&select=data',{headers:H})).json();
    if(!rows[0])return res.status(404).end();
    await up(c,id,{...rows[0].data,...req.body});return res.json({ok:1});
  }
  if(m==='DELETE'){await fetch(U+q,{method:'DELETE',headers:H});return res.json({ok:1})}
  res.status(405).end();
};
