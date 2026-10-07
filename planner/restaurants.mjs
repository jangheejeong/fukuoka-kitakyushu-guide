import {restaurants,attractions,zones} from './data.mjs';
import {evidenceHTML} from './evidence.mjs';
import {maps} from './engine.mjs';
const select=document.getElementById('zone'),root=document.getElementById('dining');
const used=[...new Set(restaurants.map(x=>x.zone))];select.innerHTML+=used.map(z=>`<option value="${z}">${zones[z]}</option>`).join('');
const requested=new URLSearchParams(location.search).get('zone');if(used.includes(requested))select.value=requested;
function render(){root.innerHTML=restaurants.filter(r=>select.value==='all'||r.zone===select.value).map(r=>`<article class="card"><span class="fine">${zones[r.zone]} · ${r.facility?'시설·검색 선택지':'개별 식당'}</span><h3>${r.name}</h3><p><b>${r.cuisine}</b></p><p>근처 관광: ${attractions.filter(a=>a.zone===r.zone&&!a.excluded).map(a=>a.name).join(' · ')||'텐진·다이묘 거리'}</p><p>${r.note}</p><div class="links"><a href="${maps(r)}" target="_blank" rel="noopener">지도·주변 검색</a><a href="${r.source}" target="_blank" rel="noopener">공식 안내</a></div><a href="manual.html?zone=${r.zone}">직접 조합 플래너에서 이 지역 보기 →</a>${evidenceHTML([r.id])}</article>`).join('');}
select.addEventListener('change',render);render();
