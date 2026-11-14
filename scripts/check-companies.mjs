#!/usr/bin/env node
/* npm run check-companies — checks every company profile file (format version 2). Exit code 1 on any error.
   Usage: node scripts/check-companies.mjs [--dir <folder of profile files>] [--against <git ref>]
   --against: also compares with the files at an earlier commit (for example HEAD before the agent's run): anything a person wrote
   (source.by owner or fireflair, or no source) must be unchanged, and a file whose status was already claim-pending or claimed
   must not have changed at all. The agent runs it before it commits. */
import path from 'path';
import {loadProfiles, checkProfiles, checkAgainst, PROFILES_DIR} from './company-lib.mjs';

const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const dir = opt('--dir') ? path.resolve(opt('--dir')) : PROFILES_DIR;
const against = opt('--against');
const loaded = loadProfiles(dir);
const {errors, warnings} = checkProfiles(loaded);
if (against) errors.push(...checkAgainst(loaded, against));
errors.forEach((l) => console.error(l));
warnings.forEach((l) => console.log(l));
console.log(`check-companies: ${loaded.length} profiles, ${errors.length} errors, ${warnings.length} warnings`);
process.exit(errors.length ? 1 : 0);
