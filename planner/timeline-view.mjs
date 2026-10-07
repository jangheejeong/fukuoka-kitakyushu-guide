import {transportGuide} from './transport.mjs?v=20261007-timeline-map-1';
import {maps} from './engine.mjs?v=20261007-timeline-map-1';
export function detailedTimeline(result){return result.timeline.map(t=>({...t,guide:t.from&&!t.flight?transportGuide(t.from,t.to,result.conditions.mode):null}));}
export function timelinePins(events){
 const pins=[],last=new Map();let order=0;
 const add=(p,event,at,transfer=false)=>{
  if(!p?.query)return;
  const stream=event.stream||'일행';
  if(!transfer&&last.get(stream)===p.id)return;
  pins.push({...p,at,stream,transfer,order:order++,event:event.name,range:transfer?[event.start,event.end]:null,url:maps(p)});
  if(!transfer)last.set(stream,p.id);
 };
 for(const event of events){
  if(event.from){add(event.from,event,event.start);for(const p of event.guide?.waypoints||[])if(p.id!==event.from.id&&p.id!==event.to.id)add(p,event,event.start,true);add(event.to,event,event.end);}
  else if(event.place)add(event.place,event,event.start);
 }
 return pins.sort((a,b)=>a.at-b.at||a.order-b.order).map((p,i)=>({...p,number:i+1}));
}
export const embedMap=p=>`https://maps.google.com/maps?q=${encodeURIComponent(p.query)}&output=embed`;
