const subway={label:'후쿠오카 지하철 공식 노선도',url:'https://subway.city.fukuoka.lg.jp/eng/route/'};
const airport={label:'공항 공식 셔틀·지하철·엘리베이터 안내',url:'https://www.fukuoka-airport.jp/en/access/subway.html'};
const jr={label:'JR 규슈 공식 역·노선 안내',url:'https://www.jrkyushu.co.jp/english/guide/station.html'};
const shinkansen={label:'JR 서일본 하카타–고쿠라 안내',url:'https://www.westjr.co.jp/travel-information/en/tickets-passes/oneway/'};
const nishitetsu={label:'니시테츠 공식 다자이후 접근 안내',url:'https://www.nishitetsu.jp/en/sightseeing/'};
const ferry={label:'간몬 연락선 공식 운항 안내',url:'https://www.kanmon-kisen.co.jp/route/kanmon.html'};
const pin=(id,name,query)=>({id,name,query});
const P={
 domestic:pin('domestic','후쿠오카 공항 국내선 · 지하철 연결','Fukuoka Airport Domestic Terminal'),
 nakasu:pin('nakasu','나카스카와바타역 · 환승','Nakasu Kawabata Station Fukuoka'),
 gofuku:pin('gofuku','고후쿠마치역','Gofukumachi Station Fukuoka'),
 hakata:pin('hakata','하카타역','Hakata Station'),
 kokura:pin('kokura','고쿠라역','Kokura Station'),
 moji:pin('moji-station','모지역 · KF1 택시 연결','Moji Station Kitakyushu'),
 mojiko:pin('mojiko','모지코역','Mojiko Station'),
 mojipier:pin('moji-pier','모지코 연락선 선착장','Kanmon Kisen Mojiko Pier'),
 karatopier:pin('karato-pier','가라토 연락선 선착장','Karato Ferry Terminal Shimonoseki'),
 tenjin:pin('nishitetsu-tenjin','니시테츠 후쿠오카(텐진)역','Nishitetsu Fukuoka Tenjin Station'),
 futsukaichi:pin('futsukaichi','니시테츠 후쓰카이치역 · 환승','Nishitetsu Futsukaichi Station'),
 dazaifu:pin('dazaifu-station','다자이후역','Dazaifu Station'),
 ohori:pin('ohori-station','오호리코엔역','Ohori Koen Station'),
 nishijin:pin('nishijin','니시진역','Nishijin Station Fukuoka')
};
function guide(label,steps,sources=[],waypoints=[]){return {label,steps,sources,waypoints:waypoints.filter((p,i,list)=>!i||p.id!==list[i-1].id),note:'전체 구간 시간은 도보·환승·대기를 포함한 계획값입니다. 실제 열차·버스 출발 시각은 경로에서 확인하세요.'};}
const reverse=(list,back)=>back?[...list].reverse():list;
const fukuoka=z=>['hakata','tenjin','ohori','momochi','dazaifu'].includes(z);
const kitakyushu=z=>['kokura','mojiko','moji'].includes(z);

