#!/usr/bin/env node
/* Copies the FF Team home video beside the built page, so the page can play it by relative path (v/ff-team-reel.mp4).
   Source: media/video-content/ff-team-reel/ff-team-reel.mp4. Run after build and after publish-build. */
import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const src = path.join(ROOT, 'media', 'video-content', 'ff-team-reel', 'ff-team-reel.mp4');
for (const dir of ['build', path.join('build', 'release')]) {
  const out = path.join(ROOT, dir);
  if (!fs.existsSync(out)) continue;
  fs.mkdirSync(path.join(out, 'v'), {recursive: true});
  fs.copyFileSync(src, path.join(out, 'v', 'ff-team-reel.mp4'));
  console.log('video -> ' + path.join(dir, 'v', 'ff-team-reel.mp4'));
}
