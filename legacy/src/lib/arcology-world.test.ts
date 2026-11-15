import test from 'node:test';
import assert from 'node:assert/strict';
import { isResident, residents, residentPath, sceneFor } from './arcology-world';
import { getStory, getExperience } from './content';
import { renderMarkdown } from './markdown';

test('both residents have distinct entry routes and share the same story setting', () => {
  assert.notEqual(residentPath('mel'), residentPath('pell'));
  assert.equal(residents.mel.location, residents.pell.location);
  assert.equal(isResident('unknown'), false);
  assert.equal(isResident('toString'), false);
});
test('before-reading payload excludes the after-story reveal and image', () => {
  const intro = JSON.stringify(sceneFor('intro'));
  assert.doesNotMatch(intro, /high-water|lobster|sunrise|after-water|embodied presence/i);
  assert.match(JSON.stringify(sceneFor('after-water')), /high-water mark/);
});
test('scene navigation preserves reading context when changing residents', () => {
  for (const moment of ['intro', 'after-water'] as const) {
    const scene = sceneFor(moment);
    assert.equal(new Set(scene.points.map((p) => p.id)).size, 3);
    for (const point of scene.points) {
      for (const coordinate of point.position) assert.ok(coordinate >= 0 && coordinate <= 100);
      if (isResident(point.id)) assert.equal(point.href, residentPath(point.id, moment));
    }
  }
});
test('both published Water installments and both interactive experiences remain available', async () => {
  for (const slug of ['water', 'water-part-2']) {
    const story = getStory(slug);
    assert.ok(story && story.content.length > 10000);
    assert.ok(await renderMarkdown(story.content));
    assert.ok(getExperience(slug));
  }
  assert.match(getStory('water-part-2')!.content, /The lobster nodded/);
});