export function transportGuide(from,to,mode='transit'){
 if(!from||!to)return guide('이동 경로 확인',['출발지와 도착지를 지도에서 확인합니다.']);
 const a=from.zone,b=to.zone;
 if(mode==='driving')return guide('택시·차량 이동 가정',[
  `${from.name}에서 ${to.name}까지 택시·차량으로 이동합니다.`,
  '가족은 나눠 탑승하거나 적정 정원의 차량을 요청합니다. 유모차·짐 적재와 유아 탑승 조건을 확인합니다.',
  ...(from.id==='kf1'||to.id==='kf1'?['KF1은 근사 위치입니다. 승하차할 실제 주소는 호스트 안내로 확인합니다.']:[])
 ]);
 if(mode==='walking')return guide('도보 이동',['구글 지도 도보 경로를 따라 이동합니다. 유모차는 계단 대신 엘리베이터·평탄한 길을 확인합니다.']);
 if((from.id==='kf1'&&b==='karato')||(a==='karato'&&to.id==='kf1')){
  const port={id:'retro',name:'모지코 레트로 항구',zone:'mojiko',query:'Mojiko Retro'};
  const parts=[transportGuide(from,port,mode),transportGuide(port,to,mode)];
  return guide(from.id==='kf1'?'KF1 택시 접근 → JR → 간몬 연락선 연결':'간몬 연락선 → JR → KF1 택시 연결',parts.flatMap(x=>x.steps),[jr,ferry],parts.flatMap(x=>x.waypoints));
 }
 if((from.id==='airport'&&to.id==='hotel')||(from.id==='hotel'&&to.id==='airport')){
  const back=to.id==='airport';
  const steps=back?[
   '숙소 → 고후쿠마치역까지 도보. 엘리베이터 출입구를 이용합니다.',
   '하코자키선으로 나카스카와바타역 → 공항선 후쿠오카공항 방면으로 환승합니다.',
   '후쿠오카공항역은 국내선에 있습니다. 남쪽 엘리베이터로 1층 → 1번 정류장에서 무료 셔틀 → 국제선으로 이동합니다.'
  ]:[
   '국제선 도착층 1층 → 5번 정류장 무료 셔틀 → 국내선 남쪽 승차장 하차.',
   '유모차는 국내선 남쪽 엘리베이터로 지하 2층 후쿠오카공항역에 내려갑니다.',
   '지하철 공항선으로 나카스카와바타역 → 하코자키선 가이즈카 방면 환승 → 고후쿠마치역 하차.',
   '고후쿠마치역에서 GRAND BASE Hakata Gofuku까지 도보. 실제 출입구는 숙소 메시지를 확인합니다.'
  ];
  return guide('무료 셔틀 → 지하철 → 도보',steps,[airport,subway],reverse([P.domestic,P.nakasu,P.gofuku],back));
 }
 if(a==='airport'||b==='airport'){
  const back=b==='airport';
  const other=back?from:to;
  if(other.zone!=='hakata'){
   const station={...P.hakata,zone:'hakata'};
   const parts=[transportGuide(from,station,mode),transportGuide(station,to,mode)];
   const sources=[...new Map(parts.flatMap(x=>x.sources).map(x=>[x.url,x])).values()];
   return guide('하카타역 연결 + 국제선 무료 셔틀',parts.flatMap(x=>x.steps),sources,parts.flatMap((x,i)=>i===0?[...x.waypoints,station]:x.waypoints));
  }
  return guide(back?'지하철 → 국내선 → 국제선 셔틀':'국제선 셔틀 → 지하철',back?[
   `${from.name} → 하카타역까지 도보로 접근합니다.`,
   '공항선 후쿠오카공항역 하차 → 국내선 남쪽 엘리베이터로 1층 → 1번 정류장 무료 셔틀 → 국제선 도착.',
   '국내선에 도착했다고 이동을 마치지 않습니다. 국제선 이동까지 포함해 15시 도착 목표를 지킵니다.'
  ]:[
   '국제선 1층 5번 정류장에서 무료 셔틀 → 국내선 남쪽 승차장 하차.',
   '남쪽 엘리베이터로 지하철 후쿠오카공항역 → 공항선 하카타역 → 목적지까지 도보.'
  ],[airport,subway],reverse([P.domestic,P.hakata],back));
 }
 if((a==='karato'&&b==='mojiko')||(a==='mojiko'&&b==='karato')){
  const back=a==='karato';
  return guide('도보 → 간몬 연락선 → 도보',[
   `${from.name}에서 ${back?'가라토':'모지코'} 연락선 선착장으로 걸어갑니다.`,
   `간몬 연락선으로 ${back?'모지코':'가라토'} 이동. 공식 항해 시간은 약 5분이며, 전체 구간에는 승선 대기와 양쪽 도보가 포함됩니다.`,
   `${back?'모지코':'가라토'} 선착장 하차 → ${to.name}까지 도보. 유모차 승하선은 직원 안내를 따릅니다.`
  ],[ferry],reverse([P.mojipier,P.karatopier],back));
 }
 if((fukuoka(a)&&kitakyushu(b))||(kitakyushu(a)&&fukuoka(b))){
  const back=kitakyushu(a), local=back?from:to, west=back?to:from;
  const rail=[...(west.id==='hotel'?[P.gofuku,P.nakasu]:[]),P.hakata,P.kokura,...(local.id==='kf1'?[P.moji]:local.zone==='mojiko'?[P.mojiko]:[])];
  const toJR=west.id==='hotel'?'GRAND BASE → 고후쿠마치역 → 하코자키선 나카스카와바타 환승 → 공항선 하카타역.':`${west.name}에서 하카타역으로 도보·지하철 접근.`;
  const localJR=local.id==='kf1'?'고쿠라역 → JR 가고시마본선 모지역 → 택시로 KF1. 실제 숙소 주소·택시 승하차 위치는 호스트에게 확인합니다.':local.zone==='mojiko'?`고쿠라역 → JR 가고시마본선 모지코역 → ${local.name}까지 도보.`:`고쿠라역 → ${local.name}까지 도보.`;
  return guide('지하철·신칸센·JR 연결'+(local.id==='kf1'?' · KF1 접근 택시':''),back?[
   local.id==='kf1'?'KF1 실제 주소에서 택시 → 모지역 → JR 가고시마본선 고쿠라역.':`${local.name} → ${local.zone==='mojiko'?'모지코역 → JR 가고시마본선 고쿠라역':'고쿠라역'} 접근.`,
   '고쿠라역 → 산요 신칸센 하카타역. 신칸센 승차권·특급권 조건과 실제 출발편을 확인합니다.',
   west.id==='hotel'?'하카타역 → 공항선 나카스카와바타 환승 → 하코자키선 고후쿠마치역 → 숙소 도보.':`하카타역 → ${west.name}까지 도보·지하철 접근.`
  ]:[toJR,'하카타역 → 산요 신칸센 고쿠라역. 신칸센 승차권·특급권 조건과 실제 출발편을 확인합니다.',localJR],[subway,shinkansen,jr],reverse(rail,back));
 }
 if(from.id==='kf1'||to.id==='kf1'){
  const back=to.id==='kf1', other=back?from:to;
  if(!['kokura','mojiko'].includes(other.zone))return guide('KF1 실제 주소 확인 + 지역 교통 연결',[
   'KF1은 근사 위치입니다. 실제 출입구와 택시 승하차 위치를 호스트 안내로 확인합니다.',
   `${from.name} → ${to.name}의 역·버스·택시 연결과 마지막 접근은 아래 구글 경로에서 확인합니다. 이 지역의 구체적인 환승역은 아직 확인하지 않았습니다.`,
   '산·공원은 정류장 이후 케이블카·버스·등산로 여부와 유모차 접근을 별도로 확인합니다.'
  ]);
  return guide('KF1 접근 택시 + JR·도보',back?[
   `${other.name} → ${other.zone==='kokura'?'고쿠라역':'모지코역'}까지 도보 → JR 가고시마본선 모지역.`,
   '모지역에서 택시로 KF1 이동. 구즈하 일대 근사 핀이므로 실제 주소를 호스트 메시지로 확인합니다.'
  ]:[
   'KF1 실제 주소에서 택시로 모지역 접근. 택시 승하차 위치는 호스트에게 확인합니다.',
   `JR 가고시마본선으로 ${other.zone==='kokura'?'고쿠라역':'모지코역'} → ${other.name}까지 도보.`
  ],[jr],reverse([P.moji,other.zone==='kokura'?P.kokura:P.mojiko],back));
 }
 if((a==='kokura'&&b==='mojiko')||(a==='mojiko'&&b==='kokura'))return guide('도보 → JR 가고시마본선 → 도보',[
  `${from.name} → ${a==='kokura'?'고쿠라역':'모지코역'}까지 도보.`,
  `JR 가고시마본선으로 ${b==='kokura'?'고쿠라역':'모지코역'} 이동 → ${to.name}까지 도보.`
 ],[jr],reverse([P.kokura,P.mojiko],a==='mojiko'));
 if(a==='dazaifu'&&b==='dazaifu')return guide('다자이후 안에서 도보',['참배길·식당·박물관 사이를 도보로 이동합니다. 박물관 연결 통로의 에스컬레이터·엘리베이터는 현장 안내를 따릅니다.']);
 if(a==='dazaifu'||b==='dazaifu'){
  const back=a==='dazaifu';
  return guide('지하철 → 니시테츠 전철 → 도보',back?[
   `${from.name} → 다자이후역 → 다자이후선 니시테츠 후쓰카이치역 환승 → 니시테츠 후쿠오카(텐진)역.`,
   `텐진에서 지하철·도보로 ${to.name}까지 이동합니다.`
  ]:[
   `${from.name}에서 지하철·도보로 니시테츠 후쿠오카(텐진)역에 접근합니다.`,
   '텐진오무타선 니시테츠 후쓰카이치역에서 다자이후선으로 환승 → 다자이후역 하차.',
   `다자이후역에서 ${to.name}까지 도보로 이동합니다.`
  ],[subway,nishitetsu],reverse([P.tenjin,P.futsukaichi,P.dazaifu],back));
 }
 if((from.id==='hotel'&&to.id==='hakata')||(from.id==='hakata'&&to.id==='hotel')){
  const back=from.id==='hakata';
  return guide('도보 → 지하철 환승 → 도보',back?[
   '하카타역 → 공항선 나카스카와바타 → 하코자키선 고후쿠마치역 → GRAND BASE까지 도보.'
  ]:[
   'GRAND BASE → 고후쿠마치역 → 하코자키선 나카스카와바타 환승 → 공항선 하카타역.'
  ],[subway],reverse([P.gofuku,P.nakasu],back));
 }
 if(a===b)return guide('같은 동네에서 도보',[
  `${from.name} → ${to.name}까지 도보 중심으로 이동합니다.`,
  '유모차 통로·횡단보도·엘리베이터를 확인하고, 계단이나 좁은 구간은 아기띠를 보조로 사용합니다.'
 ]);
 if(a==='momochi'||b==='momochi')return guide('지하철 + 해변 접근 도보·버스',b==='momochi'?[
  `${from.name}에서 공항선 역으로 접근 → 니시진역 이동.`,
  '니시진역 → 모모치 해변까지 도보 또는 현장 버스 경로를 확인합니다. 버스 번호·출발편은 구글 경로에서 확인합니다.',
  `${to.name} 입구까지 이동. 모래 위 유모차 이동은 피합니다.`
 ]:[
  `${from.name} → 니시진역까지 도보·버스 접근. 버스 번호·출발편은 구글 경로에서 확인합니다.`,
  `니시진역에서 공항선으로 ${b==='ohori'?'오호리코엔역':'하카타역'} 이동 → ${to.name}까지 도보.`
 ],[subway],[P.nishijin]);
 if((a==='ohori'&&b==='hakata')||(a==='hakata'&&b==='ohori')){
  const back=a==='ohori', hotel=from.id==='hotel'||to.id==='hotel';
  return guide('도보 → 지하철 → 도보',[
   hotel?(back?'오호리코엔역 → 공항선 나카스카와바타 → 하코자키선 고후쿠마치역.':'고후쿠마치역 → 하코자키선 나카스카와바타 → 공항선 오호리코엔역.'):(back?'오호리코엔역 → 공항선 하카타역.':'하카타역 → 공항선 오호리코엔역.'),
   `${from.name}·${to.name}와 역 사이 도보를 포함합니다. 지하철 엘리베이터 출입구를 확인합니다.`
  ],[subway],reverse(hotel?[P.gofuku,P.nakasu,P.ohori]:[P.hakata,P.ohori],back));
 }
 return guide('도보·대중교통 연결',[
  `${from.name}에서 가까운 역·정류장으로 접근한 뒤 ${to.name}까지 이동합니다.`,
  '아래 구글 경로에서 승차 노선·환승·출구·도보 구간을 확인합니다. 표기된 전체 시간 안에 대기와 유모차 이동 여유를 포함했습니다.'
 ],fukuoka(a)&&fukuoka(b)?[subway]:[]);
}
