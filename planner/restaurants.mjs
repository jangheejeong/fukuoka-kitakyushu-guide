let DINING_DETAILS={};let researchAvailable=true;
try{({DINING_DETAILS}=await import('./dining-details.mjs?v=20261008-daily-plan-1'));}catch{researchAvailable=false;}
import {diningContent} from './dining-view.mjs?v=20261008-daily-plan-1';
import {restaurants,attractions,zones} from './data.mjs?v=20261008-daily-plan-1';
import {evidenceHTML} from './evidence.mjs?v=20261008-daily-plan-1';
import {maps} from './engine.mjs?v=20261008-daily-plan-1';
const select=document.getElementById('zone'),root=document.getElementById('dining');
const used=[...new Set(restaurants.map(x=>x.zone))];select.innerHTML+=used.map(z=>`<option value="${z}">${zones[z]}</option>`).join('');
const requested=new URLSearchParams(location.search).get('zone');if(used.includes(requested))select.value=requested;
function render(){root.innerHTML=restaurants.filter(r=>select.value==='all'||r.zone===select.value).map(r=>{const d=diningContent(DINING_DETAILS[r.id]||(!researchAvailable?{unavailableReason:'사진·메뉴 조사 자료를 불러오지 못했습니다. 새로고침하거나 공식 출처에서 확인하세요.',google:{note:'조사 자료 로딩 실패 · 평점이나 메뉴를 추정하지 않습니다.'}}:undefined));return `<article class="card dining-card">${d.photoHTML}<div class="dining-body"><span class="fine">${zones[r.zone]} · ${r.facility?'시설·검색 선택지':'개별 식당'}</span><h3>${r.name}</h3>${d.googleHTML}${d.menuHTML}<p>근처 관광: ${attractions.filter(a=>a.zone===r.zone&&!a.excluded).map(a=>a.name).join(' · ')||'텐진·다이묘 거리'}</p><p>${r.note}</p>${d.reviews}<div class="links"><a href="${maps(r)}" target="_blank" rel="noopener">지도·주변 검색</a><a href="${r.source}" target="_blank" rel="noopener">공식 안내</a></div><a href="manual.html?zone=${r.zone}">직접 조합 플래너에서 이 지역 보기 →</a>${evidenceHTML([r.id])}</div></article>`;}).join('');}
select.addEventListener('change',render);render();
