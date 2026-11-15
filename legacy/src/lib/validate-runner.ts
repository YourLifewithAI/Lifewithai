// ============================================================
// Arcology Knowledge Node — Validation Runner
// ============================================================
// Runs all content validation checks and outputs a report.
// Always saves report to public/ directory.
//
// Usage:
//   npm run validate            # run validation
//   npm run validate:strict     # fail on warnings too

import fs from 'fs';
import path from 'path';
import { getAllKnowledgeEntries, getAllDomainMeta } from './content';
import { validateAll, formatReport } from './validate';

// tsx in some environments swallows stdout — use stderr for console output
const log = (msg: string) => process.stderr.write(msg + '\n');

const args = process.argv.slice(2);
const strict = args.includes('--strict');

log('[validate] Running content validation...');

const entries = getAllKnowledgeEntries();
const domains = getAllDomainMeta();

log(`[validate] Found ${entries.length} published entries across ${domains.length} domains`);

const report = validateAll(entries, domains);

// Always save reports to public/
const reportDir = path.join(process.cwd(), 'public');
fs.mkdirSync(reportDir, { recursive: true });

const reportJsonPath = path.join(reportDir, 'validation-report.json');
fs.writeFileSync(reportJsonPath, JSON.stringify(report, null, 2), 'utf-8');

const reportMdPath = path.join(reportDir, 'validation-report.md');
fs.writeFileSync(reportMdPath, formatReport(report), 'utf-8');

log(`[validate] Reports saved to ${reportDir}`);

// Print summary
log('');
log(`  Errors:   ${report.errors}`);
log(`  Warnings: ${report.warnings}`);
log(`  Info:     ${report.info}`);

if (report.summary.cross_references.broken > 0) {
  log(`  Broken cross-refs: ${report.summary.cross_references.broken}`);
}
if (report.summary.orphans.count > 0) {
  log(`  Orphan entries: ${report.summary.orphans.count}`);
}

// Exit code
if (report.errors > 0) {
  log(`\n[validate] FAILED: ${report.errors} error(s) found.`);
  process.exitCode = 1;
} else if (strict && report.warnings > 0) {
  log(`\n[validate] FAILED (strict mode): ${report.warnings} warning(s) found.`);
  process.exitCode = 1;
} else {
  log(`\n[validate] PASSED`);
  process.exitCode = 0;
}
