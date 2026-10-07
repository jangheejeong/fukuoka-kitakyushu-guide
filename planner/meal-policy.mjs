export const MEAL_MODES={together:'함께 앉아 식사',split:'나눠 앉아 동시에 식사',relay:'두 팀이 번갈아 식사'};
export const validMealMode=value=>Object.hasOwn(MEAL_MODES,value);
export function mealPolicy({family=false,mode='together',duration=70,facility=false,market=false,extraWait=0}={}){
 const effective=family&&validMealMode(mode)?mode:'together';
 const roundDuration=family&&!facility&&!market?Math.max(effective==='together'?90:70,duration):duration;
 const roundQueue=(family&&(!facility||market)?30:0)+extraWait;
 const rounds=family&&effective==='relay'?2:1,exchange=rounds===2?10:0;
 const segments=[];
 for(let i=0;i<rounds;i++){if(i)segments.push({kind:'exchange',duration:exchange});if(roundQueue)segments.push({kind:'queue',duration:roundQueue,round:i+1});segments.push({kind:'meal',duration:roundDuration,round:i+1});}
 const queue=roundQueue,total=rounds*(roundDuration+roundQueue)+exchange;
 const explanation=!family?'부부 식사 · 식사 방식 변경은 가족 일정에만 적용':effective==='split'?'같은 식당의 나뉜 자리에서 동시에 식사 · 가장 늦게 마친 팀까지 기다린 뒤 이동. 대기·자리·유모차 접근은 여전히 확인 필요':effective==='relay'?'두 팀이 유아·짐을 돌보며 교대 · 각 팀 대기·식사와 교대 10분 포함, 모두 마친 뒤 다음 이동':'함께 앉는 자리 확보 가정 · 단체 동석·유아 자리·유모차 공간·대기는 확인 필요';
 return {mode:effective,label:family?MEAL_MODES[effective]:'부부 식사',rounds,roundDuration,roundQueue,exchange,queue,stay:total-queue,total,segments,explanation};
}
