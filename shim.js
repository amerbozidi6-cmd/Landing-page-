// يستبدل خدمات منصة Claude بخدمات حقيقية عبر /api (Vercel + Supabase)
(()=>{
const call=async(url,o={})=>{
  const r=await fetch(url,{...o,headers:{'content-type':'application/json','x-admin':localStorage.getItem('adm')||''}});
  if(r.status===401){const k=prompt('مفتاح المدير (ADMIN_KEY)');if(k){localStorage.setItem('adm',k);return call(url,o)}throw{code:'not_granted'}}
  if(!r.ok)throw{code:'unavailable',message:'HTTP '+r.status};
  return r.json();
};
const api=(m,q,b)=>call('/api/db?'+new URLSearchParams(q),{method:m,body:b?JSON.stringify(b):undefined});
const doc=p=>{const[c,id]=p.split('/');return{
  get:async()=>{try{const d=await api('GET',{c,id});return{id,exists:true,data:()=>d}}catch{return{id,exists:false,data:()=>undefined}}},
  set:d=>api('PUT',{c,id},d),update:d=>api('PATCH',{c,id},d),delete:()=>api('DELETE',{c,id})}};
const collection=c=>({orderBy(f){return{onSnapshot(next,err){
  const run=async()=>{try{const rows=await api('GET',{c});
    const d=rows.map(x=>({id:x.id,data:()=>x.data})).sort((a,b)=>(b.data()[f]||0)-(a.data()[f]||0));
    next({docs:d,empty:!d.length,size:d.length})}catch(e){err&&err(e)}};
  run();const t=setInterval(run,8000);return()=>clearInterval(t)}}}});
const smp=async i=>call('/api/ai',{method:'POST',body:JSON.stringify({prompt:typeof i==='string'?i:i.map(m=>m.content).join('\n')})});
smp.json=async i=>JSON.parse((await smp(i)).text.replace(/```json|```/g,'').trim());
smp.limits=async()=>({images:false});
const save=async({filename,data})=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([data],{type:'text/html'}));a.download=filename;a.click()};
window.claude={use:async n=>({sample:smp,db:{doc,collection},downloads:{save}})[n]||null};
})();
