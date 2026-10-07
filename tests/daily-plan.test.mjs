import test from 'node:test';
import assert from 'node:assert/strict';
import {recommend,COURSES,evaluate} from '../planner/scenarios.mjs';
test('default first two days avoid repeating Ohori while preserving optional choices',()=>{
 assert.equal(recommend('08',{}).course.id,'oldtown');
 assert.equal(recommend('09',{}).course.id,'sea');
 assert.ok(COURSES['08'].some(x=>x.id==='park'));
});
test('moving-day packed lunch uses existing waiting allowance and does not imply early entry',()=>{
 const r=recommend('10',{}),lunch=r.timeline.find(x=>x.mealPrep);
 assert.equal(r.feasible,true);assert.ok(lunch.start<780&&lunch.end<=780);
 assert.equal(lunch.place,undefined);assert.match(lunch.detail,/13시 전 입실 불가/);
 assert.equal(r.timeline.find(x=>x.name==='KF1 짐 맡기기').start,780);
 assert.equal(r.finish,1135);
 const late=evaluate('10',COURSES['10'][0],{delay:90});
 assert.equal(late.timeline.find(x=>x.name==='KF1 짐 맡기기').start,780);
});
test('day9 food preparation fits couple rest time while family flight and checkin remain fixed',()=>{
 const r=recommend('09',{}),prep=r.timeline.find(x=>x.mealPrep);
 assert.equal(prep.stream,'부부');assert.equal(prep.end-prep.start,30);
 assert.ok(prep.end<=1080);assert.equal(r.finish,1260);
 assert.ok(r.timeline.some(x=>x.conditional&&x.detail.includes('인천 출발 전에')));
});
test('full market day includes one market lunch and an early named dinner before the18 return target',()=>{
 const r=recommend('11',{});
 assert.equal(r.course.id,'karatoDinner');assert.equal(r.feasible,true);assert.ok(r.finish<=1060);
 assert.equal(r.timeline.filter(x=>x.name.includes('점심 포함')).length,1);
 const dinner=r.timeline.find(x=>x.meal);assert.equal(dinner.place.id,'bearfruits');
 assert.match(dinner.name,/이른 저녁/);assert.equal(dinner.end-dinner.start,90);
 const saved=evaluate('11',COURSES['11'].find(x=>x.id==='karato'),{});
 assert.equal(saved.timeline.filter(x=>x.meal).length,0);
});
