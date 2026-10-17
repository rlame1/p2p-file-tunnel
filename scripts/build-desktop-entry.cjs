const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const outBinDir = path.join(__dirname, '..', 'dist-bin');
const outDownloadsDir = path.join(distDir, 'downloads');

if (!fs.existsSync(outBinDir)) {
  fs.mkdirSync(outBinDir, { recursive: true });
}
if (!fs.existsSync(outDownloadsDir)) {
  fs.mkdirSync(outDownloadsDir, { recursive: true });
}

const indexHtmlPath = path.join(distDir, 'index.html');
const indexHtml = fs.existsSync(indexHtmlPath)
  ? fs.readFileSync(indexHtmlPath, 'utf8')
  : '<html><body>AetherTunnel Standalone</body></html>';

const assetsDir = path.join(distDir, 'assets');
const assetFiles = fs.existsSync(assetsDir) ? fs.readdirSync(assetsDir) : [];
const embeddedAssets = {};

for (const file of assetFiles) {
  const ext = path.extname(file).toLowerCase();
  const mime =
    ext === '.js'
      ? 'application/javascript; charset=utf-8'
      : ext === '.css'
      ? 'text/css; charset=utf-8'
      : 'application/octet-stream';
  const fullPath = path.join(assetsDir, file);
  if (fs.statSync(fullPath).isFile()) {
    embeddedAssets['/assets/' + file] = {
      mime,
      b64: fs.readFileSync(fullPath).toString('base64'),
    };
  }
}

const launcherSource = `#!/usr/bin/env node
const http = require("http");
const { exec } = require("child_process");

const INDEX_HTML = Buffer.from(${JSON.stringify(
  Buffer.from(indexHtml, 'utf8').toString('base64')
)}, "base64");

const ASSETS = ${JSON.stringify(embeddedAssets)};

const server = http.createServer((req, res) => {
  const rawUrl = (req.url || "/").split("?")[0];
  const normalizedUrl = rawUrl.startsWith("/assets/")
    ? rawUrl
    : rawUrl.includes("/assets/")
    ? "/assets/" + rawUrl.split("/assets/")[1]
    : rawUrl;

  if (ASSETS[normalizedUrl]) {
    res.writeHead(200, { "Content-Type": ASSETS[normalizedUrl].mime });
    res.end(Buffer.from(ASSETS[normalizedUrl].b64, "base64"));
    return;
  }

  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(INDEX_HTML);
});

server.listen(0, "127.0.0.1", () => {
  const addr = server.address();
  const port = typeof addr === "object" && addr ? addr.port : 3000;
  const url = "http://127.0.0.1:" + port;
  console.log("=========================================================");
  console.log("  AetherTunnel Encrypted P2P Client Running at " + url);
  console.log("=========================================================");

  if (process.platform === "win32") {
    exec('start msedge --app="' + url + '" --window-size=1360,860 || start "" "' + url + '"');
  } else if (process.platform === "darwin") {
    exec('open "' + url + '"');
  } else {
    exec('xdg-open "' + url + '"');
  }
});
`;

const targetCjs = path.join(outBinDir, 'aethertunnel-desktop.cjs');
fs.writeFileSync(targetCjs, launcherSource, 'utf8');
console.log('Generated self-contained desktop entry:', targetCjs);
