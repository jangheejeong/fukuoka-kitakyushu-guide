import {mealPolicy,validMealMode} from './meal-policy.mjs?v=20261007-meal-modes-2';
import {locations,stops,presets} from './data.mjs';
export const time=t=>/^([01]\d|2[0-3]):[0-5]\d$/.test(t||'')?Number(t.slice(0,2))*60+Number(t.slice(3)):NaN;
export const clock=n=>`${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`;
export const lookup=id=>[...locations,...stops].find(x=>x.id===id);
// Hand-authored conservative zone links [public transport, taxi/car]. Includes access/wait;
// graph paths sum links. These are planning allowances, never a live route or straight-line estimate.
const links=[['hakata','tenjin',30,20],['tenjin','ohori',25,20],['airport','hakata',45,35],['hakata','ohori',35,25],['ohori','momochi',35,25],['hakata','dazaifu',85,60],['hakata','itoshima',120,75],['hakata','kokura',60,110],['kokura','mojiko',35,40],['mojiko','moji',30,25],['mojiko','karato',45,50],['mojiko','shiranoe',60,35],['kokura','hiraodai',110,60],['kokura','sarakura',75,45]];
export function travel(a,b,mode){
 if(!a||!b||!['transit','walking','driving'].includes(mode))return Infinity;
 if(a.id===b.id)return 0;
 if(a.zone===b.zone)return mode==='walking'?25:mode==='transit'?25:20;
 if(mode==='walking')return Infinity;
 const dist={[a.zone]:0},todo=new Set(links.flatMap(x=>x.slice(0,2)));
 while(todo.size){let z=[...todo].sort((x,y)=>(dist[x]??Infinity)-(dist[y]??Infinity))[0];todo.delete(z);if(!Number.isFinite(dist[z]))break;if(z===b.zone)return dist[z];for(const [x,y,t,d] of links){const n=x===z?y:y===z?x:null;if(n&&todo.has(n))dist[n]=Math.min(dist[n]??Infinity,dist[z]+(mode==='transit'?t:d));}}
 return Infinity;
}
export function normalize(raw){
 const p=Object.hasOwn(presets,raw?.preset)?raw.preset:'08',base=presets[p];
 const state={preset:p,...base,mode:'transit',mealMode:'together',rain:false,stroller:base.party==='family',selected:[],...raw};
 state.preset=p;
 if(!locations.some(x=>x.id===state.origin)||!locations.some(x=>x.id===state.destination)||!Number.isFinite(time(state.departure))||!Number.isFinite(time(state.deadline))||!['transit','walking','driving'].includes(state.mode)||!['couple','family'].includes(state.party)||state.date!==base.date||!validMealMode(state.mealMode))return null;
 state.selected=Array.isArray(raw?.selected)?[...new Set(raw.selected.filter(x=>typeof x==='string'&&stops.some(s=>s.id===x)))].slice(0,20):[];
 state.rain=state.rain===true;state.stroller=state.stroller===true;
 if(p==='12')state.destination='airport';
 if(p==='09')state.destination='hakata';
 if(p==='09family')state.destination='hotel';
 return state;
}
export function limits(s){
 let start=time(s.departure),end=time(s.deadline);
 if(s.preset==='08'&&s.origin==='airport')start=Math.max(start,910);
 if(s.preset==='09family'&&s.origin==='airport')start=Math.max(start,1185);
 if(s.preset==='09')end=Math.min(end,1080);
 if(s.preset==='09family'||s.preset==='08'&&s.destination==='hotel')end=Math.min(end,1320);
 if(s.preset==='12')end=Math.min(end,900);
 return {start,end};
}
const buffer=s=>s.party==='family'?25:15;
function diningNear(s,stop,from,policy){
 if(stop.zone===from.zone||from.zone==='moji'&&stop.zone==='mojiko')return true;
 if(policy!=='corridor')return false;
 const dest=lookup(s.destination);
 if(stop.zone===dest.zone)return true;
 const zoneLeg=(a,b)=>a.zone===b.zone?0:travel(a,b,s.mode);
 const direct=zoneLeg(from,dest),via=zoneLeg(from,stop)+zoneLeg(stop,dest);
 return Number.isFinite(direct)&&via<=direct;
}
export function assess(s,stop,from,at,end,nearby=false){
 const incoming=travel(from,stop,s.mode),outgoing=travel(stop,lookup(s.destination),s.mode);
 let win=stop.id==='market'&&['2026-10-11','2026-10-12'].includes(s.date)?[420,900]:stop.window;
 const isMeal=stop.kind==='restaurant'||stop.id==='market';const policy=isMeal?mealPolicy({family:s.party==='family',mode:s.mealMode,duration:stop.stay,facility:stop.facility,market:stop.id==='market'}):null;const stay=policy?.stay??stop.stay,queue=policy?.queue??0;
 const arrival=at+incoming;
 if(stop.windows)win=stop.windows.find(w=>arrival<=w[1]&&Math.max(arrival,w[0])+queue+stay<=w[1])||stop.windows[stop.windows.length-1];
 const visit=Math.max(arrival,win[0])+queue,finish=visit+stay+buffer(s),eta=finish+outgoing;
 const lastOrder=visit+(policy?(policy.rounds-1)*(policy.roundDuration+policy.roundQueue)+policy.exchange:0);
 let reason=stop.excluded||'';
 if(!reason&&s.rain&&stop.outdoor)reason='비 오는 날 야외 코스 제외';
 if(!reason&&s.stroller&&!stop.stroller)reason='유모차 동선 어려움 · 아기띠 전환 필요';
 if(!reason&&nearby&&!diningNear(s,stop,from,nearby))reason='현재 마지막 장소와 다른 지역';
 if(!reason&&!Number.isFinite(incoming+outgoing))reason='도보만으로 이동하기 어려운 지역 간 경로';
 if(!reason&&(finish-buffer(s)>win[1]||stop.id==='railway'&&visit>990||stop.lastLunchOrder&&lastOrder<1020&&lastOrder>stop.lastLunchOrder))reason='보수적인 방문 계획 범위 밖 · 실제 영업 확인 필요';
 if(!reason&&eta>end)reason=`목적지 마감 초과 ${Math.ceil(eta-end)}분`;
 return {stop,stay,queue,policy,incoming,outgoing,arrival,visit,finish,eta,remaining:end-eta,buffer:buffer(s),wait:visit-arrival,reason,feasible:!reason};
}
export function plan(raw){
 const s=normalize(raw);if(!s)return {error:'출발지·목적지와 시간을 올바르게 입력해주세요.'};
 const {start,end}=limits(s);
 if(s.preset==='10'&&s.origin==='hotel'&&start>600)return {error:'GRAND BASE는 10시 체크아웃입니다. 숙소에서 출발은 10시까지로 설정하거나 실제 현재 출발지를 선택하세요.',state:s};
 if(s.preset==='12'&&s.origin==='kf1'&&start>660)return {error:'KF1은 11시 체크아웃 후 짐 보관 불가입니다. 11시까지 출발하거나 실제 현재 출발지를 선택하세요.',state:s};
 if(start>=end)return {error:'출발 시간은 도착 마감보다 빨라야 합니다.',state:s};
 let from=lookup(s.origin),at=start,hasTourist=false;const timeline=[],removed=[];
 for(const id of s.selected){const r=assess(s,lookup(id),from,at,end,lookup(id).kind==='restaurant'?(hasTourist?true:'corridor'):false);if(r.feasible){timeline.push(r);from=r.stop;at=r.finish;if(r.stop.kind==='attraction')hasTourist=true;}else removed.push({id,reason:r.reason});}
 s.selected=timeline.map(r=>r.stop.id);
 const direct=travel(from,lookup(s.destination),s.mode),eta=at+direct;
 const choices=stops.filter(x=>!s.selected.includes(x.id)).map(x=>assess(s,x,from,at,end,x.kind==='restaurant'?(hasTourist?true:'corridor'):false));
 return {state:s,start,end,timeline,removed,from,at,eta,direct,hasTourist,remaining:end-eta,choices,error:eta>end?'현재 이동만으로 도착 마감을 지킬 수 없습니다. 출발 시간을 앞당기거나 이동 방식을 변경하세요.':null};
}
export function readSaved(storage){try{const raw=JSON.parse(storage.getItem('fukuoka-planner-v1'));return normalize(raw||{})||normalize({});}catch{return normalize({});}}
export function saveState(storage,s){try{storage.setItem('fukuoka-planner-v1',JSON.stringify(s));return true;}catch{return false;}}
export const maps=p=>`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.query)}`;
export const route=(a,b,mode)=>`https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(a.query)}&destination=${encodeURIComponent(b.query)}&travelmode=${mode}`;
