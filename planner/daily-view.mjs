import {loadV2} from './scenarios.mjs?v=20261008-daily-plan-1';
export const DAILY_STORAGE_KEY='fukuoka-daily-plan-v3';
export const loadDaily=storage=>loadV2({getItem:()=>storage.getItem(DAILY_STORAGE_KEY)});
export function hourEvents(events,minute){
 const at=Number.isFinite(minute)?minute:events[0]?.start??0;
 const current=events.filter(t=>t.start<=at&&(t.end>at||t.start===t.end&&t.start===at));
 const future=events.filter(t=>t.start>at);const nextStart=future[0]?.start;
 const next=future.filter(t=>t.start===nextStart);
 const shown=new Set([...current,...next]);
 return {at,current,next,earlier:events.filter(t=>!shown.has(t)&&t.start<=at),later:events.filter(t=>!shown.has(t)&&t.start>at)};
}
export function defaultViewTime(day,events,now=new Date()){
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(now);const get=type=>parts.find(p=>p.type===type).value;const today=`${get('year')}-${get('month')}-${get('day')}`;
 if(today===`2026-10-${day}`){const localTime=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Seoul',hour:'2-digit',minute:'2-digit',hour12:false}).format(now);return localTime;}
 const start=events[0]?.start??540;return `${String(Math.floor(start/60)).padStart(2,'0')}:${String(start%60).padStart(2,'0')}`;
}
export function daySpan(events){return {start:Math.min(...events.map(t=>t.start)),end:Math.max(...events.map(t=>t.end))};}

export function inlineGoogle(google={}){
 const escape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
 const rating=google.rating!=null?`<p>★ ${escape(google.rating)} · Google ${Number(google.count).toLocaleString('ko-KR')}개 <span class="fine">${escape(google.scope)} · ${escape(google.checked)}</span></p>`:`<p class="fine">${escape(google.scope||'조건 확인용 대안')} · 단일 점포 평점 미확인</p>`;
 return rating+(google.note?`<p class="fine google-note">${escape(google.note)}</p>`:'');
}
