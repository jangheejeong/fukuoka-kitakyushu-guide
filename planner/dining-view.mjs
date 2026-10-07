const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function diningContent(details={}){
 const photos=Array.isArray(details.photos)?details.photos:[];
 const photoHTML=photos.length?`<div class="dining-photos">${photos.map(p=>`<figure><img src="${esc(p.url)}" alt="${esc(p.alt)}" loading="lazy"><figcaption>${esc(p.alt)} · ${esc(p.credit)} <a href="${esc(p.source)}" target="_blank" rel="noopener">사진 원본·출처</a></figcaption></figure>`).join('')}</div>`:'<p class="photo-unavailable">'+esc(details.unavailableReason||'실제 장소 사진 확인 중 · 검증된 사진 자료가 아직 없습니다.')+'</p>';
 const google=details.google||{},count=Number(String(google.count??'').replaceAll(',','')),hasCount=google.count!==null&&google.count!==undefined&&Number.isFinite(count),rating=google.rating!==null&&google.rating!==undefined&&Number.isFinite(Number(google.rating));
 const score=rating?`<b>★ ${esc(google.rating)}</b><span>Google 리뷰 ${hasCount?count.toLocaleString('ko-KR')+'개':'수 미확인'}</span>`:'<b>Google 평점 없음</b><span>'+esc(google.scope==='지역 검색'?'지역 검색은 한 식당의 평점이 아닙니다.':'확인된 Google 평점 자료가 없습니다.')+'</span>';
 const googleHTML=`<div class="dining-rating">${score}<small>${esc(google.scope||'확인 중')} · ${google.checked?esc(google.checked)+' 확인':'확인 자료 없음'}</small>${google.note?'<p>'+esc(google.note)+'</p>':''}${google.url?`<a href="${esc(google.url)}" target="_blank" rel="noopener">해당 장소 Google 평점·후기 ↗</a>`:''}</div>`;
 const menu=details.menu||{};
 const menuHTML=`<div class="dining-menu"><h4>${esc(menu.name||'대표 메뉴 확인 중')}</h4>${Array.isArray(menu.items)&&menu.items.length?'<ul>'+menu.items.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'<p class="fine">확인된 메뉴 자료가 아직 없습니다.</p>'}<p class="fine">${esc(menu.basis||'공식·후기 근거 확인 전입니다.')} ${menu.source?`<a href="${esc(menu.source)}" target="_blank" rel="noopener">메뉴 근거</a>`:''}</p></div>`;
 const review=details.review||{};
 const reviews=(review.good?.length||review.caution?.length)?`<div class="dining-review">${review.good?.length?'<p><b>좋다는 후기</b> · '+review.good.map(esc).join(' · ')+'</p>':''}${review.caution?.length?'<p><b>확인할 점</b> · '+review.caution.map(esc).join(' · ')+'</p>':''}<p class="fine">${esc(review.basis||'일부 후기 표본입니다.')}</p></div>`:'';
 return {photoHTML,googleHTML,menuHTML,reviews};
}
