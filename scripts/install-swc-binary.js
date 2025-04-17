import { execSync } from 'node:child_process';
import os from 'node:os';

const platform = os.platform();
const arch = os.arch();

let binaryPackage = null;

if (platform === 'darwin' && arch === 'arm64') {
    binaryPackage = '@next/swc-darwin-arm64';
} else if (platform === 'darwin' && arch === 'x64') {
    binaryPackage = '@next/swc-darwin-x64';
} else if (platform === 'linux' && arch === 'x64') {
    binaryPackage = '@next/swc-linux-x64-gnu';
} else if (platform === 'linux' && arch === 'arm64') {
    binaryPackage = '@next/swc-linux-arm64-gnu';
} else {
    console.error(`❌ Unsupported platform: ${platform} ${arch}`);
    process.exit(1);
}

if (!binaryPackage) {
    console.error(`❌ Aucune version compatible de SWC n'a été détectée pour : ${platform}/${arch}`);
    process.exit(1);
}

try {
    console.log(`➡ Installing SWC binary: ${binaryPackage}`);
    execSync(`npm install ${binaryPackage} --save-dev`, { stdio: 'inherit' });
    console.log('✅ SWC binary installed.');
} catch (error) {
    console.error('❌ Failed to install SWC binary:', error.message);
    process.exit(1);
}