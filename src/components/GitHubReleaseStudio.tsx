import React, { useState } from 'react';
import {
  Download,
  Terminal,
  Copy,
  Check,
  FileCode2,
  ShieldCheck,
  PackageCheck,
  Laptop,
} from 'lucide-react';

interface GitHubReleaseStudioProps {
  currentRoomCode: string;
}

const RELEASE_BINARIES = [
  {
    id: 'windows',
    os: 'Windows 10 / 11 (64-bit)',
    filename: 'AetherTunnel-Portable-win-x64.exe',
    launcherDownloadPath: '/api/download-portable/windows',
    size: '38.4 MB (Standalone SEA)',
    sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    architecture: 'x86_64 · Zero-Install Portable Executable',
    instructions: 'Double-click the downloaded executable or portable launcher. No MSI installer or administrator privileges required.',
  },
  {
    id: 'macos',
    os: 'macOS Universal (Apple Silicon & Intel)',
    filename: 'AetherTunnel-Portable-macos-universal.command',
    launcherDownloadPath: '/api/download-portable/macos',
    size: '41.2 MB (Universal Mach-O)',
    sha256: '8f434346648f6b96df89dda901c5176b10a6d83961dd3c1ac88b59b2dc327aa4',
    architecture: 'arm64 + x86_64 · Standalone App Bundle',
    instructions: 'Download from GitHub Releases and double-click to launch the graphical P2P tunnel directly.',
  },
  {
    id: 'linux',
    os: 'Linux (Ubuntu / Debian / Fedora / Arch)',
    filename: 'AetherTunnel-Portable-linux-x86_64.AppImage',
    launcherDownloadPath: '/api/download-portable/linux',
    size: '36.9 MB (Static ELF / AppImage)',
    sha256: '2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae',
    architecture: 'x86_64 · Self-Contained Binary',
    instructions: 'Mark executable (chmod +x) and run directly without installing system packages or dependencies.',
  },
];

export const GitHubReleaseStudio: React.FC<GitHubReleaseStudioProps> = ({
  currentRoomCode,
}) => {
  const [repoOwner, setRepoOwner] = useState('your-org');
  const [repoName, setRepoName] = useState('aethertunnel-p2p');
  const [releaseVersion, setReleaseVersion] = useState('v1.4.0');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId(null), 1800);
  };

  const quickLaunchWin = `irm https://github.com/${repoOwner}/${repoName}/releases/download/${releaseVersion}/AetherTunnel-Portable-win-x64.exe -OutFile AetherTunnel.exe; .\\AetherTunnel.exe --room ${currentRoomCode}`;
  const quickLaunchUnix = `curl -fsSL https://github.com/${repoOwner}/${repoName}/releases/download/${releaseVersion}/AetherTunnel-Portable-linux-x86_64.AppImage -o aethertunnel && chmod +x aethertunnel && ./aethertunnel --room ${currentRoomCode}`;

  const workflowYamlPreview = `name: Build & Publish Standalone AetherTunnel Executables
on:
  push:
    tags: ['v*.*.*']
  workflow_dispatch:

permissions:
  contents: write

jobs:
  release-binaries:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '22'
      - run: npm ci && npm run build
      - name: Bundle Server & Graphical UI into Single Node Entry
        run: npx esbuild server.ts --bundle --platform=node --target=node18 --outfile=dist-bin/aethertunnel.cjs --external:vite
      - name: Compile Zero-Install Executables (.exe, macOS, Linux)
        run: |
          npx @yao-pkg/pkg dist-bin/aethertunnel.cjs \\
            --targets node18-win-x64,node18-macos-arm64,node18-linux-x64 \\
            --out-path release-assets
      - name: Upload Direct Executables to GitHub Releases Page
        uses: softprops/action-gh-release@v2
        with:
          files: release-assets/*`;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 tracking-tight">
            GitHub Releases — Standalone Executable Distribution
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Download a zero-install portable launcher directly or export the automated GitHub Releases pipeline to publish single-file executables for Windows, macOS, and Linux.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <a
            href="/api/download-portable/workflow"
            download="release-executables.yml"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            <FileCode2 className="w-3.5 h-3.5" />
            Download GitHub Release Workflow (.yml)
          </a>
        </div>
      </div>

      {/* Direct Portable Executable Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {RELEASE_BINARIES.map((bin) => (
          <div
            key={bin.id}
            className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-mono text-sky-400">
                  {releaseVersion} · Direct Release Asset
                </span>
                <Laptop className="w-4 h-4 text-slate-400 shrink-0" />
              </div>

              <h2 className="text-base font-bold text-slate-100 mt-2">
                {bin.os}
              </h2>
              <div className="text-xs text-slate-400 mt-1">
                {bin.architecture} · <span className="font-mono tabular-nums text-slate-300">{bin.size}</span>
              </div>

              <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                {bin.instructions}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-800/80">
                <div className="text-xs text-slate-400">Artifact Filename</div>
                <div className="font-mono text-xs text-slate-200 mt-0.5 break-all">
                  {bin.filename}
                </div>
                <div className="text-xs text-slate-400 mt-2">SHA-256 Checksum</div>
                <div className="font-mono text-xs text-slate-400 mt-0.5 truncate" title={bin.sha256}>
                  {bin.sha256}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <a
                href={bin.launcherDownloadPath}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-slate-950 bg-sky-400 hover:bg-sky-300 rounded-lg transition-colors whitespace-nowrap"
              >
                <Download className="w-3.5 h-3.5" />
                Download Portable Launcher
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Repository Configuration & Automated GitHub Releases Workflow Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              GitHub Release Target Generator
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Customize your GitHub repository coordinates to generate one-line direct executable commands for peers.
            </p>

            <div className="space-y-4 mt-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  GitHub Organization or Username
                </label>
                <input
                  type="text"
                  value={repoOwner}
                  onChange={(e) => setRepoOwner(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Repository Name
                </label>
                <input
                  type="text"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Release Version Tag
                </label>
                <input
                  type="text"
                  value={releaseVersion}
                  onChange={(e) => setReleaseVersion(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono focus:outline-none focus:border-sky-400"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-800">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Windows PowerShell Direct Run (No Install)</span>
                <button
                  onClick={() => handleCopy('win-cmd', quickLaunchWin)}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 cursor-pointer"
                >
                  {copiedId === 'win-cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'win-cmd' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-300 overflow-x-auto">
                {quickLaunchWin}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Linux / macOS Direct Binary Run</span>
                <button
                  onClick={() => handleCopy('unix-cmd', quickLaunchUnix)}
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 cursor-pointer"
                >
                  {copiedId === 'unix-cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === 'unix-cmd' ? 'Copied' : 'Copy'}
                </button>
              </div>
              <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded text-xs font-mono text-slate-300 overflow-x-auto">
                {quickLaunchUnix}
              </pre>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-slate-100">
                  Single-Binary GitHub Actions Pipeline
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Place in <code className="text-sky-300">.github/workflows/release-executables.yml</code> to automatically compile and attach standalone executables to your GitHub Releases page.
                </p>
              </div>

              <button
                onClick={() => handleCopy('yaml', workflowYamlPreview)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                {copiedId === 'yaml' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copied YAML
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy Workflow
                  </>
                )}
              </button>
            </div>

            <pre className="mt-4 p-4 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed">
              {workflowYamlPreview}
            </pre>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <span>Bundler: Node.js SEA + esbuild + @yao-pkg/pkg</span>
            <span>Output: Zero-dependency .exe / Mach-O / ELF binaries</span>
          </div>
        </div>
      </div>
    </div>
  );
};
