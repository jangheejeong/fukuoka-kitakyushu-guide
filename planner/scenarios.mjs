import {mealPolicy,validMealMode} from './meal-policy.mjs?v=20261007-meal-modes-2';
import {lookup,travel,clock,maps} from './engine.mjs?v=20261007-meal-modes-2';
import {restaurants} from './data.mjs';
export const DAYS=['08','09','10','11','12'];
export const DAYINFO={
 '08':{title:'후쿠오카 첫날',subtitle:'공항 → 숙소 체크인 → 가벼운 저녁 산책',party:'부부',note:'13:40 도착 · 입국·수하물 90분. GRAND BASE 체크인 후 관광하며 21시 숙소 복귀 목표.'},
 '09':{title:'바다와 공원, 저녁에는 가족 합류',subtitle:'부부의 낮 일정 + 가족의 입국을 따로 계산',party:'부부 → 가족·유모차',note:'낮 일정은 18시 하카타 복귀. 가족 18:30 도착 → 입국 75분 → 19:45 공항 출발 → 체크인 21시 완료. 한계 22시.'},
 '10':{title:'짐을 맡기고, 항구 동네로',subtitle:'하카타 체크아웃 → KF1 이동 → 모지코',party:'가족·유모차',note:'GRAND BASE 10시 체크아웃. KF1 13시 짐 맡기기 가능이라는 숙소 안내를 기준으로 계획. 체크인은 16시부터이며 늦게 도착해도 되는 시작 시각입니다.'},
 '11':{title:'모지코와 간몬해협',subtitle:'항구·시장·철도 중 우리 가족에게 맞는 하루',party:'가족·유모차',note:'KF1에서 출발·복귀. 가라토 일요일 시장은 식사까지 포함하는 코스입니다. 페리 운항·시장 개최는 당일 공식 안내 확인.'},
 '12':{title:'점심 한 끼, 공항은 여유 있게',subtitle:'KF1 출발 → 하카타 점심 → 국제선',party:'가족·유모차',note:'10시 출발 권장. KF1 11시 체크아웃 후 짐 보관 불가. 국제선 15시 도착 필수 · 18시 출발 → 인천 19:45 도착 예정.'}
};
const course=(id,title,why,steps,mealIds=[],extra={})=>({id,title,why,steps,mealIds,...extra});
const stop=(id,duration)=>({id,duration});
export const COURSES={
 '08':[
 course('park','오호리 짧은 산책 + 하카타 저녁','첫날에는 호수 풍경을 짧게 보고 숙소 가까이 돌아와 식사합니다.',[stop('ohoripark',40),{meal:true}],['unagi','hanamidori','motsu'],{outdoor:true}),
 course('oldtown','구시다·옛 거리 + 하카타 저녁','이동을 줄이고 후쿠오카다운 거리와 대표 음식을 천천히 즐깁니다.',[stop('kushida',40),{meal:true}],['unagi','hanamidori','motsu'],{outdoor:true}),
 course('canal','캐널시티 + 가까운 식사','비가 오거나 피곤할 때 실내에서 쉬고 첫날을 일찍 마칩니다.',[stop('canal',40),{meal:true}],['canaldining','hakatadining'],{rain:true,relaxed:true})],
 '09':[
 course('sea','오호리 → 점심 → 모모치 해변','호수와 바다를 함께 보는 평탄한 산책. 자연 풍경을 좋아하는 두 분에게 첫 추천입니다.',[stop('ohoripark',70),{meal:true},stop('momochibeach',60)],['royalcafe','ohoridining'],{outdoor:true}),
 course('dazaifu','다자이후 참배길 + 박물관','작은 거리·정원과 실내 전시를 함께 봅니다. 이동이 길어 피곤하면 공원 코스가 편합니다.',[stop('dazaifutemple',75),{meal:true},stop('museum',70)],['shizenan','dazaifudining'],{outdoor:true}),
 course('rain','캐널시티 + 하카타 점심','우천에는 실내 쇼핑·휴식과 미즈타키 등 하카타 식사에 집중합니다.',[stop('canal',70),{meal:true}],['hanamidori','canaldining','unagi'],{rain:true,relaxed:true})],
 '10':[
 course('harbor','짐 맡기기 → 항구 산책 → 모지코 식사','짐은 숙소에 맡기고 유모차로 항구 동네를 둘러봅니다. 체크인은 산책 후 16시 이후에 합니다.',[stop('retro',55),{meal:true}],['curry','bearfruits'],{drop:true,outdoor:true}),
 course('rail','짐 맡기기 → 철도기념관 → 모지코 식사','비 오는 날은 항구 산책을 실내 철도 전시로 바꿉니다.',[stop('railway',55),{meal:true}],['curry','bearfruits'],{drop:true,rain:true}),
 course('kokura','고쿠라 공원 + 점심 → KF1','기타큐슈 대표 도심을 먼저 봅니다. 체크인 전까지 짐을 직접 가지고 이동해야 합니다.',[stop('castle',55),{meal:true}],['riverwalk','katsu'],{carry:true,outdoor:true})],
 '11':[
 course('karato','바다 건너 가라토시장 + 모지코','시장 혼잡이 괜찮을 때 추천합니다. 작은 항구와 바다를 함께 보고 시장 체류에 점심을 포함합니다. 가족 동석 보장은 없으며 혼잡하면 아기띠를 보조로 사용합니다.',[stop('market',80),stop('retro',55)],[],{outdoor:true,marketMeal:true}),
 course('museum','철도기념관 + 야키카레 + 항구','유모차로 이동하기 편한 모지코 안에서 관광과 대표 식사를 묶었습니다.',[stop('railway',60),{meal:true},stop('retro',45)],['curry','bearfruits'],{outdoor:true}),
 course('indoor','철도기념관 + 야키카레 + 해협박물관','비가 오면 실내 두 곳을 천천히 보고 가까운 곳에서 식사합니다.',[stop('railway',60),{meal:true},stop('kanmonmuseum',60)],['curry','bearfruits'],{rain:true,relaxed:true}),
 course('kokura','고쿠라 공원 + 점심 + 탄가시장','도심 공원과 시장을 보는 대안. 장거리 이동을 줄이고 싶다면 모지코 코스를 권합니다.',[stop('castle',60),{meal:true},stop('tanga',40)],['riverwalk','katsu'],{outdoor:true})],
 '12':[
 course('lunch','하카타에서 점심 → 국제선','관광 욕심을 줄이고 점심과 공항 도착 여유를 확보합니다. 짐을 가지고 이동합니다.',[{meal:true}],['hakatadining','hanamidori','unagi'],{returnMeal:true,relaxed:true}),
 course('light','하카타에서 가벼운 식사 → 공항','짧게 먹고 공항에서 쉬는 선택입니다. 시설 안에서 대기가 짧은 점포를 골라주세요.',[{meal:true,duration:45}],['hakatadining'],{returnMeal:true,relaxed:true}),
 course('early','09시 조기 출발 · 고쿠라 짧은 산책','일찍 나갈 준비가 끝났을 때만 가능한 대안. 공항 여유가 적어 기본 점심 코스를 더 권합니다.',[stop('castle',35),{meal:true,duration:45}],['riverwalk'],{early:true,outdoor:true})]
};
const queries={shizenan:'梅の花 太宰府別荘自然庵',royalcafe:'ロイヤルガーデンカフェ 大濠公園',ohoripark:'Ohori Park Fukuoka',kushida:'Kushida Shrine Fukuoka',canal:'Canal City Hakata',momochibeach:'Seaside Momochi Beach Park',dazaifutemple:'Dazaifu Tenmangu',museum:'Kyushu National Museum Dazaifu',retro:'Mojiko Retro',railway:'Kyushu Railway History Museum',castle:'Kokura Castle Katsuyama Park',tanga:'Tanga Market Kokura',market:'Karato Market Shimonoseki',unagi:'吉塚うなぎ屋',hanamidori:'博多華味鳥 博多駅前店',motsu:'楽天地 博多駅前店',curry:'伽哩本舗 門司港レトロ店',bearfruits:'BEAR FRUITS 門司港',katsu:'牛カツ京都勝牛 小倉駅前店',riverwalk:'Riverwalk Kitakyushu restaurants',ohoridining:'restaurants near Ohori Park',dazaifudining:'restaurants near Dazaifu Tenmangu',hakatadining:'JR Hakata City restaurants',canaldining:'Canal City Hakata restaurants'};
export const resolve=id=>id==='kanmonmuseum'?{id,name:'간몬해협 박물관',zone:'mojiko',query:'Kanmon Strait Museum Mojiko',window:[540,1020],source:'https://www.crossroadfukuoka.jp/spot/13211',note:'휴관·영업 확인 필요'}:{...lookup(id),query:queries[id]||lookup(id)?.query};
export const locationMap=id=>maps(resolve(id));
export function defaultConditions(){return {rain:false,relaxed:false,mode:'transit',delay:0,mealWait:0,mealMode:'together'};}
export function conditionInput(field,value){if(field==='rain'||field==='relaxed')return value===true;if(field==='delay'||field==='mealWait')return Math.max(0,Math.min(field==='delay'?180:120,Number(value)||0));if(field==='mealMode')return validMealMode(value)?value:'together';return value;}
const BUFFER=day=>['08','09'].includes(day)?15:25;
export function evaluate(day,course,conditions={},mealId){
 const c={...defaultConditions(),...conditions};
 const timeline=[];let at=0,from=null;const problems=[];
 const add=(name,start,end,mandatory,extra={})=>timeline.push({name,start,end,mandatory,...extra});
 const anchored=(name,start,end,extra={})=>{if(at>start)problems.push(`${name} 시작 ${clock(start)} 전에 도착할 수 없음`);add(name,start,end,true,extra);at=end;};
 const move=(id,mandatory=false,min=0)=>{const target=resolve(id);if(from&&from.id!==id){const n=Math.max(min,travel(from,target,c.mode));add(`${from.name} → ${target.name}`,at,at+n,mandatory,{travel:n,from,to:target});at+=n;}from=target;};
 const meal=course?.mealIds?.includes(mealId)?mealId:course?.mealIds?.[0];
 if(course?.outdoor&&c.rain)problems.push('우천에는 야외 코스를 추천하지 않음');
 if(c.delay<0||c.delay>180||!Number.isFinite(c.delay)||!['transit','driving'].includes(c.mode)||!validMealMode(c.mealMode))problems.push('지연·이동 조건을 확인해주세요');
 if(day==='08'){
  anchored('인천 출발 → 후쿠오카 도착',735,820,{detail:'12:15 → 13:40 예정 · 부부'});
  anchored('후쿠오카 국제선 도착',820,820,{detail:'도착 예정 13:40 · 부부'});
  anchored('입국·수하물 여유',820,910,{detail:'90분 확보'});from=resolve('airport');
  move('hotel',true,45);anchored('GRAND BASE 체크인',at,at+30,{place:from,detail:'관광 전에 숙소에 들어가 짐을 둡니다.'});
 }else if(day==='09'){at=540;from=resolve('hotel');add('GRAND BASE에서 출발',at,at,true,{place:from,detail:'부부 낮 일정'});
 }else if(day==='10'){
  anchored('GRAND BASE 체크아웃',600,600,{place:resolve('hotel')});from=resolve('hotel');
  if(course?.carry){move('kokura',true);}else{move('kf1',true);if(at<780){add('짐 맡기기 가능 시각까지 대기',at,780,true);at=780;}anchored('KF1 짐 맡기기',at,at+15,{place:from,detail:'숙소 안내: 13시부터 가능. 실제 맡길 수 있는지 재확인.'});}
 }else if(day==='11'){at=540;from=resolve('kf1');add('KF1에서 출발',at,at,true,{place:from});
 }else{at=course?.early?540:600;from=resolve('kf1');add('KF1 체크아웃·짐 동반 출발',at,at,true,{place:from,detail:'11시 이후 숙소 짐 보관 불가'});}
 if(c.delay){add(day==='08'?'체크인 후 관광 시작 지연':'출발 준비·추가 휴식',at,at+c.delay,true);at+=c.delay;}
 if(day==='12'&&!course?.early)move(meal||'hakata',true);
 for(const step of course?.steps||[]){const id=step.meal?meal:step.id;if(!id)continue;const p=resolve(id);if(!p){problems.push('장소 데이터 없음');continue;}
  move(id);let win=id==='kushida'&&day==='08'?[540,1080]:p.window||[540,1020];
  if(p.windows){win=p.windows.find(w=>at<=w[1]&&at+(step.duration||p.stay||70)<=w[1])||p.windows[p.windows.length-1];}
  const open=id==='market'&&day==='11'?420:win[0];if(at<open){add('방문·영업 시작까지 대기',at,open,false);at=open;}
  const family=['10','11','12'].includes(day);
  const isMeal=!!step.meal||id==='market';
  const policy=isMeal?mealPolicy({family,mode:c.mealMode,duration:step.duration||p.stay||70,facility:p.facility,market:id==='market',extraWait:c.mealWait}):null;
  const duration=policy?.total??(step.duration||p.stay||70);
  const orderStart=at+(policy?policy.roundQueue+(policy.rounds-1)*(policy.roundDuration+policy.roundQueue)+policy.exchange:0);
  if(at+duration>win[1]||id==='railway'&&at>990||p.lastLunchOrder&&orderStart<1020&&orderStart>p.lastLunchOrder)problems.push(`${p.name}: 방문·영업 계획 범위 밖 · 영업 확인 필요`);
  if(policy){
   for(const segment of policy.segments){
    if(segment.kind==='queue'){add(id==='market'?'시장 대기·자리 확보 가정':family?'가족 단체 식당 대기 가정':'추가 식당 대기 가정',at,at+segment.duration,false,{detail:`${policy.rounds===2?'팀 '+segment.round+' · ':''}${segment.duration}분 계획 가정 · 자리·대기 보장 없음`});}
    else if(segment.kind==='exchange'){add('유아·짐 돌봄 교대',at,at+segment.duration,false,{detail:'두 팀이 순서대로 식사 · 모두 끝나야 다음 이동'});}
    else{add(p.name+(id==='market'?' · 점심 포함':'')+(policy.rounds===2?' · 팀 '+segment.round:''),at,at+segment.duration,false,{place:p,meal:!!step.meal,mealPolicy:policy,detail:(p.cuisine||p.note||'식사')+' · '+policy.explanation});}
    at+=segment.duration;
   }
  }else{add(p.name,at,at+duration,false,{place:p,meal:false,detail:p.note});at+=duration;}
  add('이동 준비·휴식 여유',at,at+BUFFER(day),false);at+=BUFFER(day);
 }
 if(day==='08'){move('hotel',true);if(at>1260)problems.push('21시 숙소 복귀 목표 초과');add('GRAND BASE 복귀',at,at,true,{place:from});
 }else if(day==='09'){
  move('hakata',true);if(at>1080)problems.push('18시 하카타 복귀 마감 초과');else{add('하카타 복귀 후 휴식',at,1080,true);at=1080;}
  move('hotel',true);timeline[timeline.length-1].stream='부부';
  const coupleArrival=at;
  if(at<1230)add('숙소에서 가족 합류까지 휴식',at,1230,true,{stream:'부부'});
  add('가족: 인천 출발 → 후쿠오카 도착',1020,1110,true,{stream:'가족',parallel:true,detail:'17:00 → 18:30 예정'});
  add('가족 국제선 도착',1110,1110,true,{stream:'가족',parallel:true,detail:'18:30 도착 예정 · 부부는 숙소에서 휴식합니다.'});
  add('가족 입국·수하물',1110,1185,true,{stream:'가족',parallel:true,detail:'75분 확보'});
  const familyLeg=Math.max(45,travel(resolve('airport'),resolve('hotel'),c.mode));
  add('가족: 공항 → GRAND BASE',1185,1185+familyLeg,true,{stream:'가족',parallel:true,travel:familyLeg,from:resolve('airport'),to:resolve('hotel')});
  at=Math.max(coupleArrival,1185+familyLeg);
  add('가족 합류 후 GRAND BASE 체크인',at,at+30,true,{stream:'함께',place:resolve('hotel')});at+=30;
  if(at>1320)problems.push('22시 체크인 한계 초과');
  add('체크인 후 필요하면 근처 저녁·간식',at,at,false,{conditional:true,detail:'21시 이후 영업·주문 마감 확인 필요. 늦은 저녁은 확정하지 않았습니다.'});
 }else if(day==='10'){move('kf1',true);if(at<960){add('체크인 시작까지 휴식·대기',at,960,true);at=960;}add('KF1 체크인',at,at+30,true,{place:from,detail:'16시부터 가능 · 도착 마감이 아닙니다.'});at+=30;if(at>1200)problems.push('20시 이후 체크인 계획 · 숙소 확인 필요');
 }else if(day==='11'){move('kf1',true);add('KF1 복귀',at,at,true,{place:from});if(at>1080)problems.push('18시 숙소 복귀 목표 초과');
 }else{
  move('airport',true);add('국제선 터미널 도착',at,at,true,{place:from,detail:'15시까지 도착 필수'});if(at>900)problems.push('국제선 15시 도착 마감 초과');
  if(at<=1080){add('출국 수속·공항 휴식',at,1080,true,{detail:course?.id==='direct'?'식사는 도착 후 공항 식당가에서 영업·혼잡 확인. 관광 대신 출국 준비를 우선합니다.':'18시 출발 준비'});}
  add('후쿠오카 출발 → 인천 도착',1080,1185,true,{detail:'18:00 → 19:45 예정'});
 }
 if(day==='09'){for(const event of timeline)if(!event.stream)event.stream=event.start<1080?'부부':'함께';timeline.sort((a,b)=>a.start-b.start);}
 return {day,course,meal,timeline,feasible:problems.length===0,problems,finish:day==='12'?timeline.find(t=>t.name==='국제선 터미널 도착').start:at,conditions:c};
}
export function cases(day,conditions){return COURSES[day].filter(c=>day!=='11'||(c.id!=='indoor'&&c.id!=='museum')||c.id===(conditions?.rain||conditions?.relaxed?'indoor':'museum')).map(c=>evaluate(day,c,conditions));}
export function fallback(day,conditions){return evaluate(day,{id:'direct',title:day==='12'?'바로 공항으로 · 도착 후 식사':'이동·체크인과 휴식만',why:'필수 이동을 먼저 지키고 관광을 쉬는 가장 가벼운 기본안입니다.',steps:[],mealIds:[]},conditions);}
export function recommend(day,conditions){const all=cases(day,conditions);const feasible=all.filter(x=>x.feasible&&(day!=='12'||900-x.finish>=15));if(conditions?.rain||conditions?.relaxed)return feasible.find(x=>x.course.relaxed||x.course.rain)||feasible[0]||fallback(day,conditions);return feasible[0]||fallback(day,conditions);}
export function loadV2(storage){try{const r=JSON.parse(storage.getItem('fukuoka-courses-v2'));if(r?.version===2&&DAYS.includes(r.day)&&r.choices&&typeof r.choices==='object'&&r.conditions){const c={...defaultConditions(),...r.conditions};if(typeof c.rain==='boolean'&&typeof c.relaxed==='boolean'&&['transit','driving'].includes(c.mode)&&Number.isInteger(c.delay)&&c.delay>=0&&c.delay<=180&&Number.isInteger(c.mealWait)&&c.mealWait>=0&&c.mealWait<=120&&validMealMode(c.mealMode))return {version:2,day:r.day,choices:r.choices,conditions:c};}}catch{}return {version:2,day:'08',choices:{},conditions:defaultConditions()};}
export function selectedResult(state,day){const saved=state.choices?.[day],c=COURSES[day].find(x=>x.id===saved?.course);const result=c?evaluate(day,c,state.conditions,saved.meal):saved?.course==='direct'?fallback(day,state.conditions):null;return result?.feasible?result:recommend(day,state.conditions);}
