const { execSync } = require('child_process');
const semver = require('semver');
const packageJson = require('../package.json');

function checkNodeVersion() {
  const requiredVersion = packageJson.engines.node;
  const currentVersion = process.version;
  
  if (!semver.satisfies(currentVersion, requiredVersion)) {
    console.error(`❌ Node.js version ${currentVersion} does not satisfy the required version ${requiredVersion}`);
    process.exit(1);
  }
  console.log(`✅ Node.js version ${currentVersion} satisfies the required version ${requiredVersion}`);
}

function checkNpmVersion() {
  const requiredVersion = packageJson.engines.npm;
  const currentVersion = execSync('npm --version').toString().trim();
  
  if (!semver.satisfies(currentVersion, requiredVersion)) {
    console.error(`❌ npm version ${currentVersion} does not satisfy the required version ${requiredVersion}`);
    process.exit(1);
  }
  console.log(`✅ npm version ${currentVersion} satisfies the required version ${requiredVersion}`);
}

function checkSystemRequirements() {
  try {
    checkNodeVersion();
    checkNpmVersion();
    
    // Check for required system tools
    const requiredTools = ['git', 'python3'];
    for (const tool of requiredTools) {
      try {
        execSync(`${tool} --version`, { stdio: 'ignore' });
        console.log(`✅ ${tool} is installed`);
      } catch (error) {
        console.error(`❌ ${tool} is not installed or not in PATH`);
        process.exit(1);
      }
    }
    
    // Check for required disk space (at least 2GB free)
    const freeSpace = require('check-disk-space').sync(process.cwd());
    const requiredSpace = 2 * 1024 * 1024 * 1024; // 2GB in bytes
    
    if (freeSpace.free < requiredSpace) {
      console.error(`❌ Insufficient disk space. Required: 2GB, Available: ${Math.round(freeSpace.free / (1024 * 1024 * 1024))}GB`);
      process.exit(1);
    }
    console.log(`✅ Sufficient disk space available`);
    
  } catch (error) {
    console.error('❌ Error checking system requirements:', error.message);
    process.exit(1);
  }
}

checkSystemRequirements(); 