export const zones={hakata:'하카타·고후쿠마치',tenjin:'텐진',ohori:'오호리',momochi:'모모치',dazaifu:'다자이후',itoshima:'이토시마',airport:'후쿠오카 국제선',kokura:'고쿠라',mojiko:'모지코',moji:'구즈하·KF1',karato:'가라토',shiranoe:'시라노에',hiraodai:'히라오다이',sarakura:'사라쿠라'};
const place=(id,name,zone,query=name)=>({id,name,zone,query});
export const locations=[place('hotel','GRAND BASE Hakata Gofuku','hakata','GRAND BASE Hakata Gofuku 7-7 Kamigofukumachi'),place('hakata','하카타역','hakata','Hakata Station'),place('airport','후쿠오카 국제선 터미널','airport','Fukuoka Airport International Terminal'),place('kf1','이타쿠라 KF1 · 근사 핀','moji','Kuzuha 2 Chome 8 Moji Kitakyushu'),...Object.entries(zones).filter(([z])=>!['hakata','airport','moji'].includes(z)).map(([z,n])=>place(z,n,z,({tenjin:'Tenjin Station Fukuoka',mojiko:'Mojiko Station',kokura:'Kokura Station',ohori:'Ohori Park',momochi:'Seaside Momochi',dazaifu:'Dazaifu Tenmangu',itoshima:'Futamigaura Itoshima',karato:'Karato Market',shiranoe:'Shiranoe Botanical Garden',hiraodai:'Hiraodai',sarakura:'Mount Sarakura'})[z]))];
const attraction=(id,name,zone,stay,outdoor,stroller,note,source,window=[540,1020])=>({...place(id,name,zone),kind:'attraction',stay,outdoor,stroller,note,source,window});
export const attractions=[
 attraction('kushida','구시다 신사·옛 거리','hakata',40,true,true,'짧은 구시가지 산책 · 자갈 구간은 아기띠 보조','https://yokanavi.com/'),
 attraction('canal','캐널시티 하카타','hakata',60,false,true,'비 오는 날 실내 휴식·쇼핑','https://canalcity.co.jp/',[600,1200]),
 attraction('ohoripark','오호리 공원','ohori',70,true,true,'호숫가 평탄한 산책 · 자연 풍경','https://www.ohorikouen.jp/',[540,1080]),
 attraction('momochibeach','모모치 해변','momochi',60,true,true,'바닷가 산책 · 모래 위 유모차 이동은 피하기','https://yokanavi.com/',[540,1140]),
 attraction('dazaifutemple','다자이후 텐만구·참배길','dazaifu',90,true,true,'작은 거리와 정원 · 혼잡·돌바닥 주의','https://www.dazaifutenmangu.or.jp/en/plan/faq/'),
 attraction('museum','규슈국립박물관','dazaifu',90,false,true,'실내 문화 코스 · 휴관·전시 확인','https://www.kyuhaku.jp/'),
 attraction('retro','모지코 레트로 항구','mojiko',70,true,true,'작은 항구 동네 · 평탄한 해안 산책','https://www.mojiko.info/'),
 attraction('railway','규슈철도기념관','mojiko',60,false,true,'통상 09–17시 / 입장 마감 16:30 · 휴관 확인','https://www.k-rhm.jp/',[540,1020]),
 attraction('castle','고쿠라성·가쓰야마 공원','kokura',75,true,true,'공원 위주 가족 산책 · 성 내부는 별도 확인','https://www.kokura-castle.jp/'),
 attraction('tanga','탄가시장','kokura',45,false,true,'지붕 있는 시장 골목 · 좁고 혼잡할 수 있음','https://tangaichiba.jp/',[600,960]),
 attraction('market','가라토시장 바칸가이','karato',60,false,true,'금·토 10–15 / 일·공휴일 07–15 · 개최일 확인','https://www.karatoichiba.com/calendars/',[600,900]),
 attraction('shiranoegarden','시라노에 식물공원','shiranoe',75,true,false,'자연 정원 · 경사·계단 때문에 아기띠 권장','https://www.shiranoe.com/'),
 attraction('plateau','히라오다이 전망·초원','hiraodai',90,true,false,'자연 풍경 · 유모차 어려움, 대중교통 긴 접근','https://www.hiraodai.jp/'),
 attraction('sarakuraview','사라쿠라산 전망','sarakura',90,true,false,'케이블카·슬로프카 운행과 날씨 확인','https://www.sarakurayama-cablecar.co.jp/',[660,1200]),
 attraction('futamigaura','이토시마 후타미가우라','itoshima',75,true,true,'바다 풍경 · 해안까지 버스 배차 확인','https://www.crossroadfukuoka.jp/'),
 {...attraction('kawachi','가와치 후지엔','sarakura',90,true,false,'10월 초 계절 개장 기간 밖 · 제외','https://kawachi-fujien.com/'),excluded:'계절 개장 기간 밖'},
 {...attraction('cave','센부쓰 종유동','hiraodai',90,true,false,'물길·미끄럼 · 영유아 동반 제외','https://www.hiraodai.jp/'),excluded:'영유아·유모차 코스로 부적합'}
];
const meal=(id,name,zone,source,facility=false)=>({...place(id,name,zone),kind:'restaurant',stay:70,outdoor:false,stroller:true,window:[660,1230],source,facility,note:facility?'시설 식당가 / 지도 검색 선택지 · 개별 점포 확인':'개별 식당 · 영업·대기·유모차 좌석 확인'});
export const restaurants=[meal('unagi','요시즈카 우나기야','hakata','https://yoshizukaunagi.com/'),meal('motsu','라쿠텐치 하카타역앞점','hakata','https://rakutenti.com/shop/hakata3/'),meal('curry','카레혼포 모지코레트로점','mojiko','https://www.curry-honpo.com/mojikou-retro.html'),meal('katsu','교토가츠규 고쿠라역앞점','kokura','https://gyukatsu-kyotokatsugyu.com/store/kokuraekimae/'),meal('canaldining','캐널시티 식당가','hakata','https://canalcity.co.jp/shops',true),meal('hakatadining','하카타역 식당가','hakata','https://www.jrhakatacity.com/',true),meal('ohoridining','오호리 주변 식당·카페 검색','ohori','https://www.ohorikouen.jp/',true),meal('dazaifudining','다자이후 참배길 식당 검색','dazaifu','https://www.dazaifutenmangu.or.jp/',true),meal('riverwalk','리버워크 식당가','kokura','https://riverwalk.co.jp/',true),meal('kamon','가몬워프 식당가','karato','https://kamonwharf.com/',true)];
restaurants.push(meal('shinshin','ShinShin 텐진 본점','tenjin','https://www.hakata-shinshin.com/tenpo_tenjin'),meal('hanamidori','하카타 하나미도리 하카타역앞점','hakata','https://www.hanamidori.net/stores/0924321801/'),meal('bearfruits','BEAR FRUITS 모지코 야키카레','mojiko','https://bearfruits.jp/bearfruits'));
restaurants.push({...meal('royalcafe','로얄가든카페 오호리공원','ohori','https://www.royal-gardencafe.com/store-menu/ohoripark.html'),query:'ロイヤルガーデンカフェ 大濠公園',window:[660,900],note:'공식 1층·좌석·예약 안내 / 평일 11시 시작, 런치 11–15시 · 영업·유모차 자리 확인'});
restaurants.push({...meal('shizenan','우메노하나 다자이후 자연안','dazaifu','https://www.umenohana.co.jp/stores/detail/66'),query:'梅の花 太宰府別荘自然庵',stay:110,window:[660,990],windows:[[660,990]],lastLunchOrder:930,note:'두부·유바 코스 식사 110분 계획 · 점심 11–16:30 / 주문 마감 15:30. 예약 조건·예산·유모차 진입 확인'});
const cuisines={shizenan:'두부·유바 가이세키',royalcafe:'파스타·그릴·카페',unagi:'장어구이·우나주',motsu:'모츠나베·곱창전골',curry:'야키카레',katsu:'규카츠 정식',shinshin:'하카타 라멘',hanamidori:'미즈타키·닭 전골',bearfruits:'야키카레',canaldining:'라멘·일식 등 점포별',hakatadining:'정식·라멘 등 점포별',ohoridining:'카페·식사 지도 검색',dazaifudining:'식사·카페·우메가에모치 검색',riverwalk:'여러 장르 · 점포별',kamon:'해산물 등 점포별'};
for(const r of restaurants){r.cuisine=cuisines[r.id];if(r.id==='motsu'){r.windows=[[1020,1500]];r.window=[1020,1500];r.note='공식 17시–다음날 01시 / 주문 마감 00:30 · 예약 가능, 단체 동석·유모차 자리 문의';}if(r.id==='hanamidori'){r.windows=[[690,900],[1020,1230]];r.lastLunchOrder=840;r.note='점심 11:30–15:00 / 주문 마감 14시, 저녁 17시부터 · 개실·예약 안내 있음. 유모차 자리 미확인';}}
export const stops=[...attractions,...restaurants];
export const presets={
 '08':{date:'2026-10-08',origin:'airport',departure:'15:10',destination:'hotel',deadline:'21:00',party:'couple',note:'13:40 도착 + 입국·수하물 90분 → 15:10부터. GRAND BASE 체크인 15–22시.'},
 '09':{date:'2026-10-09',origin:'hotel',departure:'09:00',destination:'hakata',deadline:'18:00',party:'couple',note:'낮 일정은 18시 하카타 복귀. 가족 도착 일정은 별도 프리셋으로 계획.'},
 '09family':{date:'2026-10-09',origin:'airport',departure:'19:45',destination:'hotel',deadline:'21:30',party:'family',note:'가족 18:30 도착 + 입국 75분 → 19:45부터. 숙소 목표 21:30 / 체크인 한계 22시.'},
 '10':{date:'2026-10-10',origin:'hotel',departure:'10:00',destination:'kf1',deadline:'19:00',party:'family',note:'GRAND BASE 10시 체크아웃. KF1 짐 맡기기 13시 가능 / 체크인 16시부터. 16시는 도착 마감이 아님.'},
 '11':{date:'2026-10-11',origin:'kf1',departure:'09:00',destination:'kf1',deadline:'18:00',party:'family',note:'KF1·모지코 주변 하루. 구즈하 주소 핀은 근사 위치이므로 실제 출입구 확인.'},
 '12':{date:'2026-10-12',origin:'kf1',departure:'10:00',destination:'airport',deadline:'15:00',party:'family',note:'KF1 11시 체크아웃 후 짐 보관 불가. 국제선 15시 도착 필수 / 18시 출발. 공휴일 가라토 운영은 공식 달력 확인. 11시 출발은 시간이 빠듯하므로 식사까지 계획하려면 10시 이전 출발 검토.'}
};
