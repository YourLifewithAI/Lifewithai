import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { getExperience } from './content';
import { availableLoopSteps } from './living-loop';

const experience = getExperience('water');
assert.ok(experience?.experienceType === 'living-loop');
const loop = experience;

test('all room evidence, illustrated locations and transfer endpoints resolve', () => {
  const sourceIds = new Set(loop.sources.map(s => s.id));
  assert.equal(sourceIds.size, loop.sources.length);
  const entities = new Set([...loop.places.map(p => p.id), 'kitchen', 'recovery']);
  assert.equal(entities.size, loop.places.length + 2);
  assert.ok(fs.existsSync(path.join(process.cwd(), 'public', loop.image)));
  for (const p of loop.places) {
    assert.ok(p.sourceIds.length > 0, `${p.id} has research backing`);
    assert.ok(p.companyIds.length > 0, `${p.id} has a real-world company comparison`);
    for (const id of [...p.sourceIds, ...p.companyIds]) assert.ok(sourceIds.has(id), id);
    for (const value of Object.values(p.position)) assert.ok(value > 0 && value < 100);
    for (const id of p.companyIds) {
      const source = loop.sources.find(s => s.id === id)!;
      assert.equal(source.kind, 'Company');
      assert.ok(source.company?.status && source.company.deployment && source.scope, `${id} explains evidence and limits`);
      assert.ok(source.company.technologies.length > 0 && source.company.evidence.length > 0, `${id} identifies methods and evidence`);
      for (const evidence of source.company.evidence) {
        assert.ok(evidence.title);
        assert.equal(new URL(evidence.url).protocol, 'https:');
      }
    }
  }
  const companyRefs = loop.places.flatMap(p => p.companyIds);
  assert.equal(new Set(companyRefs).size, companyRefs.length, 'company anchor IDs are unique');
  assert.deepEqual([...companyRefs].sort(), loop.sources.filter(s => s.kind === 'Company').map(s => s.id).sort(), 'every company entry appears in the room directory');
  for (const source of loop.sources) assert.equal(new URL(source.url).protocol, 'https:');
  for (const r of loop.routes) for (const step of r.steps) {
    assert.ok(entities.has(step.from), step.from);
    assert.ok(entities.has(step.to), step.to);
  }
});

test('isolating nutrient transfer preserves both local circuits and never sends plant water to fish', () => {
  const steps = loop.routes.find(r => r.id === 'water')!.steps;
  const paused = availableLoopSteps(steps, true);
  assert.ok(paused.some(s => s.from === 'fish' && s.to === 'treatment'));
  assert.ok(paused.some(s => s.from === 'treatment' && s.to === 'fish'));
  assert.ok(paused.some(s => s.from === 'plants' && s.to === 'plants'));
  assert.ok(!paused.some(s => s.from === 'treatment' && s.to === 'plants'));
  assert.ok(!steps.some(s => s.from === 'plants' && s.to === 'fish'));
  assert.equal(availableLoopSteps(steps, false).length, steps.length);
  const returnSteps = loop.routes.find(r => r.id === 'soil')!.steps;
  assert.ok(!returnSteps.some(s => s.from === 'compost' && ['fish', 'treatment'].includes(s.to)));
});

test('recovery artwork follows the complete story, and new farm content preserves spoiler scope', () => {
  const reader = fs.readFileSync(path.join(process.cwd(), 'src/components/arcology/WaterReader.tsx'), 'utf8');
  assert.ok(reader.indexOf('318-after-water-storybook.webp') > reader.indexOf('__html: secondHtml'));
  assert.doesNotMatch(JSON.stringify(loop), /lobster|high-water mark|sunrise mural|99\.3%|82\.1%|14\.51/);
  assert.equal(getExperience('water-part-2')?.experienceType, 'tier-rings');
});
