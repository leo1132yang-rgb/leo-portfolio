const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText, filename);
const { ChildhoodEngine, readProgress } = require('../../components/leo-room/childhood/engine.ts');
const { GROUND, doors, memoryEvents, unlockedPages, npcs, placeReturns, scenes } = require('../../components/leo-room/childhood/world.ts');
const { worldX } = require('../../components/leo-room/childhood/layout.ts');
const none = { left: false, right: false, jump: false };
const tick = (g, seconds, input = none) => { for (let n = 0; n < seconds * 60 + 1; n++) g.update(1 / 60, input); };
const finish = g => { for(let i=0; i<1800 && g.encounter; i++) { g.update(1/60, none); if(i%24===0) g.interact(); } assert.equal(g.encounter,null); };
const game = new ChildhoodEngine(readProgress(null));
tick(game, 3, { ...none, right: true });
assert(game.x > 440 && game.camera > 0, 'Walking and camera follow');
tick(game, .2, { ...none, jump: true });
assert(game.y < GROUND && !game.grounded, 'Jump leaves the floor');
tick(game, 1, { ...none, jump: true });
assert.equal(game.y, GROUND, 'Holding jump must not automatically bounce');
game.changeScene('orchard',380); game.y = 420; game.vy = 0; tick(game, .5);
assert.equal(game.y, 453, 'Land on a raised platform');
tick(game, 1, { ...none, right: true });
assert.equal(game.y, GROUND, 'Walk off a platform and land on road');
game.changeScene('gandong',1350); game.y = GROUND; game.refreshNearby();
assert.notEqual(game.nearby?.value.id, 'fathers-belly', 'Belly memory requires the daytime event');
for (const event of memoryEvents) {
  game.changeScene(event.scene, event.x); game.refreshNearby();
  assert.equal(game.nearby?.value.id, event.id, `Reachable interaction: ${event.id}`);
  game.interact(); assert.equal(game.encounter?.event.id, event.id);
  finish(game);
  assert(game.completed.includes(event.id), `Event completed: ${event.id}`);
  if (event.kind === 'breakfast') assert.equal(game.scene, 'kitchen', 'Breakfast continues from bedroom to kitchen');
}
assert.equal(game.completed.length, memoryEvents.length);
assert.deepEqual(unlockedPages(game.completed), Array.from({ length: 18 }, (_, i) => i + 1), 'All original story pages have an unlock');
for (const door of doors) {
  game.changeScene(door.scene, door.x); game.refreshNearby();
  assert.equal(game.nearby?.value.id, door.id, `Door reachable: ${door.id}`);
  game.interact(); assert.equal(game.scene, door.to); assert.equal(game.x, door.spawn);
}
for (const [scene, back] of Object.entries(placeReturns)) {
  for (const direction of ['left', 'right']) {
    game.changeScene(scene, direction === 'right' ? scenes[scene].width - 29 : 29);
    const completed = [...game.completed];
    for (let i = 0; i < 60 && game.scene === scene; i++) game.update(1 / 60, { ...none, [direction]: true });
    assert.equal(game.scene, back.to, `${scene} ${direction} boundary returns to parent`);
    assert.equal(game.x, back.spawn, `${scene} returns to its actual entrance, not the parent's far edge`);
    assert.deepEqual(game.completed, completed, 'Walking out preserves memories');
    tick(game, .8); assert.equal(game.scene, back.to, 'Arrival does not bounce back into the place');
  }
}
const replay = memoryEvents.find(e => e.id === 'arrival');
game.changeScene(replay.scene, replay.x); game.interact(); finish(game);
assert.equal(game.completed.length, memoryEvents.length, 'Replaying never duplicates progress');
assert.deepEqual(readProgress(JSON.stringify(game.progress)), game.progress, 'Save and restore');
assert.equal(readProgress('{bad').scene, 'street');
assert.equal(readProgress(JSON.stringify({ version: 1, scene: '__proto__', completed: ['bogus', 'arrival', 'arrival'], x: -99 })).scene, 'street');
for (const id of ['arcade-father', 'heng-father', 'gandong-father']) assert.equal(npcs.find(n => n.id === id)?.actor, 'father');
for (let i = 1; i <= 18; i++) assert(fs.existsSync(`public/room/childhood-story/web/${String(i).padStart(2, '0')}.webp`));
console.log(`PASS: movement, jump, collision, camera, all ${memoryEvents.length} events, ${doors.length} doors, 18 page unlocks, father identity, persistence, replay and corrupt-save recovery.`);
