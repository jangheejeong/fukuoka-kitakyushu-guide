import test from 'node:test';import assert from 'node:assert/strict';
import {plan,normalize,limits,travel,lookup,assess,readSaved,saveState,time} from '../planner/engine.mjs';
const config=(p='11',extra={})=>({...normalize({preset:p}),...extra});
test('both journey legs and stay/rest included',()=>{const s=config('11');const r=assess(s,lookup('retro'),lookup('kf1'),540,1080);assert.equal(r.incoming,30);assert.equal(r.outgoing,30);assert.equal(r.eta,540+30+70+25+30);});
test('deadline exactly fits; one minute over rejected',()=>{const s=config();const r=assess(s,lookup('retro'),lookup('kf1'),540,1080);assert.equal(assess(s,r.stop,lookup('kf1'),540,r.eta).feasible,true);assert.match(assess(s,r.stop,lookup('kf1'),540,r.eta-1).reason,/마감 초과 1분/);});
test('October12 forced international terminal and deadline capped',()=>{const r=plan(config('12',{destination:'hotel',deadline:'23:00'}));assert.equal(r.state.destination,'airport');assert.equal(r.end,900);assert.equal(r.start,600);assert.ok(r.choices.some(x=>x.stop.kind==='restaurant'&&x.feasible));});
test('early airport admission and late checkout constraints',()=>{assert.equal(limits(config('08',{departure:'13:40'})).start,910);assert.equal(limits(config('09family',{departure:'18:30'})).start,1185);assert.match(plan(config('10',{departure:'10:01'})).error,/체크아웃/);assert.match(plan(config('12',{departure:'11:01'})).error,/체크아웃/);});
test('selected sequence consumes legs once and returns from final stop',()=>{const r=plan(config('11',{selected:['retro','railway']}));assert.equal(r.timeline.length,2);assert.equal(r.timeline[1].arrival,r.timeline[0].finish+25);assert.equal(r.eta,r.timeline[1].finish+30);assert.equal(r.state.selected.length,2);});
test('nearby dining geography follows final stop',()=>{const r=plan(config('11',{selected:['retro']}));assert.ok(r.choices.find(x=>x.stop.id==='curry').feasible);assert.match(r.choices.find(x=>x.stop.id==='unagi').reason,/다른 지역/);});
test('walking cross-city is never selectable',()=>{assert.equal(travel(lookup('hotel'),lookup('retro'),'walking'),Infinity);const r=plan(config('08',{mode:'walking'}));assert.ok(r.error);assert.ok(r.choices.every(x=>!x.feasible));});
test('changing deadline removes invalid selections',()=>{const r=plan(config('11',{deadline:'10:00',selected:['retro','railway']}));assert.equal(r.state.selected.length,0);assert.equal(r.removed.length,2);});
test('invalid inputs do not yield selectable plans',()=>{assert.ok(plan(config('11',{departure:'xx'})).error);assert.ok(plan(config('11',{origin:'<script>'})).error);assert.ok(plan(config('11',{deadline:'08:00'})).error);assert.ok(Number.isNaN(time('24:01')));});
test('defensive browser state reads corrupt JSON/invalid selections/throwing storage',()=>{assert.equal(readSaved({getItem:()=>'{bad'}).preset,'08');assert.equal(readSaved({getItem:()=>'{"origin":"missing"}'}).origin,'airport');assert.equal(readSaved({getItem(){throw Error();}}).preset,'08');assert.deepEqual(readSaved({getItem:()=>JSON.stringify(config('11',{selected:['retro','retro','bad',null]}))}).selected,['retro']);assert.equal(saveState({setItem(){throw Error();}},{}),false);});
test('Oct9 hard return and family hotel deadline cannot be weakened',()=>{const d=plan(config('09',{deadline:'22:00',destination:'dazaifu'}));assert.equal(d.end,1080);assert.equal(d.state.destination,'hakata');const f=plan(config('09family',{deadline:'23:00',destination:'mojiko'}));assert.equal(f.end,1320);assert.equal(f.state.destination,'hotel');});
test('legacy rain is ignored while stroller and seasonal exclusions remain',()=>{const r=plan(config('11',{rain:true,stroller:true}));assert.equal(r.state.rain,false);assert.equal(r.choices.find(x=>x.stop.id==='retro').feasible,true);assert.match(r.choices.find(x=>x.stop.id==='kawachi').reason,/계절/);assert.match(r.choices.find(x=>x.stop.id==='cave').reason,/영유아/);});
test('Oct12 holiday market uses morning planning range',()=>{const s=config('12',{origin:'karato',departure:'07:00'});const r=assess(s,lookup('market'),lookup('karato'),420,900);assert.equal(r.visit,475);assert.equal(r.queue,30);});

test('changing origin invalidates meal outside nearby region',()=>{const r=plan(config('11',{origin:'hotel',destination:'hotel',selected:['curry']}));assert.deepEqual(r.state.selected,[]);assert.match(r.removed[0].reason,/다른 지역/);});

test('Oct12 meal-only corridor includes Hakata but selected sightseeing narrows region',()=>{
 const r=plan(config('12'));const meal=r.choices.find(x=>x.stop.id==='hakatadining');
 assert.equal(meal.feasible,true);assert.equal(meal.eta,865);assert.equal(meal.incoming,125);assert.equal(meal.outgoing,45);
 const selected=plan(config('12',{selected:['hakatadining']}));assert.equal(selected.timeline.length,1);assert.equal(selected.eta,865);
 const narrowed=plan(config('12',{selected:['retro']}));assert.equal(narrowed.hasTourist,true);assert.match(narrowed.choices.find(x=>x.stop.id==='unagi').reason,/다른 지역/);assert.match(narrowed.choices.find(x=>x.stop.id==='curry').reason,/마감 초과/);
 const local=plan(config('11',{selected:['retro']}));assert.equal(local.choices.find(x=>x.stop.id==='curry').feasible,true);
});
