import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import {restaurants} from '../planner/data.mjs';
import {DINING_DETAILS} from '../planner/dining-details.mjs';
test('every dining option has a shipped real photo, sourced menu and dated Google lookup',()=>{
 assert.deepEqual(Object.keys(DINING_DETAILS).sort(),restaurants.map(x=>x.id).sort());
 for(const r of restaurants){const d=DINING_DETAILS[r.id];
  assert.ok(d.photos.length,r.id);
  for(const p of d.photos){assert.ok(existsSync(new URL('../'+p.url,import.meta.url)),r.id);assert.match(p.source,/^https:\/\//);assert.ok(p.alt&&p.credit);}
  assert.ok(d.menu.items.length&&d.menu.basis);assert.match(d.menu.source,/^https:\/\//);
  assert.equal(d.google.checked,'2026-10-07');assert.match(d.google.url,/^https:\/\/www.google.com\/maps\//);
  if(d.google.scope==='지역 검색'){assert.equal(d.google.rating,null);assert.equal(d.google.count,null);}
  else{assert.ok(d.google.rating>0&&d.google.rating<=5);assert.ok(d.google.count>0);}
 }
});
