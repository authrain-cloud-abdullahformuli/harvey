import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { execSync } from 'node:child_process';

const ROOT = resolve(process.cwd());
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ ${message}`);
  }
}

console.log('🧪 Starting Harvey Verification Suite...\n');

// 1. Core Project Files
console.log('📦 Checking Core Project Assets:');
const requiredFiles = [
  'pyproject.toml',
  'requirements.txt',
  'harvey.yaml',
  'LICENSE',
  'README.md',
  'CHANGELOG.md',
  'MAINTAINERS.md',
  'CITATION.cff',
  'AGENTS.md',
  'Dockerfile',
  'docker-compose.yml'
];

for (const file of requiredFiles) {
  assert(existsSync(join(ROOT, file)), `File exists: ${file}`);
}

// 2. Attribution & License verification
console.log('\n🔒 Verifying Attribution & License:');
const licenseContent = readFileSync(join(ROOT, 'LICENSE'), 'utf8');
assert(licenseContent.includes('Abdullah Formuli'), 'LICENSE lists Abdullah Formuli');
assert(licenseContent.includes('authrain-cloud-abdullahformuli'), 'LICENSE links github profile');

const pyprojectContent = readFileSync(join(ROOT, 'pyproject.toml'), 'utf8');
assert(pyprojectContent.includes('Abdullah Formuli'), 'pyproject.toml lists Abdullah Formuli');
assert(pyprojectContent.includes('authrainmedia@gmail.com'), 'pyproject.toml lists authrainmedia@gmail.com');
assert(pyprojectContent.includes('authrain-cloud-abdullahformuli/harvey'), 'pyproject.toml points to correct repo');

const citationContent = readFileSync(join(ROOT, 'CITATION.cff'), 'utf8');
assert(citationContent.includes('Abdullah'), 'CITATION.cff contains Abdullah');
assert(citationContent.includes('authrain-cloud-abdullahformuli/harvey'), 'CITATION.cff contains repository URL');

// 3. Web Dashboard Assets
console.log('\n🌐 Verifying Web Dashboard Assets:');
const webDir = join(ROOT, 'harvey', 'web');
const webFiles = ['index.html', 'app.css', 'app.js'];
for (const wf of webFiles) {
  const p = join(webDir, wf);
  assert(existsSync(p) && statSync(p).size > 0, `Dashboard asset exists and is non-empty: ${wf}`);
}
assert(existsSync(join(webDir, 'fonts')), 'Vendored offline fonts directory exists');

// 4. Prompts & Skills
console.log('\n🧠 Verifying Prompts & Skills:');
const prompts = ['handler.md', 'scout.md', 'system.md', 'writer.md'];
for (const pr of prompts) {
  assert(existsSync(join(ROOT, 'prompts', pr)), `Prompt exists: ${pr}`);
}

const skills = [
  'account_navigation.md',
  'email_frameworks.md',
  'lead_qualification.md',
  'linkedin_outreach.md',
  'objection_handling.md',
  'offer_strategy.md',
  'prospecting_tactics.md',
  'sales_methodology.md',
  'signal_playbook.md'
];
for (const sk of skills) {
  assert(existsSync(join(ROOT, 'skills', sk)), `Skill exists: ${sk}`);
}

// 5. Python Syntax Compilation Check
console.log('\n🐍 Verifying Python Syntax Compilation:');
try {
  execSync('python3 -m compileall -q harvey tests', { cwd: ROOT, stdio: 'pipe' });
  assert(true, 'All Python source files and tests compile without syntax errors');
} catch (err) {
  assert(false, `Python compilation failed: ${err.message}`);
}

// 6. Upstream / Fork Cleanliness Check
console.log('\n🛡️ Checking Repository Cleanliness (No Leaked Upstream Handles):');
function checkDirectory(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git' || entry.name === '__pycache__' || entry.name === '.venv' || entry.name === 'test.mjs') continue;
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      checkDirectory(fullPath);
    } else if (entry.isFile() && !entry.name.endsWith('.gif') && !entry.name.endsWith('.png') && !entry.name.endsWith('.woff2') && !entry.name.endsWith('.pyc')) {
      const content = readFileSync(fullPath, 'utf8');
      const target = ['ethan', 'plusai'].join('');
      if (content.includes(target)) {
        assert(false, `Found upstream reference ${target} in ${fullPath}`);
      }
    }
  }
}
try {
  checkDirectory(ROOT);
  assert(true, 'Zero upstream ethanplusai references across all text files');
} catch (e) {
  assert(false, `Cleanliness check failed: ${e.message}`);
}

console.log(`\n==========================================`);
console.log(`Results: ${passed} passed, ${failed} failed`);
console.log(`==========================================\n`);

if (failed > 0) {
  process.exit(1);
}
