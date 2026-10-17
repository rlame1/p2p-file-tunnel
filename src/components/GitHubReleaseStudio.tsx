import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  FileCode2,
  Laptop,
  Globe,
  Share2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import {
  generateStandalonePortableHtml,
  generateGitHubPagesAndReleasesWorkflow,
  triggerBrowserDownload,
} from '../utils/standaloneBuilder';

interface GitHubReleaseStudioProps {
  currentRoomCode: string;
}

export const GitHubReleaseStudio: React.FC<GitHubReleaseStudioProps> = ({
  currentRoomCode,
}) => {
  const [repoOwner, setRepoOwner] = useState('your-username');
  const [repoName, setRepoName] = useState('aethertunnel');
  const [releaseVersion, setReleaseVersion] = useState('v1.4.0');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const sharedWebUrl = `${window.location.origin}/?room=${encodeURIComponent(currentRoomCode)}`;
  const githubPagesUrl = `https://${repoOwner}.github.io/${repoName}/?room=${encodeURIComponent(currentRoomCode)}`;
  const githubReleasesUrl = `https://github.com/${repoOwner}/${repoName}/releases/latest`;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const handleDownloadStandaloneHtml = () => {
    const html = generateStandalonePortableHtml(currentRoomCode);
    triggerBrowserDownload(
      'AetherTunnel-Portable-Standalone.html',
      html,
      'text/html;charset=utf-8'
    );
  };

  const handleDownloadWindowsPortable = () => {
    const html = generateStandalonePortableHtml(currentRoomCode);
    const b64 = window.btoa(unescape(encodeURIComponent(html)));
    const batScript = [
      '@echo off',
      'title AetherTunnel Portable P2P Executable (Windows x64)',
      'echo ====================================================================',
      'echo   AetherTunnel - Self-Contained Encrypted P2P File Transfer Client',
      'echo   Extracting & Launching Standalone Graphical Interface...',
      'echo ====================================================================',
      `powershell -NoProfile -ExecutionPolicy Bypass -Command "$html = [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${b64}')); $path = Join-Path $env:TEMP 'AetherTunnel-Client.html'; Set-Content -Path $path -Value $html -Encoding UTF8; Start-Process $path"`,
      'exit',
    ].join('\r\n');

    triggerBrowserDownload(
      'AetherTunnel-Portable-win-x64.bat',
      batScript,
      'application/octet-stream'
    );
  };

  const handleDownloadUnixPortable = (os: 'macos' | 'linux') => {
    const html = generateStandalonePortableHtml(currentRoomCode);
    const b64 = window.btoa(unescape(encodeURIComponent(html)));
    const ext = os === 'macos' ? 'command' : 'sh';
    const shScript = [
      '#!/usr/bin/env bash',
      'set -e',
      'echo "===================================================================="',
      'echo "  AetherTunnel — Self-Contained Encrypted P2P File Transfer Client"',
      'echo "  Launching Standalone Graphical Interface..."',
      'echo "===================================================================="',
      'OUT_FILE="/tmp/AetherTunnel-Portable-Client.html"',
      `echo "${b64}" | base64 --decode > "$OUT_FILE" 2>/dev/null || echo "${b64}" | base64 -D > "$OUT_FILE"`,
      'if command -v open >/dev/null 2>&1; then',
      '  open "$OUT_FILE"',
      'elif command -v xdg-open >/dev/null 2>&1; then',
      '  xdg-open "$OUT_FILE"',
      'else',
      '  echo "Open $OUT_FILE in your web browser."',
      'fi',
    ].join('\n');

    triggerBrowserDownload(
      `AetherTunnel-Portable-${os}.${ext}`,
      shScript,
      'application/x-sh'
    );
  };

  const handleDownloadWorkflowYaml = () => {
    const yaml = generateGitHubPagesAndReleasesWorkflow();
    triggerBrowserDownload(
      'deploy-pages-and-releases.yml',
      yaml,
      'text/yaml;charset=utf-8'
    );
  };

  const workflowYamlPreview = generateGitHubPagesAndReleasesWorkflow();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            Downloads, Sharing &amp; GitHub Pages / Releases
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Download the self-contained portable app right now, share your live web tunnel link with peers, or publish directly to GitHub Pages &amp; GitHub Releases.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handleDownloadStandaloneHtml}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            <Download className="w-3.5 h-3.5" />
            Download Single-File Portable App (.html)
          </button>
        </div>
      </div>

      {/* Where You & Others Can Use or Download This Right Now */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-emerald-400">
              Option 1 · Instant Live Web Link (No Download Needed)
            </span>
            <Share2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h2 className="text-base font-bold text-slate-100">
            Share Direct Tunnel Link With Anyone
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Anyone you send this URL to can open it directly in their browser and immediately transfer encrypted files with you in room <span className="font-mono text-sky-300">{currentRoomCode}</span>.
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-sky-300 truncate">
              {sharedWebUrl}
            </span>
            <button
              onClick={() => handleCopy('live-url', sharedWebUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedId === 'live-url' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied Link
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Share Link
                </>
              )}
            </button>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-sky-400">
              Option 2 · Run Directly on GitHub Pages (github.io)
            </span>
            <Globe className="w-4 h-4 text-sky-400" />
          </div>
          <h2 className="text-base font-bold text-slate-100">
            100% Serverless GitHub Pages Compatible
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Because AetherTunnel includes a built-in serverless WebRTC + STUN signaling engine alongside WebSocket relay, it works directly when hosted on static <strong>GitHub Pages</strong> without needing any backend server.
          </p>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2">
            <span className="font-mono text-xs text-slate-300 truncate">
              {githubPagesUrl}
            </span>
            <button
              onClick={handleDownloadWorkflowYaml}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              <FileCode2 className="w-3.5 h-3.5 text-sky-400" />
              Get Pages Workflow
            </button>
          </div>
        </div>
      </div>

      {/* Direct Self-Contained Executable & Portable App Downloads */}
      <div>
        <h2 className="text-base font-semibold text-slate-100 mb-3">
          Direct Downloadable Standalone Packages (Zero Installation)
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Universal Standalone HTML */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-emerald-400">
                Universal Single-File
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                Standalone Portable (.html)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Complete self-contained graphical P2P app in a single file. Double-click on any OS or upload directly to GitHub.
              </p>
            </div>
            <button
              onClick={handleDownloadStandaloneHtml}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download .html App
            </button>
          </div>

          {/* Windows Self-Extracting Portable Launcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-sky-400">
                Windows 10 / 11 (x64)
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                Windows Portable (.bat / .exe)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Self-contained Windows launcher with embedded graphical P2P client. Runs immediately on double-click with no installation.
              </p>
            </div>
            <button
              onClick={handleDownloadWindowsPortable}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Windows App
            </button>
          </div>

          {/* macOS Universal Launcher */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-sky-400">
                macOS Universal
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                macOS Portable (.command)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Self-contained macOS double-clickable bundle with embedded P2P encryption &amp; STUN hole-punching engine.
              </p>
            </div>
            <button
              onClick={() => handleDownloadUnixPortable('macos')}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download macOS App
            </button>
          </div>

          {/* Linux Portable */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-sky-400">
                Linux (x86_64 / ARM64)
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-1">
                Linux Portable (.sh)
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Zero-dependency self-extracting Linux executable script containing the full graphical P2P tunnel client.
              </p>
            </div>
            <button
              onClick={() => handleDownloadUnixPortable('linux')}
              className="mt-5 w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download Linux App
            </button>
          </div>
        </div>
      </div>

      {/* Step-by-Step Guide to Publishing on Your GitHub Repository */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              How to Publish to Your GitHub Account
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Follow these 3 steps so anyone can run or download the app directly from your GitHub repository:
            </p>

            <ol className="space-y-3 mt-4 text-xs text-slate-300">
              <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-slate-100 block">1. Export Code to GitHub</strong>
                Push this project to your GitHub repository (or upload the downloaded <code className="text-sky-300">AetherTunnel-Portable-Standalone.html</code> as <code className="text-sky-300">index.html</code>).
              </li>
              <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-slate-100 block">2. Add the Automated Workflow</strong>
                Save the workflow on the right as <code className="text-sky-300">.github/workflows/deploy.yml</code>. It automatically deploys the live app to <strong>GitHub Pages</strong> and compiles native <code className="text-sky-300">.exe</code>, macOS, and Linux binaries to <strong>GitHub Releases</strong>.
              </li>
              <li className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                <strong className="text-slate-100 block">3. Share Your GitHub URLs</strong>
                Others can run it in-browser at <code className="text-emerald-400 break-all">{githubPagesUrl}</code> or download the executable from <code className="text-sky-300 break-all">{githubReleasesUrl}</code>.
              </li>
            </ol>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800">
            <div>
              <label className="block text-xs text-slate-400 mb-1">GitHub Username</label>
              <input
                type="text"
                value={repoOwner}
                onChange={(e) => setRepoOwner(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Repository Name</label>
              <input
                type="text"
                value={repoName}
                onChange={(e) => setRepoName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded text-slate-100 font-mono"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Combined GitHub Pages + Releases Workflow (.yml)
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automatically publishes both the live GitHub Pages site and standalone <code className="text-sky-300">.exe</code> / macOS / Linux executables.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleCopy('yaml', workflowYamlPreview)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  {copiedId === 'yaml' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      Copy YAML
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadWorkflowYaml}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-3.5 h-3.5" />
                  Save .yml
                </button>
              </div>
            </div>

            <pre className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto max-h-80 leading-relaxed">
              {workflowYamlPreview}
            </pre>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>Works on: GitHub Pages (Static) + GitHub Releases (Binaries)</span>
            <span>Signaling: Serverless WebRTC Broker + Local WS Relay</span>
          </div>
        </div>
      </div>
    </div>
  );
};
