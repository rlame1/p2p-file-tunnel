const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { buildWindowsGuiExe } = require('./pe-exe-builder.cjs');

const distDir = path.join(__dirname, '..', 'dist');
const outDownloadsDir = path.join(distDir, 'downloads');

if (!fs.existsSync(outDownloadsDir)) {
  fs.mkdirSync(outDownloadsDir, { recursive: true });
}

const indexHtmlPath = path.join(distDir, 'index.html');
let singleFileHtml = fs.existsSync(indexHtmlPath)
  ? fs.readFileSync(indexHtmlPath, 'utf8')
  : '<html><body>AetherTunnel Standalone</body></html>';

// Inline all built CSS and JS from dist/assets/ into singleFileHtml so it works 100% standalone
const assetsDir = path.join(distDir, 'assets');
if (fs.existsSync(assetsDir)) {
  const assetFiles = fs.readdirSync(assetsDir);
  for (const file of assetFiles) {
    const fullPath = path.join(assetsDir, file);
    if (!fs.statSync(fullPath).isFile()) continue;

    if (file.endsWith('.css')) {
      const cssContent = fs.readFileSync(fullPath, 'utf8');
      singleFileHtml = singleFileHtml.replace(
        new RegExp(`<link[^>]*href=["'][^"']*${file}["'][^>]*>`, 'i'),
        () => `<style>\n${cssContent}\n</style>`
      );
    } else if (file.endsWith('.js')) {
      const jsContent = fs.readFileSync(fullPath, 'utf8');
      singleFileHtml = singleFileHtml.replace(
        new RegExp(`<script[^>]*src=["'][^"']*${file}["'][^>]*>\\s*</script>`, 'i'),
        () => `<script type="module">\n${jsContent}\n</script>`
      );
    }
  }
}

// 1. Write 100% Self-Contained Single-File HTML
const standaloneHtmlOut = path.join(
  outDownloadsDir,
  'AetherTunnel-Portable-Standalone.html'
);
fs.writeFileSync(standaloneHtmlOut, singleFileHtml, 'utf8');

// 2. Build Native Windows Standalone GUI Executable (.exe)
const winExeBuffer = buildWindowsGuiExe(singleFileHtml);
const winExeOut = path.join(outDownloadsDir, 'AetherTunnel-win-x64.exe');
fs.writeFileSync(winExeOut, winExeBuffer);

// 3. Build macOS Universal Double-Click Executable (.command) & Linux Executable (.sh)
const b64Html = Buffer.from(singleFileHtml, 'utf8').toString('base64');
const unixLauncher = [
  '#!/usr/bin/env bash',
  'set -e',
  'OUT_FILE="/tmp/AetherTunnel-Standalone-GUI.html"',
  `echo "${b64Html}" | base64 --decode > "$OUT_FILE" 2>/dev/null || echo "${b64Html}" | base64 -D > "$OUT_FILE"`,
  'if command -v open >/dev/null 2>&1; then',
  '  open "$OUT_FILE"',
  'elif command -v xdg-open >/dev/null 2>&1; then',
  '  xdg-open "$OUT_FILE"',
  'else',
  '  echo "Open $OUT_FILE in your web browser."',
  'fi',
].join('\n');

const macOut = path.join(outDownloadsDir, 'AetherTunnel-macos-universal.command');
const linuxOut = path.join(outDownloadsDir, 'AetherTunnel-linux-x86_64.sh');
fs.writeFileSync(macOut, unixLauncher, { mode: 0o755 });
fs.writeFileSync(linuxOut, unixLauncher, { mode: 0o755 });

// 4. Generate SHA256SUMS.txt
const generatedFiles = [
  'AetherTunnel-win-x64.exe',
  'AetherTunnel-Portable-Standalone.html',
  'AetherTunnel-macos-universal.command',
  'AetherTunnel-linux-x86_64.sh',
];

const sumLines = generatedFiles.map((fname) => {
  const buf = fs.readFileSync(path.join(outDownloadsDir, fname));
  const hash = crypto.createHash('sha256').update(buf).digest('hex');
  return `${hash}  ${fname}`;
});

fs.writeFileSync(
  path.join(outDownloadsDir, 'SHA256SUMS.txt'),
  sumLines.join('\n') + '\n',
  'utf8'
);

console.log('Successfully built all standalone executables in dist/downloads/:');
for (const fname of generatedFiles) {
  const sizeKb = (
    fs.statSync(path.join(outDownloadsDir, fname)).size / 1024
  ).toFixed(1);
  console.log(` - ${fname} (${sizeKb} KB)`);
}
