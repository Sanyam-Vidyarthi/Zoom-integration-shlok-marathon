const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function setupGitHooks() {
  try {
    // Ensure .git directory exists
    if (!fs.existsSync('.git')) {
      console.error('❌ .git directory not found. Please initialize git first.');
      process.exit(1);
    }

    // Create .husky directory if it doesn't exist
    const huskyDir = path.join(process.cwd(), '.husky');
    if (!fs.existsSync(huskyDir)) {
      fs.mkdirSync(huskyDir, { recursive: true });
    }

    // Create pre-commit hook
    const preCommitHook = path.join(huskyDir, 'pre-commit');
    fs.writeFileSync(preCommitHook, `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint-staged
`, { mode: 0o755 });

    // Create commit-msg hook
    const commitMsgHook = path.join(huskyDir, 'commit-msg');
    fs.writeFileSync(commitMsgHook, `#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npx --no -- commitlint --edit "$1"
`, { mode: 0o755 });

    console.log('✅ Git hooks set up successfully');
  } catch (error) {
    console.error('❌ Error setting up git hooks:', error.message);
    process.exit(1);
  }
}

function setupLintStaged() {
  try {
    const lintStagedConfig = {
      '*.{js,jsx,ts,tsx}': [
        'eslint --fix',
        'prettier --write',
      ],
      '*.{json,md}': [
        'prettier --write',
      ],
    };

    fs.writeFileSync(
      path.join(process.cwd(), '.lintstagedrc.json'),
      JSON.stringify(lintStagedConfig, null, 2)
    );

    console.log('✅ lint-staged configuration set up successfully');
  } catch (error) {
    console.error('❌ Error setting up lint-staged:', error.message);
    process.exit(1);
  }
}

function setupCommitLint() {
  try {
    const commitLintConfig = {
      extends: ['@commitlint/config-conventional'],
      rules: {
        'type-enum': [
          2,
          'always',
          [
            'feat',
            'fix',
            'docs',
            'style',
            'refactor',
            'perf',
            'test',
            'build',
            'ci',
            'chore',
            'revert',
          ],
        ],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
      },
    };

    fs.writeFileSync(
      path.join(process.cwd(), 'commitlint.config.js'),
      `module.exports = ${JSON.stringify(commitLintConfig, null, 2)}`
    );

    console.log('✅ commitlint configuration set up successfully');
  } catch (error) {
    console.error('❌ Error setting up commitlint:', error.message);
    process.exit(1);
  }
}

function main() {
  try {
    setupGitHooks();
    setupLintStaged();
    setupCommitLint();
    
    // Install additional dependencies if needed
    execSync('npm install --save-dev @commitlint/config-conventional', { stdio: 'inherit' });
    
    console.log('✅ Post-installation setup completed successfully');
  } catch (error) {
    console.error('❌ Error during post-installation setup:', error.message);
    process.exit(1);
  }
}

main(); 