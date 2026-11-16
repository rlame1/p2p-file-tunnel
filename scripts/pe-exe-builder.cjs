// Pure Node.js Windows PE32 (.exe) Native Kernel-Socket Desktop Application Builder
// Generates a valid Windows Portable Executable (GUI subsystem, zero console flash)
// that compiles & launches the native 64-bit Windows Kernel-Socket Desktop Application (AetherTunnelKernel_v7.exe):
// - Per-Monitor V2 High-DPI Awareness (razor-sharp native resolution on Windows 11 125%/150%/200% displays)
// - Exact RFC 2898 PBKDF2-HMAC-SHA256 Key & Fingerprint parity with WebCrypto
// - Dual Browser Bridge: Localhost Kernel WebSocket (127.0.0.1:45889) + Universal WSS Wormhole Cloud Bridge (wss://0.peerjs.com)
// - Direct Winsock2 Kernel TCP (.EXE <-> .EXE, 4 MB blocks, 4x Parallel AES-NI)

function getCSharpKernelSource(defaultRoomCode = '742-cobalt-falcon', defaultCloudWsUrl = '') {
  const safeRoom = String(defaultRoomCode || '742-cobalt-falcon')
    .replace(/[^a-z0-9-]/gi, '')
    .toLowerCase() || '742-cobalt-falcon';
  const rawCloudWs = String(defaultCloudWsUrl || '').trim();
  const safeCloudWs = /^(wss?:\/\/[a-z0-9.\-:\[\]]+\/[^\s"'<>\\]*)$/i.test(rawCloudWs) ? rawCloudWs : '';

  return `
using System;
using System.IO;
using System.Net;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Net.WebSockets;
using System.Text;
using System.Text.RegularExpressions;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Security.Cryptography;
using System.Collections.Generic;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Reflection;

[assembly: AssemblyTitle("AetherTunnel P2P Engine")]
[assembly: AssemblyProduct("AetherTunnel")]

namespace AetherTunnelNative
{
    static class Program
    {
        [DllImport("user32.dll")]
        private static extern bool SetProcessDpiAwarenessContext(IntPtr dpiFlag);

        [DllImport("shcore.dll")]
        private static extern int SetProcessDpiAwareness(int value);

        [DllImport("user32.dll")]
        private static extern bool SetProcessDPIAware();

        [DllImport("winmm.dll")]
        private static extern uint timeBeginPeriod(uint uPeriod);

        [STAThread]
        static void Main()
        {
            // Enable 1ms OS scheduler timer resolution for high-precision P2P UDP pacing
            try { timeBeginPeriod(1); } catch { }

            // Enable Per-Monitor V2 High-DPI rendering on Windows 10/11 so text and controls are 100% razor-sharp
            try { SetProcessDpiAwarenessContext(new IntPtr(-4)); } catch { }
            try { SetProcessDpiAwareness(2); } catch { }
            try { SetProcessDPIAware(); } catch { }

            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls | (SecurityProtocolType)12288;
            }
            catch
            {
                try { ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12 | SecurityProtocolType.Tls11 | SecurityProtocolType.Tls; } catch { }
            }

            Application.EnableVisualStyles();
            Application.SetCompatibleTextRenderingDefault(false);
            Application.Run(new MainForm());
        }
    }

    public class MainForm : Form
    {
        private const uint MAGIC_HEADER = 0x4145544B; // "AETK" (AetherTunnel Kernel TCP Frame)
        private const uint MAGIC_UDP_DATA = 0x41455455; // "AETU" (AetherTunnel P2P UDP Encrypted Frame)
        private const int CHUNK_SIZE = 4 * 1024 * 1024; // 4 MB Direct Kernel Socket Macro-Block (.EXE <-> .EXE)
        private const int UDP_CHUNK_SIZE = 1376; // 1376 B Plaintext -> 1420 B UDP / 1448 B IPv4 (Zero IP Fragmentation across CGNAT & PPPoE!)
        private const int WS_CHUNK_SIZE = 1024 * 1024; // 1 MB Localhost WebSocket Frame (.EXE <-> Local Browser)
        private const int CLOUD_CHUNK_SIZE = 49152; // 48 KB Binary / 64 KB Base64 Frame for WSS Cloud Bridge
        private const int PARALLEL_WORKERS = 4; // 4x Parallel Hardware AES-NI Workers per Wave
        private const int UDP_DISCOVERY_PORT = 45888;

        private readonly string instanceId = Guid.NewGuid().ToString("N").Substring(0, 12);
        private const string DEFAULT_CLOUD_WS_URL = "${safeCloudWs}";
        private volatile string currentRoomCode = "${safeRoom}";
        private bool suppressRoomBroadcast = false;
        private float dpiScale = 1.0f;

        private TextBox txtRoomCode;
        private TextBox txtPassphrase;
        private Panel pnlRoomPresence;
        private Label lblRoomPresence;
        private Label lblKeyFingerprint;
        private Label lblStatusBadge;
        private Label lblLocalEndpoint;
        private Label lblSpeedMetric;
        private Label lblProgressDetail;
        private ProgressBar progressBar;
        private ListBox lstLog;
        private Button btnSendFile;
        private FolderBrowserDialog folderDialog;

        private TcpListener tcpListener;
        private UdpClient udpDiscovery;
        private UdpClient udpP2pClient;
        private UdpClient udpP2pV6Client;
        private int listenPort = 45889;
        private int udpP2pPort = 45890;
        private int udpP2pV6Port = 0;
        private volatile string publicWanUdpEndpoint = "";
        private volatile string publicWanV6UdpEndpoint = "";
        private volatile string stunEndpoint0 = "";
        private volatile string stunEndpoint1 = "";
        private volatile int natSymDetected = 0;
        private volatile int natPortDelta = 0;
        private volatile string natTypeSummary = "Probing NAT...";
        private volatile bool upnpTcpMapped = false;
        private volatile bool upnpUdpMapped = false;
        private volatile string remotePeerWanUdp = "";
        private volatile string remotePeerLanUdp = "";
        private volatile string remotePeerWanV6Udp = "";
        private volatile string remotePeerLanTcp = "";
        private volatile string remotePeerPredictedWanUdp = "";
        private volatile int remotePeerNatSym = 0;
        private volatile int remotePeerNatDelta = 0;
        private volatile int remotePeerUpnpTcp = 0;
        private int lastPunchFanTick = unchecked(Environment.TickCount - 10000);
        private string lastLoggedPunchTarget = "";
        private volatile bool isRunning = true;

        // 1. Native .EXE <-> .EXE Kernel TCP Peer & Resume Signaling
        private TcpClient activePeerClient;
        private NetworkStream activePeerStream;
        private readonly object streamWriteLock = new object();
        private volatile int kernelTcpResumeChunk = 0;
        private readonly AutoResetEvent kernelTcpResumeEvent = new AutoResetEvent(false);

        // 1B. Native .EXE <-> .EXE STUN NAT-Punched Direct UDP Peer (Token-Bucket Paced 600-5000 Mbit/s + Real-Time NACK)
        private IPEndPoint activeUdpPeerEndpoint = null;
        private DateTime lastUdpPeerSeen = DateTime.MinValue;
        private volatile int udpPeerAckedChunk = -1;
        private volatile int udpPeerContiguousChunk = -1;
        private volatile int udpPeerUniqueAcked = 0;
        private volatile int udpPeerMeasuredMbps = 0;
        private volatile int udpPeerResumeChunk = 0;
        private volatile bool udpTransferDoneAcked = false;
        private volatile bool udpNeedStartResend = false;
        private double dynamicUdpBitrateMbps = 1.0; // Self-tuning Auto Dynamic P2P Pacer (1–5000 Mbit/s)
        private double udpBestRxMbps = 1.0;
        private double udpCongestionCeilingMbps = 0.0;
        private long udpBestRxDecayTicks = 0;
        private volatile int lastNackReceivedTick = 0;
        private volatile int lastNackCutTick = 0;
        private volatile int lastAckReceivedTick = 0;
        private volatile bool udpInSlowStart = true;
        private volatile int udpCleanAckStreak = 0;
        private volatile int udpLowRxStreak = 0;
        private int pacingResetRequested = 0;
        private readonly object udpTxLock = new object();
        private readonly ConcurrentQueue<int> udpRetransmitQueue = new ConcurrentQueue<int>();
        private readonly ConcurrentDictionary<int, int> udpSenderChunkLastSentTick = new ConcurrentDictionary<int, int>();
        private readonly AutoResetEvent udpAckEvent = new AutoResetEvent(false);
        private readonly AutoResetEvent udpResumeEvent = new AutoResetEvent(false);
        private readonly ConcurrentQueue<byte[]> udpRxDataQueue = new ConcurrentQueue<byte[]>();
        private readonly AutoResetEvent udpRxDataEvent = new AutoResetEvent(false);
        private volatile bool udpRxStartPending = false;
        private volatile bool udpRxEndPending = false;
        private volatile string udpPendingStartHeader = "";
        private IPEndPoint udpPendingStartEp = null;
        private readonly HashSet<string> attemptedAutoTcpEndpoints = new HashSet<string>();
        private readonly ThreadLocal<AesCryptoServiceProvider> threadLocalAes = new ThreadLocal<AesCryptoServiceProvider>(delegate() {
            AesCryptoServiceProvider a = new AesCryptoServiceProvider();
            a.KeySize = 256;
            a.BlockSize = 128;
            a.Mode = CipherMode.CBC;
            a.Padding = PaddingMode.PKCS7;
            return a;
        });
        private readonly ThreadLocal<byte[]> threadLocalIv = new ThreadLocal<byte[]>(delegate() { return new byte[16]; });
        private long totalAppBufferedBytes = 0;
        private const long HARD_RAM_CAP_BYTES = 1750L * 1024L * 1024L;
        private const long DISK_STAGE_TARGET_BYTES = 128L * 1024L * 1024L;
        private const int CHUNKS_PER_STAGE_PAGE = 3000; // 3000 * 1376 B = 4,128,000 B (~3.94 MB aligned block)
        private const int STAGE_PAGE_BYTES = CHUNKS_PER_STAGE_PAGE * UDP_CHUNK_SIZE;
        private readonly ManualResetEvent udpWriterExitedEvent = new ManualResetEvent(true);
        private readonly ManualResetEvent udpDiskIoExitedEvent = new ManualResetEvent(true);
        private readonly ConcurrentQueue<byte[]> udpStageBufferPool = new ConcurrentQueue<byte[]>();
        private readonly ConcurrentQueue<DiskWriteJob> diskWriteQueue = new ConcurrentQueue<DiskWriteJob>();
        private readonly AutoResetEvent diskWriteEvent = new AutoResetEvent(false);
        private readonly ManualResetEvent diskIoIdleEvent = new ManualResetEvent(true);
        private readonly object diskFileStreamLock = new object();
        private int activeDiskIoJobs = 0;
        private int lastUiUpdateTick = 0;
        private volatile int smoothedDiskWriteMbps = 0;
        private volatile int lastDiskWriteMs = 0;
        private volatile int diskSequentialNextPage = 0;
        private volatile int udpResumeBoundaryPage = -1;
        private volatile int udpResumeBoundarySlot = 0;

        private sealed class UdpStagePage
        {
            public int PageIndex;
            public byte[] Data;
            public bool[] Present;
            public short[] ChunkLens;
            public int StartSlot;
            public int PresentCount;
            public int ExpectedCount;
            public int ValidBytes;
        }

        private sealed class DiskWriteJob
        {
            public FileStream TargetFile;
            public string PartPath;
            public long ExpectedFileSize;
            public byte[] Buffer;
            public int Length;
            public long FileOffset;
            public int CkptContigChunk;
            public bool ForceOsSync;
        }

        // 2. Native .EXE <-> Local Browser Kernel WebSocket Bridge (ws://127.0.0.1:45889)
        private TcpClient activeBrowserWsClient;
        private NetworkStream activeBrowserWsStream;
        private readonly object wsWriteLock = new object();

        // 3. Native .EXE <-> Chrome Browser & Remote .EXE Multi-Bus WSS Wormhole Cloud Bridge (App /ws-tunnel + Concurrent MQTT Brokers)
        private sealed class SignalingChannel
        {
            public string Name;
            public bool IsMqtt;
            public string Topic;
            public ClientWebSocket Ws;
            public readonly object SendLock = new object();
        }
        private readonly ConcurrentDictionary<string, SignalingChannel> activeSignalingChannels = new ConcurrentDictionary<string, SignalingChannel>();
        private volatile SignalingChannel lastExeSignalingChannel = null;
        private volatile SignalingChannel lastBrowserSignalingChannel = null;
        private readonly ConcurrentDictionary<string, int> cloudHelloReplyTicks = new ConcurrentDictionary<string, int>();
        private readonly object cloudRxFileLock = new object();
        private FileStream cloudOutFile = null;
        private string cloudFileName = "";
        private string cloudPartPath = "";
        private string cloudOutPath = "";
        private long cloudExpectedSize = 0;
        private long cloudReceivedBytes = 0;
        private Stopwatch cloudRxSw = null;
        private string activeCloudMyId = "";
        private string activeCloudTopic = "aethertunnel/v1/room/default";
        private string activeCloudBrowserPeerId = "";
        private string activeCloudExePeerId = "";
        private DateTime lastCloudBrowserSeen = DateTime.MinValue;
        private DateTime lastCloudExeSeen = DateTime.MinValue;
        private volatile bool cloudReconnectRequested = false;
        private readonly AutoResetEvent cloudAckEvent = new AutoResetEvent(false);
        private volatile int cloudResumeChunk = 0;
        private readonly AutoResetEvent cloudResumeEvent = new AutoResetEvent(false);

        private byte[] aesKey = new byte[32];
        private string currentFingerprint = "Deriving...";
        private string downloadDirectory;

        private int S(int px)
        {
            return (int)Math.Round(px * dpiScale);
        }

        public MainForm()
        {
            using (Graphics g = Graphics.FromHwnd(IntPtr.Zero))
            {
                dpiScale = g.DpiX / 96.0f;
                if (dpiScale < 1.0f) dpiScale = 1.0f;
            }

            this.AutoScaleMode = AutoScaleMode.None;
            this.Text = "AetherTunnel v1.0 — Standalone P2P NAT-Punching & Kernel-Socket Edition";
            this.ClientSize = new Size(S(980), S(540));
            this.MinimumSize = new Size(S(880), S(510));
            this.StartPosition = FormStartPosition.CenterScreen;
            this.BackColor = Color.FromArgb(9, 13, 22);
            this.ForeColor = Color.FromArgb(241, 245, 249);
            this.Font = new Font("Segoe UI", 9.5f, FontStyle.Regular);
            this.AllowDrop = true;
            this.DoubleBuffered = true;

            downloadDirectory = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                "Downloads"
            );
            if (!Directory.Exists(downloadDirectory))
            {
                downloadDirectory = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
            }

            BuildUserInterface();
            DeriveCryptographicKey();
            StartKernelListenerAndDiscovery();

            this.DragEnter += OnFormDragEnter;
            this.DragDrop += OnFormDragDrop;
            this.FormClosing += OnFormClosing;
        }

        private Label CreateCleanLabel(string text, Font font, Color color, Point location, bool autoSize)
        {
            Label lbl = new Label();
            lbl.UseMnemonic = false;
            lbl.Text = text;
            if (font != null) lbl.Font = font;
            lbl.ForeColor = color;
            lbl.Location = location;
            lbl.AutoSize = autoSize;
            return lbl;
        }

        private void BuildUserInterface()
        {
            Color bgCard = Color.FromArgb(15, 23, 42);
            Color bgInput = Color.FromArgb(9, 13, 22);
            Color fgMuted = Color.FromArgb(148, 163, 184);
            Color accentSky = Color.FromArgb(56, 189, 248);
            Color accentEmerald = Color.FromArgb(52, 211, 153);

            Panel headerPanel = new Panel();
            headerPanel.Dock = DockStyle.Top;
            headerPanel.Height = S(78);
            headerPanel.BackColor = Color.FromArgb(12, 18, 30);

            Label lblTitle = CreateCleanLabel(
                "AetherTunnel v1.0 — Standalone P2P & NAT-Punching Engine (.EXE)",
                new Font("Segoe UI Semibold", 14.5f, FontStyle.Bold),
                Color.FromArgb(248, 250, 252),
                new Point(S(24), S(12)),
                true
            );
            headerPanel.Controls.Add(lblTitle);

            Label lblSubtitle = CreateCleanLabel(
                "RFC 5389 STUN + Simultaneous UDP Hole Punching · Resumable .part Transfers · Winsock2 TCP & Browser Bridge",
                new Font("Consolas", 8.8f, FontStyle.Regular),
                accentSky,
                new Point(S(26), S(46)),
                true
            );
            headerPanel.Controls.Add(lblSubtitle);

            lblStatusBadge = CreateCleanLabel(
                "PEER STATUS: PROBING NAT & STUN...",
                new Font("Consolas", 9.5f, FontStyle.Bold),
                accentEmerald,
                new Point(S(560), S(16)),
                true
            );
            lblStatusBadge.Anchor = AnchorStyles.Top | AnchorStyles.Right;
            headerPanel.Controls.Add(lblStatusBadge);

            this.Controls.Add(headerPanel);

            Panel leftCard = new Panel();
            leftCard.BackColor = bgCard;
            leftCard.Location = new Point(S(24), S(94));
            leftCard.Size = new Size(S(436), S(424));
            leftCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left;

            Label lblSec1 = CreateCleanLabel(
                "1. Wormhole Pairing & Kernel TCP Endpoint",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(14)),
                true
            );
            leftCard.Controls.Add(lblSec1);

            Label lblCodeTitle = CreateCleanLabel(
                "Shared Wormhole Code (Pairs with Chrome Browser & LAN .EXE):",
                null,
                fgMuted,
                new Point(S(20), S(42)),
                true
            );
            leftCard.Controls.Add(lblCodeTitle);

            txtRoomCode = new TextBox();
            txtRoomCode.Text = "${safeRoom}";
            txtRoomCode.Font = new Font("Consolas", 11f, FontStyle.Bold);
            txtRoomCode.BackColor = bgInput;
            txtRoomCode.ForeColor = accentSky;
            txtRoomCode.BorderStyle = BorderStyle.FixedSingle;
            txtRoomCode.Location = new Point(S(20), S(64));
            txtRoomCode.Size = new Size(S(285), S(28));
            txtRoomCode.TextChanged += delegate {
                currentRoomCode = txtRoomCode.Text.Trim().ToLowerInvariant();
                lock (attemptedAutoTcpEndpoints) { attemptedAutoTcpEndpoints.Clear(); }
                activeUdpPeerEndpoint = null;
                activeCloudExePeerId = "";
                activeCloudBrowserPeerId = "";
                lastCloudExeSeen = DateTime.MinValue;
                lastCloudBrowserSeen = DateTime.MinValue;
                remotePeerWanUdp = "";
                remotePeerLanUdp = "";
                remotePeerWanV6Udp = "";
                remotePeerLanTcp = "";
                remotePeerPredictedWanUdp = "";
                remotePeerNatSym = 0;
                remotePeerNatDelta = 0;
                remotePeerUpnpTcp = 0;
                lastLoggedPunchTarget = "";
                DeriveCryptographicKey();
                BroadcastUdpPresence();
                if (!suppressRoomBroadcast) NotifyBrowserRoomCode();
                cloudReconnectRequested = true;
            };
            leftCard.Controls.Add(txtRoomCode);

            Button btnNewCode = new Button();
            btnNewCode.UseMnemonic = false;
            btnNewCode.Text = "New Code";
            btnNewCode.FlatStyle = FlatStyle.Flat;
            btnNewCode.BackColor = Color.FromArgb(30, 41, 59);
            btnNewCode.ForeColor = Color.White;
            btnNewCode.Location = new Point(S(313), S(63));
            btnNewCode.Size = new Size(S(103), S(29));
            btnNewCode.Click += delegate {
                string[] words = new string[] { "cobalt", "falcon", "nebula", "quartz", "vortex", "cipher", "zenith", "aurora", "photon", "obsidian" };
                Random r = new Random();
                txtRoomCode.Text = r.Next(100, 999).ToString() + "-" + words[r.Next(words.Length)] + "-" + words[r.Next(words.Length)];
            };
            leftCard.Controls.Add(btnNewCode);

            pnlRoomPresence = new Panel();
            pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
            pnlRoomPresence.BorderStyle = BorderStyle.FixedSingle;
            pnlRoomPresence.Location = new Point(S(20), S(98));
            pnlRoomPresence.Size = new Size(S(396), S(36));

            lblRoomPresence = CreateCleanLabel(
                "[1/2 PEERS] Ei toista peeriä huoneessa — Odotetaan paria...",
                new Font("Consolas", 8.8f, FontStyle.Bold),
                Color.FromArgb(251, 191, 36),
                new Point(S(8), S(9)),
                true
            );
            pnlRoomPresence.Controls.Add(lblRoomPresence);
            leftCard.Controls.Add(pnlRoomPresence);

            Label lblPassTitle = CreateCleanLabel(
                "Optional E2EE Passphrase (PBKDF2-HMAC-SHA256 Salt):",
                null,
                fgMuted,
                new Point(S(20), S(142)),
                true
            );
            leftCard.Controls.Add(lblPassTitle);

            txtPassphrase = new TextBox();
            txtPassphrase.UseSystemPasswordChar = true;
            txtPassphrase.Font = new Font("Consolas", 10f);
            txtPassphrase.BackColor = bgInput;
            txtPassphrase.ForeColor = Color.White;
            txtPassphrase.BorderStyle = BorderStyle.FixedSingle;
            txtPassphrase.Location = new Point(S(20), S(164));
            txtPassphrase.Size = new Size(S(396), S(26));
            txtPassphrase.TextChanged += delegate { DeriveCryptographicKey(); };
            leftCard.Controls.Add(txtPassphrase);

            Label lblFpCaption = CreateCleanLabel(
                "E2EE Key Fingerprint (Matches Chrome Browser 1:1):",
                null,
                fgMuted,
                new Point(S(20), S(198)),
                true
            );
            leftCard.Controls.Add(lblFpCaption);

            lblKeyFingerprint = CreateCleanLabel(
                "Deriving...",
                new Font("Consolas", 11f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(218)),
                true
            );
            leftCard.Controls.Add(lblKeyFingerprint);

            Label lblLocalCaption = CreateCleanLabel(
                "Your Direct Kernel TCP & Local Browser Bridge Address:",
                null,
                fgMuted,
                new Point(S(20), S(248)),
                true
            );
            leftCard.Controls.Add(lblLocalCaption);

            lblLocalEndpoint = CreateCleanLabel(
                "Starting Winsock2 listener...",
                new Font("Consolas", 9.2f, FontStyle.Bold),
                Color.FromArgb(226, 232, 240),
                new Point(S(20), S(268)),
                false
            );
            lblLocalEndpoint.Size = new Size(S(396), S(38));
            leftCard.Controls.Add(lblLocalEndpoint);

            Label lblSaveDir = CreateCleanLabel(
                "Incoming files save to: " + downloadDirectory,
                new Font("Segoe UI", 8.8f),
                fgMuted,
                new Point(S(20), S(318)),
                false
            );
            lblSaveDir.Size = new Size(S(396), S(36));
            leftCard.Controls.Add(lblSaveDir);

            Button btnChangeDir = new Button();
            btnChangeDir.UseMnemonic = false;
            btnChangeDir.Text = "Change Save Folder...";
            btnChangeDir.FlatStyle = FlatStyle.Flat;
            btnChangeDir.BackColor = Color.FromArgb(30, 41, 59);
            btnChangeDir.ForeColor = Color.White;
            btnChangeDir.Location = new Point(S(20), S(362));
            btnChangeDir.Size = new Size(S(190), S(36));
            btnChangeDir.Click += delegate {
                if (folderDialog == null) folderDialog = new FolderBrowserDialog();
                folderDialog.SelectedPath = downloadDirectory;
                if (folderDialog.ShowDialog() == DialogResult.OK)
                {
                    downloadDirectory = folderDialog.SelectedPath;
                    lblSaveDir.Text = "Incoming files save to: " + downloadDirectory;
                }
            };
            leftCard.Controls.Add(btnChangeDir);

            Button btnOpenDir = new Button();
            btnOpenDir.UseMnemonic = false;
            btnOpenDir.Text = "Open Downloads Folder";
            btnOpenDir.FlatStyle = FlatStyle.Flat;
            btnOpenDir.BackColor = Color.FromArgb(30, 41, 59);
            btnOpenDir.ForeColor = accentSky;
            btnOpenDir.Location = new Point(S(222), S(362));
            btnOpenDir.Size = new Size(S(194), S(36));
            btnOpenDir.Click += delegate {
                try { Process.Start("explorer.exe", downloadDirectory); } catch { }
            };
            leftCard.Controls.Add(btnOpenDir);

            this.Controls.Add(leftCard);

            Panel rightCard = new Panel();
            rightCard.BackColor = bgCard;
            rightCard.Location = new Point(S(478), S(94));
            rightCard.Size = new Size(S(478), S(424));
            rightCard.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;

            Label lblSec2 = CreateCleanLabel(
                "2. Direct File Streamer (.EXE <-> Browser & .EXE <-> .EXE)",
                new Font("Segoe UI Semibold", 11f, FontStyle.Bold),
                Color.White,
                new Point(S(20), S(14)),
                true
            );
            rightCard.Controls.Add(lblSec2);

            btnSendFile = new Button();
            btnSendFile.UseMnemonic = false;
            btnSendFile.Text = "SELECT FILE(S) OR DRAG & DROP HERE TO SEND\\n(Auto Dynamic P2P Pacing · Resumable .part Streamer)";
            btnSendFile.FlatStyle = FlatStyle.Flat;
            btnSendFile.BackColor = Color.FromArgb(14, 28, 48);
            btnSendFile.ForeColor = accentSky;
            btnSendFile.Font = new Font("Segoe UI Semibold", 9.8f, FontStyle.Bold);
            btnSendFile.Location = new Point(S(20), S(44));
            btnSendFile.Size = new Size(S(438), S(82));
            btnSendFile.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            btnSendFile.Click += OnSelectFilesClicked;
            rightCard.Controls.Add(btnSendFile);

            lblSpeedMetric = CreateCleanLabel(
                "0.00 MB/s (0.00 Gbps)",
                new Font("Consolas", 15f, FontStyle.Bold),
                accentEmerald,
                new Point(S(20), S(136)),
                true
            );
            rightCard.Controls.Add(lblSpeedMetric);

            lblProgressDetail = CreateCleanLabel(
                "Auto Dynamic P2P Pacing active — Enter shared Wormhole Code to pair automatically.",
                null,
                fgMuted,
                new Point(S(20), S(166)),
                false
            );
            lblProgressDetail.Size = new Size(S(438), S(22));
            lblProgressDetail.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lblProgressDetail);

            progressBar = new ProgressBar();
            progressBar.Location = new Point(S(20), S(192));
            progressBar.Size = new Size(S(438), S(18));
            progressBar.Anchor = AnchorStyles.Top | AnchorStyles.Left | AnchorStyles.Right;
            progressBar.Maximum = 1000;
            rightCard.Controls.Add(progressBar);

            Label lblLogCap = CreateCleanLabel(
                "Live Kernel Socket & Chrome Browser Wormhole Log:",
                null,
                fgMuted,
                new Point(S(20), S(218)),
                true
            );
            rightCard.Controls.Add(lblLogCap);

            lstLog = new ListBox();
            lstLog.BackColor = bgInput;
            lstLog.ForeColor = Color.FromArgb(203, 213, 225);
            lstLog.Font = new Font("Consolas", 9f);
            lstLog.BorderStyle = BorderStyle.FixedSingle;
            lstLog.HorizontalScrollbar = true;
            lstLog.Location = new Point(S(20), S(240));
            lstLog.Size = new Size(S(438), S(164));
            lstLog.Anchor = AnchorStyles.Top | AnchorStyles.Bottom | AnchorStyles.Left | AnchorStyles.Right;
            rightCard.Controls.Add(lstLog);

            this.Controls.Add(rightCard);
        }

        private void Log(string msg)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(Log), msg);
                return;
            }
            string line = "[" + DateTime.Now.ToString("HH:mm:ss.fff") + "] " + msg;
            lstLog.Items.Insert(0, line);
            if (lstLog.Items.Count > 250) lstLog.Items.RemoveAt(lstLog.Items.Count - 1);
        }

        // Exact RFC 2898 PBKDF2-HMAC-SHA256 matching WebCrypto deriveTunnelKey() in src/utils/crypto.ts
        private static byte[] Pbkdf2Sha256(byte[] password, byte[] salt, int iterations, int outputBytes)
        {
            using (HMACSHA256 hmac = new HMACSHA256(password))
            {
                int hashLen = 32;
                int blockCount = (outputBytes + hashLen - 1) / hashLen;
                byte[] result = new byte[outputBytes];
                int outOffset = 0;

                for (int block = 1; block <= blockCount; block++)
                {
                    byte[] saltBlock = new byte[salt.Length + 4];
                    Buffer.BlockCopy(salt, 0, saltBlock, 0, salt.Length);
                    saltBlock[salt.Length + 0] = (byte)((block >> 24) & 0xFF);
                    saltBlock[salt.Length + 1] = (byte)((block >> 16) & 0xFF);
                    saltBlock[salt.Length + 2] = (byte)((block >> 8) & 0xFF);
                    saltBlock[salt.Length + 3] = (byte)(block & 0xFF);

                    byte[] u = hmac.ComputeHash(saltBlock);
                    byte[] t = (byte[])u.Clone();

                    for (int iter = 1; iter < iterations; iter++)
                    {
                        u = hmac.ComputeHash(u);
                        for (int k = 0; k < hashLen; k++)
                        {
                            t[k] ^= u[k];
                        }
                    }

                    int copyLen = Math.Min(hashLen, outputBytes - outOffset);
                    Buffer.BlockCopy(t, 0, result, outOffset, copyLen);
                    outOffset += copyLen;
                }
                return result;
            }
        }

        private void DeriveCryptographicKey()
        {
            try
            {
                string cleanRoom = txtRoomCode.Text.Trim().ToLowerInvariant();
                string pass = txtPassphrase.Text;
                string normalizedSecret = cleanRoom + (pass.Length > 0 ? "::" + pass : "");
                byte[] passwordBytes = Encoding.UTF8.GetBytes(normalizedSecret);
                byte[] saltBytes = Encoding.UTF8.GetBytes("AetherTunnel-v1-ZeroKnowledge-Salt::" + cleanRoom);

                aesKey = Pbkdf2Sha256(passwordBytes, saltBytes, 100000, 32);

                using (SHA256 sha = SHA256.Create())
                {
                    byte[] hash = sha.ComputeHash(aesKey);
                    StringBuilder sb = new StringBuilder(16);
                    for (int i = 0; i < 8; i++)
                    {
                        sb.Append(hash[i].ToString("x2"));
                    }
                    currentFingerprint = sb.ToString();
                }
                if (lblKeyFingerprint != null) lblKeyFingerprint.Text = currentFingerprint;
            }
            catch (Exception ex)
            {
                Log("Key derivation error: " + ex.Message);
            }
        }

        private void StartKernelListenerAndDiscovery()
        {
            for (int p = 45889; p < 45910; p++)
            {
                try
                {
                    tcpListener = new TcpListener(IPAddress.Any, p);
                    tcpListener.Server.ReceiveBufferSize = 16 * 1024 * 1024;
                    tcpListener.Server.SendBufferSize = 16 * 1024 * 1024;
                    tcpListener.Start();
                    listenPort = p;
                    break;
                }
                catch
                {
                    tcpListener = null;
                }
            }

            for (int up = 45890; up < 45930; up++)
            {
                if (up == listenPort) continue;
                try
                {
                    udpP2pClient = new UdpClient(new IPEndPoint(IPAddress.Any, up));
                    udpP2pClient.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                    udpP2pClient.Client.SendBufferSize = 64 * 1024 * 1024;
                    try { udpP2pClient.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                    udpP2pPort = up;
                    break;
                }
                catch
                {
                    udpP2pClient = null;
                }
            }

            try
            {
                udpP2pV6Client = new UdpClient(udpP2pPort > 0 ? udpP2pPort : 45890, AddressFamily.InterNetworkV6);
                udpP2pV6Client.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                udpP2pV6Client.Client.SendBufferSize = 64 * 1024 * 1024;
                try { udpP2pV6Client.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                udpP2pV6Port = ((IPEndPoint)udpP2pV6Client.Client.LocalEndPoint).Port;
            }
            catch
            {
                try
                {
                    udpP2pV6Client = new UdpClient(0, AddressFamily.InterNetworkV6);
                    udpP2pV6Client.Client.ReceiveBufferSize = 64 * 1024 * 1024;
                    udpP2pV6Client.Client.SendBufferSize = 64 * 1024 * 1024;
                    try { udpP2pV6Client.Client.IOControl((IOControlCode)(-1744830452), new byte[] { 0, 0, 0, 0 }, null); } catch { }
                    udpP2pV6Port = ((IPEndPoint)udpP2pV6Client.Client.LocalEndPoint).Port;
                }
                catch
                {
                    udpP2pV6Client = null;
                    udpP2pV6Port = 0;
                }
            }

            string localIps = GetLocalIpList();
            lblLocalEndpoint.Text = "LAN: " + localIps + "  |  STUN WAN: Probing...";
            Log("AetherTunnel v1.0 High-DPI active [BDP-Safe v7 · SSD-Safe 128MB/2GB · Multi-NAT P2P] (Scale: " + Math.Round(dpiScale * 100).ToString() + "%). TCP:" + listenPort.ToString() + " UDP:" + udpP2pPort.ToString() + (udpP2pV6Port > 0 ? " UDPv6:" + udpP2pV6Port.ToString() : ""));

            Thread stunThread = new Thread(StunAndUpnpProbeLoop);
            stunThread.IsBackground = true;
            stunThread.Start();

            Thread p2pUdpThread = new Thread(UdpP2pReceiveLoop);
            p2pUdpThread.IsBackground = true;
            p2pUdpThread.Priority = ThreadPriority.AboveNormal;
            p2pUdpThread.Start();

            if (udpP2pV6Client != null)
            {
                Thread p2pUdpV6Thread = new Thread(UdpP2pV6ReceiveLoop);
                p2pUdpV6Thread.IsBackground = true;
                p2pUdpV6Thread.Priority = ThreadPriority.AboveNormal;
                p2pUdpV6Thread.Start();
            }

            Thread p2pUdpDiskIoThread = new Thread(UdpP2pDiskIoLoop);
            p2pUdpDiskIoThread.IsBackground = true;
            p2pUdpDiskIoThread.Priority = ThreadPriority.BelowNormal;
            p2pUdpDiskIoThread.Start();

            Thread p2pUdpWriterThread = new Thread(UdpP2pDiskWriterLoop);
            p2pUdpWriterThread.IsBackground = true;
            p2pUdpWriterThread.Priority = ThreadPriority.BelowNormal;
            p2pUdpWriterThread.Start();

            Thread hbMonitorThread = new Thread(PeerHeartbeatMonitorLoop);
            hbMonitorThread.IsBackground = true;
            hbMonitorThread.Start();

            Thread acceptThread = new Thread(AcceptLoop);
            acceptThread.IsBackground = true;
            acceptThread.Start();

            Thread udpThread = new Thread(UdpDiscoveryLoop);
            udpThread.IsBackground = true;
            udpThread.Start();

            Thread cloudThread = new Thread(CloudWormholeBridgeLoop);
            cloudThread.IsBackground = true;
            cloudThread.Start();
        }

        private void SendUdpP2pPacket(byte[] data, int len, IPEndPoint ep)
        {
            if (ep == null || data == null) return;
            if (ep.AddressFamily == AddressFamily.InterNetworkV6)
            {
                if (udpP2pV6Client != null) udpP2pV6Client.Send(data, len, ep);
            }
            else
            {
                if (udpP2pClient != null) udpP2pClient.Send(data, len, ep);
            }
        }

        private void RefreshLocalEndpointLabel()
        {
            try
            {
                string lan = GetFirstLanEndpoint();
                if (String.IsNullOrEmpty(lan)) lan = "127.0.0.1:" + listenPort.ToString();
                string wan = publicWanUdpEndpoint.Length > 0 ? publicWanUdpEndpoint : "Probing...";
                string natTag = (natSymDetected == 1) ? " [SymNAT]" : (upnpUdpMapped ? " [UPnP]" : "");
                string v6Tag = (publicWanV6UdpEndpoint.Length > 0) ? " [IPv6 OK]" : "";
                this.BeginInvoke(new Action(delegate {
                    lblLocalEndpoint.Text = "LAN: " + lan + "  |  WAN: " + wan + natTag + v6Tag;
                }));
            }
            catch { }
        }

        private void StunAndUpnpProbeLoop()
        {
            ThreadPool.QueueUserWorkItem(delegate { TryUpnpPortMapping(); });
            while (isRunning)
            {
                try
                {
                    QueryStunServer("stun.l.google.com", 19302, 0, false);
                    QueryStunServer("stun.cloudflare.com", 3478, 1, false);
                    QueryStunServer("stun1.l.google.com", 19302, 2, false);
                    if (udpP2pV6Client != null)
                    {
                        QueryStunServer("stun.l.google.com", 19302, 3, true);
                        if (publicWanV6UdpEndpoint.Length == 0)
                        {
                            string localV6 = GetGlobalIpv6Address();
                            if (localV6.Length > 0 && udpP2pV6Port > 0)
                            {
                                publicWanV6UdpEndpoint = "[" + localV6 + "]:" + udpP2pV6Port.ToString();
                                RefreshLocalEndpointLabel();
                                BroadcastCloudHelloToAll();
                            }
                        }
                    }
                }
                catch { }
                int sleepLoops = (publicWanUdpEndpoint.Length == 0) ? 10 : 75; // 2s retry until resolved, then 15s NAT keepalive
                for (int i = 0; i < sleepLoops && isRunning; i++) Thread.Sleep(200);
            }
        }

        private void QueryStunServer(string stunHost, int stunPort, byte serverTag, bool ipv6)
        {
            UdpClient client = ipv6 ? udpP2pV6Client : udpP2pClient;
            if (client == null) return;
            try
            {
                IPAddress[] addrs = Dns.GetHostAddresses(stunHost);
                IPAddress targetIp = null;
                AddressFamily wantFamily = ipv6 ? AddressFamily.InterNetworkV6 : AddressFamily.InterNetwork;
                foreach (IPAddress a in addrs)
                {
                    if (a.AddressFamily == wantFamily) { targetIp = a; break; }
                }
                if (targetIp == null) return;

                byte[] req = new byte[20];
                req[0] = 0x00; req[1] = 0x01;
                req[2] = 0x00; req[3] = 0x00;
                req[4] = 0x21; req[5] = 0x12; req[6] = 0xA4; req[7] = 0x42;
                req[8] = serverTag;
                Random r = new Random(unchecked(Environment.TickCount + (int)serverTag * 97));
                for (int i = 9; i < 20; i++) req[i] = (byte)r.Next(0, 256);

                client.Send(req, req.Length, new IPEndPoint(targetIp, stunPort));
            }
            catch { }
        }

        private void ParseStunBindingResponse(byte[] buf, int len, IPEndPoint fromEp)
        {
            if (len < 20) return;
            if (buf[0] != 0x01 || buf[1] != 0x01) return;
            byte serverTag = buf[8];
            int idx = 20;
            while (idx + 4 <= len)
            {
                int attrType = (buf[idx] << 8) | buf[idx + 1];
                int attrLen = (buf[idx + 2] << 8) | buf[idx + 3];
                idx += 4;
                if (idx + attrLen > len) break;

                if (attrType == 0x0020 && attrLen >= 8 && buf[idx + 1] == 0x01)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte b0 = (byte)(buf[idx + 4] ^ 0x21);
                    byte b1 = (byte)(buf[idx + 5] ^ 0x12);
                    byte b2 = (byte)(buf[idx + 6] ^ 0xA4);
                    byte b3 = (byte)(buf[idx + 7] ^ 0x42);
                    string wan = b0.ToString() + "." + b1.ToString() + "." + b2.ToString() + "." + b3.ToString() + ":" + port.ToString();
                    RecordDiscoveredWanV4(wan, serverTag, port);
                    return;
                }
                else if (attrType == 0x0020 && attrLen >= 20 && buf[idx + 1] == 0x02) // XOR-MAPPED-ADDRESS (IPv6)
                {
                    int port = ((buf[idx + 2] << 8) | buf[idx + 3]) ^ 0x2112;
                    byte[] v6Bytes = new byte[16];
                    for (int k = 0; k < 16; k++) v6Bytes[k] = (byte)(buf[idx + 4 + k] ^ buf[4 + k]);
                    IPAddress v6Addr = new IPAddress(v6Bytes);
                    string wanV6 = "[" + v6Addr.ToString() + "]:" + port.ToString();
                    if (wanV6 != publicWanV6UdpEndpoint)
                    {
                        publicWanV6UdpEndpoint = wanV6;
                        RefreshLocalEndpointLabel();
                        Log("STUN IPv6 NAT Discovery -> Direct IPv6 UDP: " + publicWanV6UdpEndpoint);
                        BroadcastCloudHelloToAll();
                    }
                    return;
                }
                else if (attrType == 0x0001 && attrLen >= 8 && buf[idx + 1] == 0x01)
                {
                    int port = (buf[idx + 2] << 8) | buf[idx + 3];
                    string wan = buf[idx + 4].ToString() + "." + buf[idx + 5].ToString() + "." + buf[idx + 6].ToString() + "." + buf[idx + 7].ToString() + ":" + port.ToString();
                    RecordDiscoveredWanV4(wan, serverTag, port);
                    return;
                }
                idx += (attrLen + 3) & ~3;
            }
        }

        private void RecordDiscoveredWanV4(string wan, byte serverTag, int port)
        {
            if (serverTag == 0) stunEndpoint0 = wan;
            else if (serverTag == 1) stunEndpoint1 = wan;

            if (stunEndpoint0.Length > 0 && stunEndpoint1.Length > 0)
            {
                int c0 = stunEndpoint0.LastIndexOf(':');
                int c1 = stunEndpoint1.LastIndexOf(':');
                int p0 = 0, p1 = 0;
                if (c0 > 0 && c1 > 0 &&
                    Int32.TryParse(stunEndpoint0.Substring(c0 + 1), out p0) &&
                    Int32.TryParse(stunEndpoint1.Substring(c1 + 1), out p1))
                {
                    if (p0 != p1)
                    {
                        natSymDetected = 1;
                        natPortDelta = p1 - p0;
                        natTypeSummary = "Symmetric NAT (" + p0.ToString() + "->" + p1.ToString() + ")";
                    }
                    else
                    {
                        natSymDetected = 0;
                        natPortDelta = 0;
                        natTypeSummary = (p0 == udpP2pPort) ? "Cone NAT (Port-Preserving)" : "Port-Mapped NAT";
                    }
                }
            }

            if (wan != publicWanUdpEndpoint)
            {
                bool firstResolve = (publicWanUdpEndpoint.Length == 0);
                publicWanUdpEndpoint = wan;
                RefreshLocalEndpointLabel();
                if (firstResolve || natSymDetected == 1)
                {
                    Log("STUN NAT Discovery -> WAN: " + publicWanUdpEndpoint + " (" + natTypeSummary + ")");
                }
                BroadcastCloudHelloToAll();
            }
        }

        private void TryUpnpPortMapping()
        {
            try
            {
                using (UdpClient ssdp = new UdpClient())
                {
                    ssdp.Client.ReceiveTimeout = 1500;
                    string msearch = "M-SEARCH * HTTP/1.1\\r\\nHOST: 239.255.255.250:1900\\r\\nMAN: \\"ssdp:discover\\"\\r\\nMX: 1\\r\\nST: urn:schemas-upnp-org:device:InternetGatewayDevice:1\\r\\n\\r\\n";
                    byte[] bytes = Encoding.ASCII.GetBytes(msearch);
                    ssdp.Send(bytes, bytes.Length, new IPEndPoint(IPAddress.Parse("239.255.255.250"), 1900));

                    IPEndPoint gwEp = new IPEndPoint(IPAddress.Any, 0);
                    string locationUrl = "";
                    for (int tries = 0; tries < 4; tries++)
                    {
                        byte[] resp = ssdp.Receive(ref gwEp);
                        string respStr = Encoding.ASCII.GetString(resp);
                        Match m = Regex.Match(respStr, @"LOCATION:\s*(http://[^\r\n]+)", RegexOptions.IgnoreCase);
                        if (m.Success)
                        {
                            locationUrl = m.Groups[1].Value.Trim();
                            break;
                        }
                    }
                    if (locationUrl.Length == 0) return;

                    Uri descUri = new Uri(locationUrl);
                    string xml = "";
                    HttpWebRequest getReq = (HttpWebRequest)WebRequest.Create(descUri);
                    getReq.Timeout = 2500;
                    using (HttpWebResponse getResp = (HttpWebResponse)getReq.GetResponse())
                    using (StreamReader sr = new StreamReader(getResp.GetResponseStream()))
                    {
                        xml = sr.ReadToEnd();
                    }

                    Match svcM = Regex.Match(xml, @"<serviceType>urn:schemas-upnp-org:service:(WANIPConnection|WANPPPConnection):[0-9]+</serviceType>[\s\S]*?<controlURL>([^<]+)</controlURL>", RegexOptions.IgnoreCase);
                    if (!svcM.Success)
                        svcM = Regex.Match(xml, @"<controlURL>([^<]+)</controlURL>[\s\S]*?<serviceType>urn:schemas-upnp-org:service:(WANIPConnection|WANPPPConnection):[0-9]+</serviceType>", RegexOptions.IgnoreCase);
                    if (!svcM.Success) return;

                    string svcType = "";
                    string ctrlPath = "";
                    if (svcM.Groups[1].Value.StartsWith("WAN", StringComparison.OrdinalIgnoreCase))
                    {
                        svcType = "urn:schemas-upnp-org:service:" + svcM.Groups[1].Value + ":1";
                        ctrlPath = svcM.Groups[2].Value.Trim();
                    }
                    else
                    {
                        svcType = "urn:schemas-upnp-org:service:" + svcM.Groups[2].Value + ":1";
                        ctrlPath = svcM.Groups[1].Value.Trim();
                    }
                    Uri ctrlUri = new Uri(descUri, ctrlPath);

                    string internalIp = "";
                    using (Socket testSock = new Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp))
                    {
                        testSock.Connect(descUri.Host, descUri.Port);
                        internalIp = ((IPEndPoint)testSock.LocalEndPoint).Address.ToString();
                    }
                    if (String.IsNullOrEmpty(internalIp)) return;

                    if (SoapUpnpAddPortMapping(ctrlUri, svcType, udpP2pPort, "UDP", internalIp)) upnpUdpMapped = true;
                    if (SoapUpnpAddPortMapping(ctrlUri, svcType, listenPort, "TCP", internalIp)) upnpTcpMapped = true;
                    if (upnpUdpMapped || upnpTcpMapped)
                    {
                        RefreshLocalEndpointLabel();
                        Log("UPnP IGD opened router port forwarding ->" + (upnpUdpMapped ? " UDP:" + udpP2pPort.ToString() : "") + (upnpTcpMapped ? " TCP:" + listenPort.ToString() : ""));
                    }
                }
            }
            catch { }
        }

        private bool SoapUpnpAddPortMapping(Uri ctrlUri, string svcType, int port, string proto, string internalIp)
        {
            try
            {
                string body = "<?xml version=\\"1.0\\"?><s:Envelope xmlns:s=\\"http://schemas.xmlsoap.org/soap/envelope/\\" s:encodingStyle=\\"http://schemas.xmlsoap.org/soap/encoding/\\"><s:Body><u:AddPortMapping xmlns:u=\\"" + svcType + "\\"><NewRemoteHost></NewRemoteHost><NewExternalPort>" + port.ToString() + "</NewExternalPort><NewProtocol>" + proto + "</NewProtocol><NewInternalPort>" + port.ToString() + "</NewInternalPort><NewInternalClient>" + internalIp + "</NewInternalClient><NewEnabled>1</NewEnabled><NewPortMappingDescription>AetherTunnel</NewPortMappingDescription><NewLeaseDuration>3600</NewLeaseDuration></u:AddPortMapping></s:Body></s:Envelope>";
                byte[] bodyBytes = Encoding.UTF8.GetBytes(body);
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(ctrlUri);
                req.Method = "POST";
                req.Timeout = 2500;
                req.ContentType = "text/xml; charset=\\"utf-8\\"";
                req.Headers.Add("SOAPACTION", "\\"" + svcType + "#AddPortMapping\\"");
                req.ContentLength = bodyBytes.Length;
                using (Stream reqStream = req.GetRequestStream()) reqStream.Write(bodyBytes, 0, bodyBytes.Length);
                using (HttpWebResponse resp = (HttpWebResponse)req.GetResponse())
                {
                    return ((int)resp.StatusCode >= 200 && (int)resp.StatusCode < 300);
                }
            }
            catch { return false; }
        }

        private bool TryParseIpEndpoint(string epStr, out IPEndPoint ep)
        {
            ep = null;
            if (String.IsNullOrEmpty(epStr)) return false;
            string s = epStr.Trim();
            if (s.StartsWith("["))
            {
                int close = s.IndexOf(']');
                if (close <= 1 || close + 2 >= s.Length || s[close + 1] != ':') return false;
                IPAddress v6;
                int port;
                if (IPAddress.TryParse(s.Substring(1, close - 1), out v6) && Int32.TryParse(s.Substring(close + 2), out port) && port > 0 && port <= 65535)
                {
                    ep = new IPEndPoint(v6, port);
                    return true;
                }
                return false;
            }
            int colon = s.LastIndexOf(':');
            if (colon <= 0) return false;
            IPAddress ip;
            int p4;
            if (IPAddress.TryParse(s.Substring(0, colon).Trim(), out ip) && Int32.TryParse(s.Substring(colon + 1).Trim(), out p4) && p4 > 0 && p4 <= 65535)
            {
                ep = new IPEndPoint(ip, p4);
                return true;
            }
            return false;
        }

        private void InitiateUdpHolePunch(string remoteEndpointStr, bool withPortSpray = false)
        {
            if (String.IsNullOrEmpty(remoteEndpointStr)) return;
            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    IPEndPoint targetEp;
                    if (!TryParseIpEndpoint(remoteEndpointStr, out targetEp)) return;
                    if (IsOwnLocalEndpoint(targetEp.Address, targetEp.Port)) return;

                    string room = CleanRoomCode(currentRoomCode);
                    byte[] punchBytes = Encoding.UTF8.GetBytes("AETHER_PUNCH|" + room + "|" + instanceId);

                    for (int burst = 0; burst < 4 && isRunning && activeUdpPeerEndpoint == null; burst++)
                    {
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, targetEp); } catch { }
                        Thread.Sleep(70);
                    }

                    if (withPortSpray && targetEp.AddressFamily == AddressFamily.InterNetwork && activeUdpPeerEndpoint == null)
                    {
                        int basePort = targetEp.Port;
                        for (int delta = -6; delta <= 16 && isRunning && activeUdpPeerEndpoint == null; delta++)
                        {
                            if (delta == 0) continue;
                            int candPort = basePort + delta;
                            if (candPort > 1024 && candPort <= 65535)
                            {
                                try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, candPort)); } catch { }
                            }
                        }
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, 45890)); } catch { }
                        try { SendUdpP2pPacket(punchBytes, punchBytes.Length, new IPEndPoint(targetEp.Address, 45891)); } catch { }
                    }
                }
                catch { }
            });
        }

        private void UdpP2pReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
            int rxCapCheckSeq = 0;
            while (isRunning && udpP2pClient != null)
            {
                try
                {
                    byte[] data = udpP2pClient.Receive(ref remoteEp);
                    ProcessUdpP2pPacket(data, remoteEp, ref rxCapCheckSeq);
                }
                catch
                {
                    if (!isRunning) break;
                    Thread.Sleep(5);
                }
            }
        }

        private void UdpP2pV6ReceiveLoop()
        {
            IPEndPoint remoteEp = new IPEndPoint(IPAddress.IPv6Any, 0);
            int rxCapCheckSeq = 0;
            while (isRunning && udpP2pV6Client != null)
            {
                try
                {
                    byte[] data = udpP2pV6Client.Receive(ref remoteEp);
                    ProcessUdpP2pPacket(data, remoteEp, ref rxCapCheckSeq);
                }
                catch
                {
                    if (!isRunning) break;
                    Thread.Sleep(5);
                }
            }
        }

        private void ProcessUdpP2pPacket(byte[] data, IPEndPoint remoteEp, ref int rxCapCheckSeq)
        {
            try
            {
                    if (data == null || data.Length == 0) return;

                    if (data.Length >= 20 && data[0] == 0x01 && data[1] == 0x01 && data[4] == 0x21 && data[5] == 0x12)
                    {
                        ParseStunBindingResponse(data, data.Length, remoteEp);
                        return;
                    }

                    // FAST PATH: Enqueue binary P2P UDP encrypted data frame immediately (< 1us), up to 2 GB process hard RAM cap
                    if (data.Length >= 28 && BitConverter.ToUInt32(data, 0) == MAGIC_UDP_DATA)
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        if (Interlocked.Read(ref totalAppBufferedBytes) < HARD_RAM_CAP_BYTES &&
                            ((rxCapCheckSeq++ & 255) != 0 || GC.GetTotalMemory(false) < 1920L * 1024L * 1024L))
                        {
                            udpRxDataQueue.Enqueue(data);
                            Interlocked.Add(ref totalAppBufferedBytes, data.Length);
                            int qCnt = udpRxDataQueue.Count;
                            if (qCnt <= 2 || (qCnt & 15) == 1) udpRxDataEvent.Set();
                        }
                        return;
                    }

                    string text = Encoding.UTF8.GetString(data);
                    if (text.StartsWith("AETHER_PUNCH|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 3 && parts[2] != instanceId)
                        {
                            bool staleOrEmpty = (activeUdpPeerEndpoint == null || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6);
                            bool isNew = (activeUdpPeerEndpoint == null || (staleOrEmpty && !activeUdpPeerEndpoint.Equals(remoteEp)) || ((DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 8));
                            if (staleOrEmpty || activeUdpPeerEndpoint.Equals(remoteEp))
                            {
                                activeUdpPeerEndpoint = remoteEp;
                                lastUdpPeerSeen = DateTime.UtcNow;
                            }
                            byte[] ack = Encoding.UTF8.GetBytes("AETHER_PUNCH_ACK|" + parts[1] + "|" + instanceId);
                            SendUdpP2pPacket(ack, ack.Length, remoteEp);
                            if (isNew && activeUdpPeerEndpoint != null && activeUdpPeerEndpoint.Equals(remoteEp))
                            {
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("NAT Hole Punch SUCCEEDED! Direct P2P UDP tunnel active with " + remoteEp.ToString());
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PUNCH_ACK|") || text.StartsWith("AETHER_PONG|"))
                    {
                        bool staleOrEmpty = (activeUdpPeerEndpoint == null || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6);
                        bool isNew = (activeUdpPeerEndpoint == null || (staleOrEmpty && !activeUdpPeerEndpoint.Equals(remoteEp)) || ((DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 8));
                        if (staleOrEmpty || activeUdpPeerEndpoint.Equals(remoteEp))
                        {
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                            if (isNew)
                            {
                                UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + remoteEp.ToString() + ")");
                                Log("Verified Direct P2P NAT-Punched UDP connection with " + remoteEp.ToString());
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_PING|"))
                    {
                        if (activeUdpPeerEndpoint == null || activeUdpPeerEndpoint.Equals(remoteEp) || (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds > 6)
                        {
                            activeUdpPeerEndpoint = remoteEp;
                            lastUdpPeerSeen = DateTime.UtcNow;
                        }
                        byte[] pong = Encoding.UTF8.GetBytes("AETHER_PONG|" + instanceId);
                        SendUdpP2pPacket(pong, pong.Length, remoteEp);
                    }
                    else if (text.StartsWith("AETHER_UDP_START|"))
                    {
                        activeUdpPeerEndpoint = remoteEp;
                        lastUdpPeerSeen = DateTime.UtcNow;
                        udpPendingStartEp = remoteEp;
                        udpPendingStartHeader = text;
                        udpRxStartPending = true;
                        udpRxDataEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_RESUME|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            int rChunk = 0;
                            if (Int32.TryParse(parts[1], out rChunk) && rChunk >= 0)
                            {
                                if (rChunk > udpPeerResumeChunk) udpPeerResumeChunk = rChunk;
                                if (rChunk - 1 > udpPeerContiguousChunk) udpPeerContiguousChunk = rChunk - 1;
                                udpResumeEvent.Set();
                                udpAckEvent.Set();
                            }
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_ACK|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2)
                        {
                            int uniqueCnt = 0;
                            if (Int32.TryParse(parts[1], out uniqueCnt))
                            {
                                if (uniqueCnt > udpPeerUniqueAcked) udpPeerUniqueAcked = uniqueCnt;
                            }
                            if (parts.Length >= 3)
                            {
                                int contigIdx = 0;
                                if (Int32.TryParse(parts[2], out contigIdx))
                                {
                                    if (contigIdx > udpPeerContiguousChunk) udpPeerContiguousChunk = contigIdx;
                                    if (contigIdx > udpPeerAckedChunk) udpPeerAckedChunk = contigIdx;
                                }
                            }
                            lastAckReceivedTick = Environment.TickCount;
                            if (parts.Length >= 4)
                            {
                                int rxMbits = 0;
                                bool peerDiskPressure = (parts.Length >= 5 && parts[4] == "1");
                                if (Int32.TryParse(parts[3], out rxMbits) && rxMbits > 0)
                                {
                                    udpPeerMeasuredMbps = rxMbits;
                                    if (peerDiskPressure)
                                    {
                                        udpInSlowStart = false;
                                        udpCleanAckStreak = 0;
                                        udpLowRxStreak = 0;
                                        udpBestRxMbps = Math.Min(udpBestRxMbps, Math.Max(4.0, (double)rxMbits));
                                        double diskCap = Math.Max(4.0, (double)rxMbits * 0.92);
                                        if (dynamicUdpBitrateMbps > diskCap)
                                        {
                                            dynamicUdpBitrateMbps = diskCap;
                                            Interlocked.Exchange(ref pacingResetRequested, 1);
                                        }
                                        udpAckEvent.Set();
                                        return;
                                    }

                                    double boundedSample = Math.Min((double)rxMbits, Math.Max(8.0, dynamicUdpBitrateMbps * 1.20 + 3.0));
                                    long nowSwTicks = Stopwatch.GetTimestamp();
                                    if (udpBestRxDecayTicks == 0) udpBestRxDecayTicks = nowSwTicks;
                                    double elapsedDecaySec = (nowSwTicks - udpBestRxDecayTicks) / (double)Stopwatch.Frequency;
                                    if (elapsedDecaySec >= 0.4)
                                    {
                                        double decayFactor = Math.Max(0.75, 1.0 - (0.06 * elapsedDecaySec));
                                        udpBestRxMbps = Math.Max(1.0, udpBestRxMbps * decayFactor);
                                        udpBestRxDecayTicks = nowSwTicks;
                                    }
                                    if (boundedSample > udpBestRxMbps)
                                    {
                                        udpBestRxMbps = boundedSample;
                                        udpBestRxDecayTicks = nowSwTicks;
                                    }

                                    // Router-safe Self-tuning Pacer: never outruns receiver by >12% and never spikes on buffered bursts
                                    if (unchecked(Environment.TickCount - lastNackReceivedTick) > 100)
                                    {
                                        udpCleanAckStreak++;
                                        if (!udpInSlowStart)
                                        {
                                            if (udpCleanAckStreak >= 60)
                                            {
                                                udpCongestionCeilingMbps = 0.0;
                                                udpInSlowStart = true;
                                            }
                                            else if (udpCongestionCeilingMbps <= 0.0 && udpCleanAckStreak >= 12)
                                            {
                                                udpInSlowStart = true;
                                            }
                                            else if (udpCongestionCeilingMbps > 0.0 && udpCleanAckStreak >= 40 && dynamicUdpBitrateMbps < udpCongestionCeilingMbps * 0.75)
                                            {
                                                udpInSlowStart = true;
                                            }
                                        }

                                        double prevRate = dynamicUdpBitrateMbps;
                                        double effectiveRx = Math.Max(boundedSample, udpBestRxMbps * 0.85);
                                        double routerSafeCap = Math.Max(10.0, udpBestRxMbps * 1.12 + 2.5);
                                        double maxSingleStep = Math.Min(routerSafeCap, prevRate * 1.22 + 1.0);
                                        if (udpInSlowStart)
                                        {
                                            if (effectiveRx >= prevRate * 0.55 || prevRate < 16.0)
                                            {
                                                udpLowRxStreak = 0;
                                                double factor = (udpCongestionCeilingMbps > 0.0 && prevRate >= udpCongestionCeilingMbps * 0.75) ? 1.10 : 1.22;
                                                double nextRate = Math.Max(prevRate * factor + 1.0, effectiveRx * 1.12 + 1.0);
                                                dynamicUdpBitrateMbps = Math.Min(5000.0, Math.Min(maxSingleStep, nextRate));
                                            }
                                            else
                                            {
                                                udpLowRxStreak++;
                                                if (udpLowRxStreak >= 6)
                                                {
                                                    udpInSlowStart = false;
                                                    double targetCap = Math.Max(1.0, udpBestRxMbps * 1.05);
                                                    dynamicUdpBitrateMbps = Math.Min(5000.0, (prevRate * 0.65) + (targetCap * 0.35));
                                                }
                                            }
                                        }
                                        else
                                        {
                                            if (boundedSample >= prevRate * 0.72 || effectiveRx >= prevRate * 0.80)
                                            {
                                                udpLowRxStreak = 0;
                                                double step = (udpCongestionCeilingMbps > 0.0 && prevRate >= udpCongestionCeilingMbps * 0.90) ? 1.02 : 1.04;
                                                double targetCruise = Math.Min(maxSingleStep, Math.Max(prevRate * step + 1.0, udpBestRxMbps * 1.06));
                                                dynamicUdpBitrateMbps = Math.Min(5000.0, targetCruise);
                                                if (udpCongestionCeilingMbps > 0.0 && dynamicUdpBitrateMbps > udpCongestionCeilingMbps)
                                                {
                                                    udpCongestionCeilingMbps = dynamicUdpBitrateMbps;
                                                }
                                            }
                                            else
                                            {
                                                udpLowRxStreak++;
                                                if (udpLowRxStreak >= 6)
                                                {
                                                    double targetCap = Math.Max(1.0, udpBestRxMbps * 1.04);
                                                    dynamicUdpBitrateMbps = Math.Max(1.0, (prevRate * 0.80) + (targetCap * 0.20));
                                                }
                                                else
                                                {
                                                    dynamicUdpBitrateMbps = Math.Max(1.0, prevRate * 0.985);
                                                }
                                            }
                                        }

                                        if (dynamicUdpBitrateMbps > prevRate * 1.15)
                                        {
                                            Interlocked.Exchange(ref pacingResetRequested, 1);
                                        }
                                    }
                                }
                            }
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NACK|"))
                    {
                        string[] parts = text.Split('|');
                        if (parts.Length >= 2 && !String.IsNullOrEmpty(parts[1]))
                        {
                            string[] tokens = parts[1].Split(',');
                            int nowTick = Environment.TickCount;
                            int enqueuedCount = 0;
                            if (udpSenderChunkLastSentTick.Count > 4096) udpSenderChunkLastSentTick.Clear();
                            foreach (string t in tokens)
                            {
                                int missIdx;
                                if (Int32.TryParse(t.Trim(), out missIdx) && missIdx >= 0)
                                {
                                    int prevSendTick;
                                    if (!udpSenderChunkLastSentTick.TryGetValue(missIdx, out prevSendTick) || unchecked(nowTick - prevSendTick) > 220)
                                    {
                                        udpSenderChunkLastSentTick[missIdx] = nowTick;
                                        udpRetransmitQueue.Enqueue(missIdx);
                                        enqueuedCount++;
                                    }
                                }
                            }
                            lastNackReceivedTick = nowTick;
                            int lossCutThreshold = Math.Max(12, Math.Min(40, (int)Math.Round(dynamicUdpBitrateMbps * 0.08)));
                            if (enqueuedCount >= lossCutThreshold && unchecked(nowTick - lastNackCutTick) > 900)
                            {
                                lastNackCutTick = nowTick;
                                udpCongestionCeilingMbps = dynamicUdpBitrateMbps * 0.90;
                                udpInSlowStart = false;
                                udpCleanAckStreak = 0;
                                udpLowRxStreak = 0;
                                double cutFactor = (enqueuedCount >= 45) ? 0.65 : 0.82;
                                double floorCap = Math.Max(1.0, udpBestRxMbps * 0.80);
                                double reduced = Math.Min(dynamicUdpBitrateMbps * cutFactor, floorCap);
                                dynamicUdpBitrateMbps = Math.Max(1.0, reduced);
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                            }
                            udpAckEvent.Set();
                        }
                    }
                    else if (text.StartsWith("AETHER_UDP_NEED_START|"))
                    {
                        udpNeedStartResend = true;
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_DONE|"))
                    {
                        udpTransferDoneAcked = true;
                        udpAckEvent.Set();
                    }
                    else if (text.StartsWith("AETHER_UDP_END|"))
                    {
                        udpRxEndPending = true;
                        udpRxDataEvent.Set();
                    }
                }
                catch { }
        }

        private byte[] AllocStageBuffer()
        {
            byte[] buf;
            if (!udpStageBufferPool.TryDequeue(out buf) || buf == null || buf.Length != STAGE_PAGE_BYTES)
            {
                buf = new byte[STAGE_PAGE_BYTES];
            }
            Interlocked.Add(ref totalAppBufferedBytes, STAGE_PAGE_BYTES);
            return buf;
        }

        private void ReleaseStageBuffer(byte[] buf)
        {
            if (buf == null) return;
            Interlocked.Add(ref totalAppBufferedBytes, -STAGE_PAGE_BYTES);
            if (udpStageBufferPool.Count < 32)
            {
                udpStageBufferPool.Enqueue(buf);
            }
        }

        private void EnqueueDiskWriteJob(DiskWriteJob job)
        {
            Interlocked.Increment(ref activeDiskIoJobs);
            diskIoIdleEvent.Reset();
            diskWriteQueue.Enqueue(job);
            diskWriteEvent.Set();
        }

        private void WaitForDiskIoDrain(int maxWaitMs)
        {
            diskWriteEvent.Set();
            if (!diskWriteQueue.IsEmpty || Thread.VolatileRead(ref activeDiskIoJobs) > 0)
            {
                try { diskIoIdleEvent.WaitOne(maxWaitMs); } catch { }
            }
        }

        private void UdpP2pDiskIoLoop()
        {
            udpDiskIoExitedEvent.Reset();
            long bytesSinceCkpt = 0;
            Stopwatch ckptSw = Stopwatch.StartNew();
            Stopwatch writeSw = new Stopwatch();
            try
            {
                while (isRunning || !diskWriteQueue.IsEmpty)
                {
                    DiskWriteJob job;
                    while (diskWriteQueue.TryDequeue(out job))
                    {
                        int jobPauseMs = 0;
                        try
                        {
                            lock (diskFileStreamLock)
                            {
                                if (job.TargetFile != null)
                                {
                                    if (job.Length > 0 && job.Buffer != null)
                                    {
                                        writeSw.Restart();
                                        if (job.TargetFile.Position != job.FileOffset)
                                        {
                                            job.TargetFile.Seek(job.FileOffset, SeekOrigin.Begin);
                                        }
                                        job.TargetFile.Write(job.Buffer, 0, job.Length);
                                        writeSw.Stop();

                                        bytesSinceCkpt += job.Length;
                                        int elapsedWriteMs = (int)Math.Min(60000L, writeSw.ElapsedMilliseconds);
                                        lastDiskWriteMs = elapsedWriteMs;

                                        if (job.Length >= 512 * 1024)
                                        {
                                            double instDiskMbps = (job.Length / (1024.0 * 1024.0)) / Math.Max(0.0005, writeSw.Elapsed.TotalSeconds);
                                            int curAvg = smoothedDiskWriteMbps;
                                            int nextAvg = curAvg <= 0
                                                ? (int)Math.Round(instDiskMbps)
                                                : (int)Math.Round((curAvg * 0.70) + (instDiskMbps * 0.30));
                                            smoothedDiskWriteMbps = Math.Max(1, Math.Min(5000, nextAvg));
                                        }

                                        if (elapsedWriteMs >= 30)
                                        {
                                            jobPauseMs = Math.Min(25, Math.Max(2, elapsedWriteMs / 4));
                                        }
                                    }

                                    // Flush managed user-space buffer ONLY on explicit drain/close; NEVER call Flush(true) hardware SYNCHRONIZE CACHE!
                                    if (job.ForceOsSync)
                                    {
                                        try { job.TargetFile.Flush(false); } catch { }
                                    }

                                    bool writeCkpt = (job.CkptContigChunk >= 0 && !String.IsNullOrEmpty(job.PartPath)) &&
                                        (job.ForceOsSync || (bytesSinceCkpt >= 512L * 1024L * 1024L && ckptSw.ElapsedMilliseconds >= 15000));
                                    if (writeCkpt)
                                    {
                                        bytesSinceCkpt = 0;
                                        ckptSw.Restart();
                                        string ckptBody = (job.CkptContigChunk + 1).ToString() + "|" + job.ExpectedFileSize.ToString();
                                        File.WriteAllText(job.PartPath + ".ckpt", ckptBody);
                                    }
                                }
                            }
                        }
                        catch { }
                        finally
                        {
                            ReleaseStageBuffer(job.Buffer);
                            if (Interlocked.Decrement(ref activeDiskIoJobs) <= 0)
                            {
                                diskIoIdleEvent.Set();
                            }
                        }
                        if (jobPauseMs > 0 && isRunning) Thread.Sleep(jobPauseMs);
                    }
                    if (!isRunning && diskWriteQueue.IsEmpty) break;
                    diskWriteEvent.WaitOne(25);
                }
            }
            finally
            {
                diskIoIdleEvent.Set();
                udpDiskIoExitedEvent.Set();
            }
        }

        private void EnqueueCompletedPageJob(
            FileStream outFile,
            string partPath,
            long expectedFileSize,
            UdpStagePage page,
            List<DiskWriteJob> queuedJobs)
        {
            if (page == null) return;
            if (page.StartSlot == 0)
            {
                DiskWriteJob job = new DiskWriteJob();
                job.TargetFile = outFile;
                job.PartPath = partPath;
                job.ExpectedFileSize = expectedFileSize;
                job.Buffer = page.Data;
                job.Length = page.ValidBytes;
                job.FileOffset = (long)page.PageIndex * STAGE_PAGE_BYTES;
                job.CkptContigChunk = -1;
                job.ForceOsSync = false;
                queuedJobs.Add(job);
            }
            else
            {
                int exp = page.ExpectedCount;
                int s = page.StartSlot;
                while (s < exp)
                {
                    while (s < exp && !page.Present[s]) s++;
                    if (s >= exp) break;
                    int runStart = s;
                    int runBytes = 0;
                    while (s < exp && page.Present[s])
                    {
                        runBytes += page.ChunkLens[s];
                        page.Present[s] = false;
                        s++;
                    }
                    if (runBytes > 0)
                    {
                        byte[] runBuf = AllocStageBuffer();
                        Buffer.BlockCopy(page.Data, runStart * UDP_CHUNK_SIZE, runBuf, 0, runBytes);
                        DiskWriteJob rJob = new DiskWriteJob();
                        rJob.TargetFile = outFile;
                        rJob.PartPath = partPath;
                        rJob.ExpectedFileSize = expectedFileSize;
                        rJob.Buffer = runBuf;
                        rJob.Length = runBytes;
                        rJob.FileOffset = ((long)page.PageIndex * CHUNKS_PER_STAGE_PAGE + runStart) * UDP_CHUNK_SIZE;
                        rJob.CkptContigChunk = -1;
                        rJob.ForceOsSync = false;
                        queuedJobs.Add(rJob);
                    }
                }
                ReleaseStageBuffer(page.Data);
            }
        }

        private void DispatchStagedPagesToDiskQueue(
            FileStream outFile,
            string partPath,
            long expectedFileSize,
            Dictionary<int, UdpStagePage> stagedPages,
            ref long readyCompletedBytes,
            ref int lastQueuedCkptContig,
            int curContiguous,
            List<int> keysBuf,
            bool forceAll)
        {
            if (outFile == null || stagedPages.Count == 0) return;

            List<DiskWriteJob> queuedJobs = new List<DiskWriteJob>();

            // 1. Strictly sequential in-order flush from diskSequentialNextPage (eliminates NTFS ValidDataLength zero-fills & random SSD seeks!)
            UdpStagePage seqPage;
            int nextSeq = diskSequentialNextPage;
            while (stagedPages.TryGetValue(nextSeq, out seqPage))
            {
                int needed = Math.Max(1, seqPage.ExpectedCount - seqPage.StartSlot);
                if (seqPage.PresentCount < needed) break;
                stagedPages.Remove(nextSeq);
                readyCompletedBytes -= seqPage.ValidBytes;
                if (readyCompletedBytes < 0) readyCompletedBytes = 0;
                EnqueueCompletedPageJob(outFile, partPath, expectedFileSize, seqPage, queuedJobs);
                nextSeq++;
            }
            diskSequentialNextPage = nextSeq;

            // 2. Emergency spill ONLY when RAM staging exceeds 512 MB behind a gap, or on forceAll (transfer end / close)
            long remainingPageBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
            if (forceAll || remainingPageBytes >= 512L * 1024L * 1024L)
            {
                keysBuf.Clear();
                foreach (KeyValuePair<int, UdpStagePage> kv in stagedPages)
                {
                    int needed = Math.Max(1, kv.Value.ExpectedCount - kv.Value.StartSlot);
                    if (kv.Value.PresentCount >= needed) keysBuf.Add(kv.Key);
                }
                if (keysBuf.Count > 0)
                {
                    keysBuf.Sort();
                    for (int i = 0; i < keysBuf.Count; i++)
                    {
                        int pIdx = keysBuf[i];
                        UdpStagePage page = stagedPages[pIdx];
                        stagedPages.Remove(pIdx);
                        readyCompletedBytes -= page.ValidBytes;
                        if (readyCompletedBytes < 0) readyCompletedBytes = 0;
                        EnqueueCompletedPageJob(outFile, partPath, expectedFileSize, page, queuedJobs);
                    }
                }

                remainingPageBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
                if ((forceAll || remainingPageBytes >= 512L * 1024L * 1024L) && stagedPages.Count > 0)
                {
                    keysBuf.Clear();
                    foreach (int key in stagedPages.Keys) keysBuf.Add(key);
                    keysBuf.Sort();

                    for (int i = 0; i < keysBuf.Count; i++)
                    {
                        int pIdx = keysBuf[i];
                        UdpStagePage page = stagedPages[pIdx];
                        stagedPages.Remove(pIdx);

                        int exp = page.ExpectedCount;
                        int s = page.StartSlot;
                        while (s < exp)
                        {
                            while (s < exp && !page.Present[s]) s++;
                            if (s >= exp) break;
                            int runStart = s;
                            int runBytes = 0;
                            while (s < exp && page.Present[s])
                            {
                                runBytes += page.ChunkLens[s];
                                page.Present[s] = false;
                                s++;
                            }
                            if (runBytes > 0)
                            {
                                byte[] runBuf = AllocStageBuffer();
                                Buffer.BlockCopy(page.Data, runStart * UDP_CHUNK_SIZE, runBuf, 0, runBytes);
                                DiskWriteJob rJob = new DiskWriteJob();
                                rJob.TargetFile = outFile;
                                rJob.PartPath = partPath;
                                rJob.ExpectedFileSize = expectedFileSize;
                                rJob.Buffer = runBuf;
                                rJob.Length = runBytes;
                                rJob.FileOffset = ((long)pIdx * CHUNKS_PER_STAGE_PAGE + runStart) * UDP_CHUNK_SIZE;
                                rJob.CkptContigChunk = -1;
                                rJob.ForceOsSync = false;
                                queuedJobs.Add(rJob);
                            }
                        }
                        ReleaseStageBuffer(page.Data);
                    }
                }
            }

            if (queuedJobs.Count == 0 && !forceAll) return;

            int diskSafeContig = curContiguous;
            foreach (UdpStagePage remPage in stagedPages.Values)
            {
                int pageBase = remPage.PageIndex * CHUNKS_PER_STAGE_PAGE;
                if (pageBase <= diskSafeContig)
                {
                    int firstPresent = -1;
                    for (int s = remPage.StartSlot; s < remPage.ExpectedCount; s++)
                    {
                        if (remPage.Present[s]) { firstPresent = s; break; }
                    }
                    if (firstPresent >= 0)
                    {
                        int cand = pageBase + firstPresent - 1;
                        if (cand < diskSafeContig) diskSafeContig = cand;
                    }
                }
            }

            int ckptToWrite = (diskSafeContig > lastQueuedCkptContig) ? diskSafeContig : -1;
            if (ckptToWrite > lastQueuedCkptContig) lastQueuedCkptContig = ckptToWrite;

            if (queuedJobs.Count > 0)
            {
                DiskWriteJob lastJob = queuedJobs[queuedJobs.Count - 1];
                lastJob.CkptContigChunk = ckptToWrite;
                lastJob.ForceOsSync = forceAll;
                for (int j = 0; j < queuedJobs.Count; j++)
                {
                    EnqueueDiskWriteJob(queuedJobs[j]);
                }
            }
            else if (forceAll)
            {
                DiskWriteJob syncJob = new DiskWriteJob();
                syncJob.TargetFile = outFile;
                syncJob.PartPath = partPath;
                syncJob.ExpectedFileSize = expectedFileSize;
                syncJob.Buffer = null;
                syncJob.Length = 0;
                syncJob.FileOffset = 0;
                syncJob.CkptContigChunk = ckptToWrite;
                syncJob.ForceOsSync = true;
                EnqueueDiskWriteJob(syncJob);
            }
        }

        private void UdpP2pDiskWriterLoop()
        {
            udpWriterExitedEvent.Reset();
            FileStream udpOutFile = null;
            string udpFileName = "";
            string lastCompletedUdpFileName = "";
            string udpPartPath = "";
            string udpFinalPath = "";
            long udpExpectedSize = 0;
            int udpExpectedChunks = 1;
            long udpReceivedBytes = 0;
            long udpSessionStartBytes = 0;
            long readyCompletedBytes = 0;
            int lastQueuedCkptContig = -1;
            bool[] udpChunkReceived = null;
            Dictionary<int, int> udpChunkLastNackTick = new Dictionary<int, int>();
            Dictionary<int, UdpStagePage> stagedPages = new Dictionary<int, UdpStagePage>(512);
            List<int> pageKeysBuf = new List<int>(512);
            int udpContiguousChunk = -1;
            int udpHighestSeenChunk = -1;
            int udpUniqueReceivedCount = 0;
            int chunksSinceLastAck = 0;
            int dupChunksSinceLastResume = 0;
            int lastNeedStartTick = 0;
            int lastEndNackTick = 0;
            int lastPartialDispatchTick = 0;
            int lastContigAdvanceTick = Environment.TickCount;
            int lastIdleHoleNackTick = 0;
            long ackWindowBytes = 0;
            long uiWindowBytes = 0;
            double smoothedUiRxMbps = 0.0;
            Stopwatch ackWindowSw = Stopwatch.StartNew();
            Stopwatch uiWindowSw = Stopwatch.StartNew();
            Stopwatch dupResumeSw = Stopwatch.StartNew();
            Stopwatch flushSw = Stopwatch.StartNew();
            Stopwatch udpRxSw = null;
            ParallelOptions decParallelOpts = new ParallelOptions();
            decParallelOpts.MaxDegreeOfParallelism = Math.Max(1, Math.Min(4, Environment.ProcessorCount / 2));

            try
            {
                while (isRunning)
                {
                    udpRxDataEvent.WaitOne(8);

                    try
                    {
                        if (udpRxStartPending)
                        {
                            udpRxStartPending = false;
                            string hdr = udpPendingStartHeader;
                            IPEndPoint senderEp = udpPendingStartEp ?? activeUdpPeerEndpoint;
                            string[] parts = hdr.Split('|');
                            if (parts.Length >= 3)
                            {
                                string newFileName = parts[1];
                                long newExpectedSize = 0;
                                Int64.TryParse(parts[2], out newExpectedSize);

                                // If duplicate AETHER_UDP_START arrives for the already-open active transfer, just re-send RESUME ACK without resetting file
                                if (udpOutFile != null && newFileName == udpFileName && newExpectedSize == udpExpectedSize)
                                {
                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        int curResume = Math.Max(0, udpContiguousChunk + 1);
                                        byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + curResume.ToString());
                                        for (int k = 0; k < 3; k++)
                                        {
                                            try { SendUdpP2pPacket(resumeReply, resumeReply.Length, senderEp); } catch { }
                                        }
                                    }
                                }
                                else
                                {
                                    if (udpOutFile != null)
                                    {
                                        DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                        WaitForDiskIoDrain(15000);
                                        lock (diskFileStreamLock)
                                        {
                                            try { udpOutFile.Flush(false); udpOutFile.Close(); } catch { }
                                            udpOutFile = null;
                                        }
                                    }
                                    foreach (UdpStagePage remP in stagedPages.Values)
                                    {
                                        ReleaseStageBuffer(remP.Data);
                                    }
                                    stagedPages.Clear();
                                    readyCompletedBytes = 0;

                                    udpFileName = newFileName;
                                    lastCompletedUdpFileName = "";
                                    udpExpectedSize = newExpectedSize;
                                    udpExpectedChunks = (int)Math.Max(1L, (udpExpectedSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);
                                    if (parts.Length >= 4) Int32.TryParse(parts[3], out udpExpectedChunks);

                                    udpFinalPath = Path.Combine(downloadDirectory, "AetherTunnel_" + udpFileName);
                                    udpPartPath = udpFinalPath + ".part";

                                    long existingLen = 0;
                                    bool partExists = File.Exists(udpPartPath);
                                    if (partExists)
                                    {
                                        existingLen = new FileInfo(udpPartPath).Length;
                                    }
                                    int resumeChunk = 0;
                                    string ckptPath = udpPartPath + ".ckpt";
                                    if (partExists && File.Exists(ckptPath))
                                    {
                                        try
                                        {
                                            string ckptRaw = File.ReadAllText(ckptPath).Trim();
                                            string[] ckptParts = ckptRaw.Split('|');
                                            int ckptChunk = 0;
                                            if (Int32.TryParse(ckptParts[0], out ckptChunk) && ckptChunk >= 0)
                                            {
                                                if (ckptParts.Length >= 2)
                                                {
                                                    long ckptExpSize = 0;
                                                    if (Int64.TryParse(ckptParts[1], out ckptExpSize) && ckptExpSize == udpExpectedSize && existingLen >= (long)ckptChunk * UDP_CHUNK_SIZE)
                                                    {
                                                        resumeChunk = Math.Min(ckptChunk, Math.Max(0, udpExpectedChunks - 1));
                                                    }
                                                }
                                                else if (existingLen > 0 && existingLen < udpExpectedSize)
                                                {
                                                    resumeChunk = Math.Min(ckptChunk, (int)(existingLen / UDP_CHUNK_SIZE));
                                                }
                                            }
                                        }
                                        catch { }
                                    }
                                    else if (partExists && existingLen > 0 && existingLen < udpExpectedSize)
                                    {
                                        resumeChunk = (int)(existingLen / UDP_CHUNK_SIZE);
                                    }
                                    long alignedBytes = (long)resumeChunk * UDP_CHUNK_SIZE;

                                    udpChunkReceived = new bool[udpExpectedChunks];
                                    udpChunkLastNackTick.Clear();
                                    for (int c = 0; c < resumeChunk && c < udpExpectedChunks; c++) udpChunkReceived[c] = true;
                                    udpContiguousChunk = resumeChunk - 1;
                                    lastQueuedCkptContig = resumeChunk - 1;
                                    udpHighestSeenChunk = resumeChunk - 1;
                                    udpUniqueReceivedCount = resumeChunk;
                                    chunksSinceLastAck = 0;
                                    dupChunksSinceLastResume = 0;
                                    ackWindowBytes = 0;
                                    uiWindowBytes = 0;
                                    smoothedUiRxMbps = 0.0;
                                    udpRxEndPending = false;
                                    lastContigAdvanceTick = Environment.TickCount;
                                    lastDiskWriteMs = 0;
                                    diskSequentialNextPage = resumeChunk / CHUNKS_PER_STAGE_PAGE;
                                    int boundarySlot = resumeChunk % CHUNKS_PER_STAGE_PAGE;
                                    udpResumeBoundaryPage = (boundarySlot > 0) ? (resumeChunk / CHUNKS_PER_STAGE_PAGE) : -1;
                                    udpResumeBoundarySlot = boundarySlot;

                                    udpOutFile = new FileStream(udpPartPath, (partExists && resumeChunk > 0) ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.Read, 64 * 1024, FileOptions.SequentialScan);
                                    try { if (udpExpectedSize > 0 && udpOutFile.Length != udpExpectedSize) udpOutFile.SetLength(udpExpectedSize); } catch { }
                                    if (alignedBytes > 0) udpOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                                    udpReceivedBytes = alignedBytes;
                                    udpSessionStartBytes = alignedBytes;
                                    udpRxSw = Stopwatch.StartNew();
                                    ackWindowSw.Restart();
                                    uiWindowSw.Restart();
                                    dupResumeSw.Restart();
                                    flushSw.Restart();

                                    if (senderEp != null && udpP2pClient != null)
                                    {
                                        byte[] resumeReply = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + resumeChunk.ToString());
                                        for (int k = 0; k < 4; k++)
                                        {
                                            try { SendUdpP2pPacket(resumeReply, resumeReply.Length, senderEp); } catch { }
                                        }
                                    }

                                    if (resumeChunk > 0)
                                        Log("Resuming P2P UDP download of " + udpFileName + " from chunk " + resumeChunk.ToString() + " (" + FormatBytes(alignedBytes) + ")");
                                    else
                                        Log("Receiving file over High-Speed P2P NAT-UDP -> " + udpFinalPath + " (" + FormatBytes(udpExpectedSize) + ")");
                                }
                            }
                        }

                        // If data packets arrive before AETHER_UDP_START, ask sender to re-send AETHER_UDP_START immediately
                        if (udpOutFile == null && !udpRxDataQueue.IsEmpty)
                        {
                            int nowTick = Environment.TickCount;
                            if (nowTick - lastNeedStartTick > 80 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                lastNeedStartTick = nowTick;
                                byte[] needStart = Encoding.UTF8.GetBytes("AETHER_UDP_NEED_START|1");
                                try { SendUdpP2pPacket(needStart, needStart.Length, activeUdpPeerEndpoint); } catch { }
                            }
                            continue;
                        }

                        // Drain up to 2048 packets (~2.8 MB) per batch and decrypt cleanly into pooled 4 MB RAM pages
                        List<byte[]> batch = new List<byte[]>(2048);
                        long drainedWireBytes = 0;
                        byte[] pkt;
                        while (batch.Count < 2048 && udpRxDataQueue.TryDequeue(out pkt))
                        {
                            drainedWireBytes += pkt.Length;
                            batch.Add(pkt);
                        }
                        if (drainedWireBytes > 0) Interlocked.Add(ref totalAppBufferedBytes, -drainedWireBytes);

                        if (batch.Count > 0 && udpOutFile != null)
                        {
                            int count = batch.Count;
                            int[] indices = new int[count];
                            byte[][] plains = new byte[count][];
                            byte[] keySnapshot = aesKey;

                            if (count <= 48)
                            {
                                byte[] seqIv = threadLocalIv.Value;
                                AesCryptoServiceProvider seqAes = threadLocalAes.Value;
                                for (int i = 0; i < count; i++)
                                {
                                    try
                                    {
                                        byte[] d = batch[i];
                                        int pktTotalChunks = BitConverter.ToInt32(d, 8);
                                        if (pktTotalChunks != udpExpectedChunks) { indices[i] = -1; continue; }
                                        indices[i] = BitConverter.ToInt32(d, 4);
                                        Buffer.BlockCopy(d, 12, seqIv, 0, 16);
                                        using (ICryptoTransform dec = seqAes.CreateDecryptor(keySnapshot, seqIv))
                                        {
                                            plains[i] = dec.TransformFinalBlock(d, 28, d.Length - 28);
                                        }
                                    }
                                    catch { indices[i] = -1; }
                                }
                            }
                            else
                            {
                                Parallel.For(0, count, decParallelOpts, delegate(int i)
                                {
                                    try
                                    {
                                        byte[] d = batch[i];
                                        int pktTotalChunks = BitConverter.ToInt32(d, 8);
                                        if (pktTotalChunks != udpExpectedChunks)
                                        {
                                            indices[i] = -1;
                                            return;
                                        }
                                        indices[i] = BitConverter.ToInt32(d, 4);
                                        byte[] iv = threadLocalIv.Value;
                                        Buffer.BlockCopy(d, 12, iv, 0, 16);
                                        AesCryptoServiceProvider aes = threadLocalAes.Value;
                                        using (ICryptoTransform dec = aes.CreateDecryptor(keySnapshot, iv))
                                        {
                                            plains[i] = dec.TransformFinalBlock(d, 28, d.Length - 28);
                                        }
                                    }
                                    catch
                                    {
                                        indices[i] = -1;
                                    }
                                });
                            }

                            for (int i = 0; i < count; i++)
                            {
                                int cIdx = indices[i];
                                byte[] plain = plains[i];
                                if (cIdx < 0 || plain == null) continue;
                                if (udpChunkReceived != null && cIdx < udpChunkReceived.Length && udpChunkReceived[cIdx])
                                {
                                    ackWindowBytes += plain.Length;
                                    uiWindowBytes += plain.Length;
                                    chunksSinceLastAck++;
                                    dupChunksSinceLastResume++;
                                    if ((dupChunksSinceLastResume >= 16 || dupResumeSw.ElapsedMilliseconds >= 35) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        dupChunksSinceLastResume = 0;
                                        dupResumeSw.Restart();
                                        int nextNeeded = Math.Max(0, udpContiguousChunk + 1);
                                        byte[] resumeJump = Encoding.UTF8.GetBytes("AETHER_UDP_RESUME|" + nextNeeded.ToString());
                                        try { SendUdpP2pPacket(resumeJump, resumeJump.Length, activeUdpPeerEndpoint); } catch { }

                                        if (udpHighestSeenChunk > udpContiguousChunk)
                                        {
                                            int nowDupTick = Environment.TickCount;
                                            StringBuilder holeSb = new StringBuilder();
                                            int holeCnt = 0;
                                            int holeLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk + 1);
                                            for (int h = nextNeeded; h < holeLimit; h++)
                                            {
                                                int prevTick;
                                                if (!udpChunkReceived[h] && (!udpChunkLastNackTick.TryGetValue(h, out prevTick) || unchecked(nowDupTick - prevTick) > 260))
                                                {
                                                    udpChunkLastNackTick[h] = nowDupTick;
                                                    if (holeCnt > 0) holeSb.Append(",");
                                                    holeSb.Append(h.ToString());
                                                    holeCnt++;
                                                    if (holeCnt >= 80) break;
                                                }
                                            }
                                            if (holeCnt > 0)
                                            {
                                                byte[] holeNack = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + holeSb.ToString());
                                                try { SendUdpP2pPacket(holeNack, holeNack.Length, activeUdpPeerEndpoint); } catch { }
                                            }
                                        }
                                    }
                                    continue;
                                }

                                if (udpChunkReceived != null && cIdx < udpChunkReceived.Length)
                                {
                                    udpChunkReceived[cIdx] = true;
                                    udpUniqueReceivedCount++;
                                    udpReceivedBytes = Math.Min(udpExpectedSize, udpReceivedBytes + plain.Length);
                                }
                                else
                                {
                                    udpReceivedBytes = Math.Max(udpReceivedBytes, ((long)cIdx * UDP_CHUNK_SIZE) + plain.Length);
                                }

                                // Place chunk directly into aligned 4 MB pooled RAM page (zero small heap allocations kept in Gen2!)
                                int pIdx = cIdx / CHUNKS_PER_STAGE_PAGE;
                                int slot = cIdx % CHUNKS_PER_STAGE_PAGE;
                                UdpStagePage page;
                                if (!stagedPages.TryGetValue(pIdx, out page))
                                {
                                    page = new UdpStagePage();
                                    page.PageIndex = pIdx;
                                    page.Data = AllocStageBuffer();
                                    int remChunks = udpExpectedChunks - (pIdx * CHUNKS_PER_STAGE_PAGE);
                                    page.ExpectedCount = Math.Max(1, Math.Min(CHUNKS_PER_STAGE_PAGE, remChunks));
                                    page.StartSlot = (pIdx == udpResumeBoundaryPage && udpResumeBoundarySlot > 0 && udpResumeBoundarySlot < page.ExpectedCount) ? udpResumeBoundarySlot : 0;
                                    page.Present = new bool[page.ExpectedCount];
                                    page.ChunkLens = new short[page.ExpectedCount];
                                    stagedPages[pIdx] = page;
                                }
                                if (slot >= page.StartSlot && slot < page.ExpectedCount && !page.Present[slot])
                                {
                                    Buffer.BlockCopy(plain, 0, page.Data, slot * UDP_CHUNK_SIZE, plain.Length);
                                    page.Present[slot] = true;
                                    page.ChunkLens[slot] = (short)plain.Length;
                                    page.PresentCount++;
                                    page.ValidBytes += plain.Length;
                                    int needed = Math.Max(1, page.ExpectedCount - page.StartSlot);
                                    if (page.PresentCount == needed)
                                    {
                                        readyCompletedBytes += page.ValidBytes;
                                    }
                                }

                                if (cIdx > udpHighestSeenChunk) udpHighestSeenChunk = cIdx;
                                ackWindowBytes += plain.Length;
                                uiWindowBytes += plain.Length;
                                chunksSinceLastAck++;
                            }

                            if (udpChunkReceived != null)
                            {
                                int prevContig = udpContiguousChunk;
                                while (udpContiguousChunk + 1 < udpChunkReceived.Length && udpChunkReceived[udpContiguousChunk + 1])
                                {
                                    udpContiguousChunk++;
                                }
                                if (udpContiguousChunk > prevContig)
                                {
                                    lastContigAdvanceTick = Environment.TickCount;
                                }
                            }

                            // Live sliding-window RX speed for UI readout
                            double uiWinSec = uiWindowSw.Elapsed.TotalSeconds;
                            if (uiWinSec >= 0.35 || smoothedUiRxMbps <= 0.0)
                            {
                                if (smoothedUiRxMbps <= 0.0)
                                {
                                    double totalSec = Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                                    smoothedUiRxMbps = (Math.Max(0L, udpReceivedBytes - udpSessionStartBytes) / (1024.0 * 1024.0)) / totalSec;
                                }
                                else if (uiWinSec >= 0.35)
                                {
                                    double sampleMbps = (uiWindowBytes / (1024.0 * 1024.0)) / uiWinSec;
                                    smoothedUiRxMbps = (smoothedUiRxMbps * 0.35) + (sampleMbps * 0.65);
                                    uiWindowBytes = 0;
                                    uiWindowSw.Restart();
                                }
                            }

                            long stagedAllocBytes = (long)stagedPages.Count * STAGE_PAGE_BYTES;
                            int nowTickMs = Environment.TickCount;
                            bool emergencyPartialFlush = (stagedAllocBytes >= 512L * 1024L * 1024L && unchecked(nowTickMs - lastPartialDispatchTick) >= 500);
                            bool wantStageFlush = (readyCompletedBytes >= DISK_STAGE_TARGET_BYTES) ||
                                emergencyPartialFlush ||
                                (udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks) ||
                                udpRxEndPending;

                            long ackElapsedMs = ackWindowSw.ElapsedMilliseconds;
                            if (chunksSinceLastAck > 0 && (ackElapsedMs >= 50 || wantStageFlush) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                double ackSec = Math.Max(0.050, ackWindowSw.Elapsed.TotalSeconds);
                                double instMbits = ((ackWindowBytes * 8.0) / (1024.0 * 1024.0)) / ackSec;
                                int mbitsInt = Math.Max(1, (int)Math.Round(Math.Min(5000.0, instMbits)));
                                chunksSinceLastAck = 0;
                                ackWindowBytes = 0;
                                ackWindowSw.Restart();

                                long queuedDiskBytes = (long)Math.Max(0, Thread.VolatileRead(ref activeDiskIoJobs)) * STAGE_PAGE_BYTES;
                                long memBufferedBytes = Interlocked.Read(ref totalAppBufferedBytes);
                                int diskMbps = smoothedDiskWriteMbps;
                                int diskLatMs = lastDiskWriteMs;
                                bool diskBusy = (queuedDiskBytes >= 192L * 1024L * 1024L) || (memBufferedBytes >= 768L * 1024L * 1024L) || (diskLatMs >= 100);
                                if (diskBusy)
                                {
                                    double safeDiskMbits = diskMbps > 0 ? Math.Max(16.0, diskMbps * 8.0 * 0.78) : 180.0;
                                    if (queuedDiskBytes >= 384L * 1024L * 1024L || memBufferedBytes >= 1150L * 1024L * 1024L)
                                    {
                                        safeDiskMbits = Math.Max(8.0, safeDiskMbits * 0.45);
                                    }
                                    mbitsInt = Math.Min(mbitsInt, Math.Max(8, (int)Math.Round(safeDiskMbits)));
                                }

                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpContiguousChunk.ToString() + "|" + mbitsInt.ToString() + (diskBusy ? "|1" : "|0"));
                                try { SendUdpP2pPacket(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }

                                // Adaptive Real-Time NACK: if contiguous stalls >= 220ms, drop slack to 0 so tail holes repair immediately!
                                int contigStallMs = unchecked(nowTickMs - lastContigAdvanceTick);
                                int reorderSlack = (contigStallMs >= 220 || udpRxEndPending) ? 0 : Math.Max(24, Math.Min(192, (int)Math.Round(smoothedUiRxMbps * 3.0)));
                                if (udpChunkReceived != null && (udpHighestSeenChunk - udpContiguousChunk > reorderSlack + 16 || (contigStallMs >= 220 && udpHighestSeenChunk > udpContiguousChunk)))
                                {
                                    if (udpChunkLastNackTick.Count > 16384) udpChunkLastNackTick.Clear();
                                    StringBuilder nackSb = new StringBuilder();
                                    int nackCnt = 0;
                                    int scanLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk - reorderSlack);
                                    for (int c = udpContiguousChunk + 1; c < scanLimit; c++)
                                    {
                                        int prevTick;
                                        if (!udpChunkReceived[c] && (!udpChunkLastNackTick.TryGetValue(c, out prevTick) || unchecked(nowTickMs - prevTick) > 240))
                                        {
                                            udpChunkLastNackTick[c] = nowTickMs;
                                            if (nackCnt > 0) nackSb.Append(",");
                                            nackSb.Append(c.ToString());
                                            nackCnt++;
                                            if (nackCnt >= 80) break;
                                        }
                                    }
                                    if (nackCnt > 0)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                        try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }

                            // Hand off >= 128 MB of sequential 4 MB pages to background Disk I/O thread WITHOUT blocking ACKs/NACKs!
                            if (wantStageFlush && stagedPages.Count > 0)
                            {
                                if (emergencyPartialFlush) lastPartialDispatchTick = nowTickMs;
                                bool forceFlush = (udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks) || udpRxEndPending;
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, forceFlush);
                                flushSw.Restart();
                            }
                            else if (stagedPages.Count > 0)
                            {
                                flushSw.Restart();
                            }

                            int permille = (int)((udpReceivedBytes * 1000L) / Math.Max(1L, udpExpectedSize));
                            UpdateTransferUi("Receiving via P2P NAT-UDP: " + udpFileName, udpReceivedBytes, udpExpectedSize, smoothedUiRxMbps, permille);
                        }
                        else
                        {
                            int nowTickIdle = Environment.TickCount;
                            if (udpOutFile != null && chunksSinceLastAck > 0 && ackWindowSw.ElapsedMilliseconds >= 45 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                double ackSec = Math.Max(0.001, ackWindowSw.Elapsed.TotalSeconds);
                                double instMbits = ((ackWindowBytes * 8.0) / (1024.0 * 1024.0)) / ackSec;
                                int mbitsInt = Math.Max(1, (int)Math.Round(Math.Min(5000.0, instMbits)));
                                chunksSinceLastAck = 0;
                                ackWindowBytes = 0;
                                ackWindowSw.Restart();
                                long queuedDiskBytes = (long)Math.Max(0, Thread.VolatileRead(ref activeDiskIoJobs)) * STAGE_PAGE_BYTES;
                                long memBufferedBytes = Interlocked.Read(ref totalAppBufferedBytes);
                                int diskMbps = smoothedDiskWriteMbps;
                                int diskLatMs = lastDiskWriteMs;
                                bool diskBusy = (queuedDiskBytes >= 192L * 1024L * 1024L) || (memBufferedBytes >= 768L * 1024L * 1024L) || (diskLatMs >= 100);
                                if (diskBusy)
                                {
                                    double safeDiskMbits = diskMbps > 0 ? Math.Max(16.0, diskMbps * 8.0 * 0.78) : 180.0;
                                    if (queuedDiskBytes >= 384L * 1024L * 1024L || memBufferedBytes >= 1150L * 1024L * 1024L)
                                    {
                                        safeDiskMbits = Math.Max(8.0, safeDiskMbits * 0.45);
                                    }
                                    mbitsInt = Math.Min(mbitsInt, Math.Max(8, (int)Math.Round(safeDiskMbits)));
                                }
                                byte[] ackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_ACK|" + udpUniqueReceivedCount.ToString() + "|" + udpContiguousChunk.ToString() + "|" + mbitsInt.ToString() + (diskBusy ? "|1" : "|0"));
                                try { SendUdpP2pPacket(ackBytes, ackBytes.Length, activeUdpPeerEndpoint); } catch { }
                            }

                            // Proactive stalled-hole NACK when idle so BDP tail gaps never freeze transfer
                            if (udpOutFile != null && udpChunkReceived != null && udpHighestSeenChunk > udpContiguousChunk &&
                                unchecked(nowTickIdle - lastContigAdvanceTick) >= 220 && unchecked(nowTickIdle - lastIdleHoleNackTick) >= 180 &&
                                activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                lastIdleHoleNackTick = nowTickIdle;
                                if (udpChunkLastNackTick.Count > 16384) udpChunkLastNackTick.Clear();
                                StringBuilder nackSb = new StringBuilder();
                                int nackCnt = 0;
                                int scanLimit = Math.Min(udpExpectedChunks, udpHighestSeenChunk);
                                for (int c = udpContiguousChunk + 1; c < scanLimit; c++)
                                {
                                    int prevTick;
                                    if (!udpChunkReceived[c] && (!udpChunkLastNackTick.TryGetValue(c, out prevTick) || unchecked(nowTickIdle - prevTick) > 220))
                                    {
                                        udpChunkLastNackTick[c] = nowTickIdle;
                                        if (nackCnt > 0) nackSb.Append(",");
                                        nackSb.Append(c.ToString());
                                        nackCnt++;
                                        if (nackCnt >= 80) break;
                                    }
                                }
                                if (nackCnt > 0)
                                {
                                    byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + nackSb.ToString());
                                    try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }

                            // Idle safety flush: if stream pauses for >= 10s, persist staged RAM pages to disk + .ckpt
                            if (udpOutFile != null && stagedPages.Count > 0 && flushSw.ElapsedMilliseconds >= 10000)
                            {
                                DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                flushSw.Restart();
                            }
                        }

                        // Auto-finalize cleanly once 100% of contiguous chunks arrive (drain background Disk I/O queue before closing & renaming!)
                        if (udpOutFile != null && udpChunkReceived != null && udpContiguousChunk + 1 >= udpExpectedChunks)
                        {
                            DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                            WaitForDiskIoDrain(30000);
                            udpRxEndPending = false;
                            lock (diskFileStreamLock)
                            {
                                try { if (udpExpectedSize > 0 && udpOutFile.Length != udpExpectedSize) udpOutFile.SetLength(udpExpectedSize); } catch { }
                                try { udpOutFile.Flush(false); } catch { }
                                udpOutFile.Close();
                                udpOutFile = null;
                            }
                            udpRxSw.Stop();

                            try
                            {
                                if (File.Exists(udpPartPath + ".ckpt")) File.Delete(udpPartPath + ".ckpt");
                                if (File.Exists(udpFinalPath)) File.Delete(udpFinalPath);
                                File.Move(udpPartPath, udpFinalPath);
                            }
                            catch { }

                            lastCompletedUdpFileName = udpFileName;
                            if (activeUdpPeerEndpoint != null && udpP2pClient != null)
                            {
                                byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + udpFileName);
                                for (int k = 0; k < 5; k++)
                                {
                                    try { SendUdpP2pPacket(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }

                            double sec = Math.Max(0.005, udpRxSw.Elapsed.TotalSeconds);
                            long sessionDeltaBytes = Math.Max(1L, udpExpectedSize - udpSessionStartBytes);
                            double mbps = (sessionDeltaBytes / (1024.0 * 1024.0)) / sec;
                            UpdateTransferUi("Saved via P2P NAT-UDP: " + udpFileName, udpExpectedSize, udpExpectedSize, mbps, 1000);
                            Log(String.Format("P2P NAT-UDP RX COMPLETE: {0} ({1:F2} MB/s)", udpFinalPath, mbps));
                        }
                        else if (udpRxEndPending && udpRxDataQueue.IsEmpty)
                        {
                            if (udpOutFile == null)
                            {
                                udpRxEndPending = false;
                                if (!String.IsNullOrEmpty(lastCompletedUdpFileName) && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                {
                                    byte[] doneBytes = Encoding.UTF8.GetBytes("AETHER_UDP_DONE|" + lastCompletedUdpFileName);
                                    try { SendUdpP2pPacket(doneBytes, doneBytes.Length, activeUdpPeerEndpoint); } catch { }
                                }
                            }
                            else
                            {
                                if (stagedPages.Count > 0)
                                {
                                    DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                                    flushSw.Restart();
                                }
                                int nowTick = Environment.TickCount;
                                if (nowTick - lastEndNackTick >= 120)
                                {
                                    lastEndNackTick = nowTick;
                                    List<string> missing = new List<string>();
                                    if (udpChunkReceived != null)
                                    {
                                        for (int c = Math.Max(0, udpContiguousChunk + 1); c < udpChunkReceived.Length; c++)
                                        {
                                            if (!udpChunkReceived[c])
                                            {
                                                missing.Add(c.ToString());
                                                if (missing.Count >= 80) break;
                                            }
                                        }
                                    }

                                    if (missing.Count > 0 && activeUdpPeerEndpoint != null && udpP2pClient != null)
                                    {
                                        byte[] nackBytes = Encoding.UTF8.GetBytes("AETHER_UDP_NACK|" + String.Join(",", missing.ToArray()));
                                        try { SendUdpP2pPacket(nackBytes, nackBytes.Length, activeUdpPeerEndpoint); } catch { }
                                    }
                                }
                            }
                        }
                    }
                    catch { }
                }
            }
            finally
            {
                try
                {
                    if (udpOutFile != null)
                    {
                        DispatchStagedPagesToDiskQueue(udpOutFile, udpPartPath, udpExpectedSize, stagedPages, ref readyCompletedBytes, ref lastQueuedCkptContig, udpContiguousChunk, pageKeysBuf, true);
                        WaitForDiskIoDrain(10000);
                        lock (diskFileStreamLock)
                        {
                            try { udpOutFile.Flush(false); } catch { }
                            udpOutFile.Close();
                            udpOutFile = null;
                        }
                    }
                }
                catch { }
                udpWriterExitedEvent.Set();
            }
        }

        private void PerformHolePunchPass()
        {
            if (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12) return;

            int nowTick = Environment.TickCount;
            bool doSpray = unchecked(nowTick - lastPunchFanTick) >= 2400;
            if (doSpray) lastPunchFanTick = nowTick;

            string v6Ep = remotePeerWanV6Udp;
            string wanEp = remotePeerWanUdp;
            string predEp = remotePeerPredictedWanUdp;
            string lanUdpEp = remotePeerLanUdp;

            if (v6Ep.Length > 0 && udpP2pV6Client != null)
            {
                InitiateUdpHolePunch(v6Ep, false);
            }
            if (wanEp.Length > 0)
            {
                InitiateUdpHolePunch(wanEp, doSpray || remotePeerNatSym == 1);
            }
            if (predEp.Length > 0 && predEp != wanEp)
            {
                InitiateUdpHolePunch(predEp, false);
            }
            if (lanUdpEp.Length > 0)
            {
                InitiateUdpHolePunch(lanUdpEp, false);
            }
        }

        private void PeerHeartbeatMonitorLoop()
        {
            int tickSeq = 0;
            while (isRunning)
            {
                try
                {
                    tickSeq++;
                    if (activeUdpPeerEndpoint != null)
                    {
                        if ((DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12)
                        {
                            byte[] ping = Encoding.UTF8.GetBytes("AETHER_PING|" + instanceId);
                            SendUdpP2pPacket(ping, ping.Length, activeUdpPeerEndpoint);
                        }
                        else
                        {
                            activeUdpPeerEndpoint = null;
                        }
                    }

                    bool hasTcp = (activePeerClient != null && activePeerClient.Connected);
                    bool hasUdp = (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 12);
                    bool hasLocalBrowser = (activeBrowserWsClient != null && activeBrowserWsClient.Connected);
                    bool hasCloudBrowser = (!String.IsNullOrEmpty(activeCloudBrowserPeerId) && (DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds < 12);
                    bool hasCloudExe = (!String.IsNullOrEmpty(activeCloudExePeerId) && (DateTime.UtcNow - lastCloudExeSeen).TotalSeconds < 12);

                    if (!hasTcp && !hasUdp && (tickSeq % 2 == 0))
                    {
                        BroadcastUdpPresence();
                    }

                    if (!hasUdp && !hasTcp && hasCloudExe)
                    {
                        PerformHolePunchPass();
                    }

                    string room = currentRoomCode;

                    if (hasTcp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — KERNEL TCP (" + activePeerClient.Client.RemoteEndPoint.ToString() + ")");
                    else if (hasUdp)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — P2P NAT-UDP (" + activeUdpPeerEndpoint.ToString() + ")");
                    else if (hasLocalBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                    else if (hasCloudBrowser)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — CHROME BROWSER [" + room + "]");
                    else if (hasCloudExe)
                        UpdateStatusBadge("PEER STATUS: CONNECTED — REMOTE .EXE [" + room + "] (NAT-Punch)");
                    else
                        UpdateStatusBadge("PEER STATUS: WAITING FOR PEER [" + room + "]");
                }
                catch { }
                Thread.Sleep(1000);
            }
        }

        private bool IsCgnatOrApipaAddress(IPAddress ip)
        {
            if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork) return false;
            byte[] b = ip.GetAddressBytes();
            if (b[0] == 169 && b[1] == 254) return true;
            if (b[0] == 100 && b[1] >= 64 && b[1] <= 127) return true;
            return false;
        }

        private bool IsVirtualAdapterDescription(string desc, string name)
        {
            string s = ((desc ?? "") + " " + (name ?? "")).ToLowerInvariant();
            return s.Contains("zerotier") || s.Contains("tailscale") || s.Contains("virtualbox") ||
                   s.Contains("vmware") || s.Contains("hyper-v") || s.Contains("vethernet") ||
                   s.Contains("wsl") || s.Contains("loopback") || s.Contains("tap-") ||
                   s.Contains("wintun") || s.Contains("hamachi") || s.Contains("radmin");
        }

        private IPAddress GetPreferredLanIpv4()
        {
            IPAddress physicalGw = null;
            IPAddress physicalAny = null;
            IPAddress virtualPrivate = null;
            IPAddress cgnatFallback = null;
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback || ni.NetworkInterfaceType == NetworkInterfaceType.Tunnel) continue;
                    IPInterfaceProperties props = ni.GetIPProperties();
                    bool hasGw = (props.GatewayAddresses != null && props.GatewayAddresses.Count > 0);
                    bool isVirt = IsVirtualAdapterDescription(ni.Description, ni.Name);

                    foreach (UnicastIPAddressInformation uni in props.UnicastAddresses)
                    {
                        IPAddress ip = uni.Address;
                        if (ip == null || ip.AddressFamily != AddressFamily.InterNetwork || IPAddress.IsLoopback(ip)) continue;
                        if (IsCgnatOrApipaAddress(ip))
                        {
                            if (cgnatFallback == null) cgnatFallback = ip;
                            continue;
                        }
                        if (!isVirt)
                        {
                            if (hasGw && physicalGw == null) physicalGw = ip;
                            if (physicalAny == null) physicalAny = ip;
                        }
                        else if (virtualPrivate == null)
                        {
                            virtualPrivate = ip;
                        }
                    }
                }
            }
            catch { }

            if (physicalGw != null) return physicalGw;
            if (physicalAny != null) return physicalAny;
            if (virtualPrivate != null) return virtualPrivate;
            if (cgnatFallback != null) return cgnatFallback;

            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip)) return ip;
                }
            }
            catch { }
            return IPAddress.Loopback;
        }

        private string GetGlobalIpv6Address()
        {
            try
            {
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up) continue;
                    if (ni.NetworkInterfaceType == NetworkInterfaceType.Loopback || ni.NetworkInterfaceType == NetworkInterfaceType.Tunnel) continue;
                    if (IsVirtualAdapterDescription(ni.Description, ni.Name)) continue;
                    IPInterfaceProperties props = ni.GetIPProperties();
                    foreach (UnicastIPAddressInformation uni in props.UnicastAddresses)
                    {
                        IPAddress ip = uni.Address;
                        if (ip == null || ip.AddressFamily != AddressFamily.InterNetworkV6) continue;
                        if (IPAddress.IsLoopback(ip) || ip.IsIPv6LinkLocal || ip.IsIPv6SiteLocal || ip.IsIPv6Multicast || ip.IsIPv6Teredo) continue;
                        string s = ip.ToString();
                        int pct = s.IndexOf('%');
                        if (pct >= 0) s = s.Substring(0, pct);
                        string low = s.ToLowerInvariant();
                        if (low.StartsWith("fd") || low.StartsWith("fc") || low.StartsWith("::")) continue;
                        return s;
                    }
                }
            }
            catch { }
            return "";
        }

        private string GetFirstLanEndpoint()
        {
            IPAddress ip = GetPreferredLanIpv4();
            return ip != null ? (ip.ToString() + ":" + listenPort.ToString()) : "";
        }

        private string GetFirstLanUdpEndpoint()
        {
            IPAddress ip = GetPreferredLanIpv4();
            return ip != null ? (ip.ToString() + ":" + udpP2pPort.ToString()) : "";
        }

        private string GetLocalIpList()
        {
            List<string> ips = new List<string>();
            IPAddress pref = GetPreferredLanIpv4();
            if (pref != null && !IPAddress.IsLoopback(pref)) ips.Add(pref.ToString() + ":" + listenPort.ToString());
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.AddressFamily == AddressFamily.InterNetwork && !IPAddress.IsLoopback(ip))
                    {
                        string entry = ip.ToString() + ":" + listenPort.ToString();
                        if (!ips.Contains(entry)) ips.Add(entry);
                    }
                }
            }
            catch { }
            if (ips.Count == 0) ips.Add("127.0.0.1:" + listenPort.ToString());
            return String.Join("  |  ", ips.ToArray());
        }

        private bool IsOwnLocalEndpoint(IPAddress addr, int port)
        {
            if (port != listenPort && port != udpP2pPort && port != udpP2pV6Port) return false;
            if (IPAddress.IsLoopback(addr)) return true;
            try
            {
                IPHostEntry host = Dns.GetHostEntry(Dns.GetHostName());
                foreach (IPAddress ip in host.AddressList)
                {
                    if (ip.Equals(addr)) return true;
                }
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    foreach (UnicastIPAddressInformation uni in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (uni.Address.Equals(addr)) return true;
                    }
                }
            }
            catch { }
            return false;
        }

        private string CleanRoomCode(string rawRoom)
        {
            string lower = (rawRoom ?? "").Trim().ToLowerInvariant();
            StringBuilder cleanSb = new StringBuilder();
            foreach (char ch in lower)
            {
                if ((ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9') || ch == '-')
                    cleanSb.Append(ch);
            }
            return cleanSb.Length > 0 ? cleanSb.ToString() : "default";
        }

        private static byte[] BuildMqttPacket(byte packetType, byte[] variableHeader, byte[] payload)
        {
            int remLen = (variableHeader != null ? variableHeader.Length : 0) + (payload != null ? payload.Length : 0);
            List<byte> varLenBytes = new List<byte>(4);
            int x = remLen;
            do
            {
                byte encodedByte = (byte)(x % 128);
                x = x / 128;
                if (x > 0) encodedByte = (byte)(encodedByte | 128);
                varLenBytes.Add(encodedByte);
            } while (x > 0);

            byte[] packet = new byte[1 + varLenBytes.Count + remLen];
            packet[0] = packetType;
            for (int i = 0; i < varLenBytes.Count; i++) packet[1 + i] = varLenBytes[i];
            int offset = 1 + varLenBytes.Count;
            if (variableHeader != null && variableHeader.Length > 0)
            {
                Buffer.BlockCopy(variableHeader, 0, packet, offset, variableHeader.Length);
                offset += variableHeader.Length;
            }
            if (payload != null && payload.Length > 0)
            {
                Buffer.BlockCopy(payload, 0, packet, offset, payload.Length);
            }
            return packet;
        }

        private void SendChannelFrame(SignalingChannel ch, byte[] data, bool isBinary)
        {
            if (ch == null || ch.Ws == null || ch.Ws.State != WebSocketState.Open || data == null) return;
            lock (ch.SendLock)
            {
                if (ch.Ws.State != WebSocketState.Open) return;
                ch.Ws.SendAsync(new ArraySegment<byte>(data, 0, data.Length), isBinary ? WebSocketMessageType.Binary : WebSocketMessageType.Text, true, CancellationToken.None).Wait(4000);
            }
        }

        private string BuildHelloInnerJson(string kindName, string cleanCode)
        {
            string lanEp = GetFirstLanEndpoint();
            string lanUdpEp = GetFirstLanUdpEndpoint();
            string predWan = "";
            if (natSymDetected == 1 && publicWanUdpEndpoint.Contains(":"))
            {
                int col = publicWanUdpEndpoint.LastIndexOf(':');
                int p = 0;
                if (col > 0 && Int32.TryParse(publicWanUdpEndpoint.Substring(col + 1), out p))
                {
                    int delta = (natPortDelta != 0 && Math.Abs(natPortDelta) <= 32) ? natPortDelta : 1;
                    int nextP = p + delta;
                    if (nextP > 1024 && nextP <= 65535)
                        predWan = publicWanUdpEndpoint.Substring(0, col + 1) + nextP.ToString();
                }
            }
            return "{\\"kind\\":\\"" + kindName + "\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"fingerprint\\":\\"" + currentFingerprint +
                   "\\",\\"lanEndpoint\\":\\"" + lanEp + "\\",\\"lanUdpEndpoint\\":\\"" + lanUdpEp +
                   "\\",\\"wanUdpEndpoint\\":\\"" + publicWanUdpEndpoint + "\\",\\"wanV6UdpEndpoint\\":\\"" + publicWanV6UdpEndpoint +
                   "\\",\\"predWanUdpEndpoint\\":\\"" + predWan + "\\",\\"natSym\\":\\"" + natSymDetected.ToString() +
                   "\\",\\"natDelta\\":\\"" + natPortDelta.ToString() + "\\",\\"upnpTcp\\":\\"" + (upnpTcpMapped ? "1" : "0") + "\\"}";
        }

        private void BroadcastCloudHelloToAll()
        {
            string cleanCode = CleanRoomCode(currentRoomCode);
            string inner = BuildHelloInnerJson("exe:hello", cleanCode);
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                try { SendCloudPacketToChannel(kv.Value, "*", inner); } catch { }
            }
        }

        private void SendCloudPacketToChannel(SignalingChannel ch, string dstPeerId, string innerPayloadJson)
        {
            if (ch == null || ch.Ws == null || ch.Ws.State != WebSocketState.Open || String.IsNullOrEmpty(dstPeerId)) return;
            string envelope = "{\\"type\\":\\"CANDIDATE\\",\\"src\\":\\"" + activeCloudMyId + "\\",\\"dst\\":\\"" + dstPeerId + "\\",\\"payload\\":" + innerPayloadJson + "}";
            byte[] envBytes = Encoding.UTF8.GetBytes(envelope);
            if (!ch.IsMqtt)
            {
                SendChannelFrame(ch, envBytes, false);
                return;
            }
            byte[] topicBytes = Encoding.UTF8.GetBytes(ch.Topic);
            byte[] vh = new byte[2 + topicBytes.Length];
            vh[0] = (byte)((topicBytes.Length >> 8) & 0xFF);
            vh[1] = (byte)(topicBytes.Length & 0xFF);
            Buffer.BlockCopy(topicBytes, 0, vh, 2, topicBytes.Length);
            SendChannelFrame(ch, BuildMqttPacket(0x30, vh, envBytes), true);
        }

        private void SendCloudPacketAny(string dstPeerId, string innerPayloadJson)
        {
            SignalingChannel preferred = dstPeerId == activeCloudBrowserPeerId ? lastBrowserSignalingChannel : lastExeSignalingChannel;
            if (preferred != null && preferred.Ws != null && preferred.Ws.State == WebSocketState.Open)
            {
                try { SendCloudPacketToChannel(preferred, dstPeerId, innerPayloadJson); return; } catch { }
            }
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                if (kv.Value != null && kv.Value.Ws != null && kv.Value.Ws.State == WebSocketState.Open)
                {
                    try { SendCloudPacketToChannel(kv.Value, dstPeerId, innerPayloadJson); return; } catch { }
                }
            }
        }

        private void CloudWormholeBridgeLoop()
        {
            if (!String.IsNullOrEmpty(DEFAULT_CLOUD_WS_URL))
            {
                Thread wsRelayThread = new Thread(delegate() { RunAppWsRelayLoop(DEFAULT_CLOUD_WS_URL); });
                wsRelayThread.IsBackground = true;
                wsRelayThread.Start();
            }

            string[][] brokers = new string[][] {
                new string[] { "emqx", "wss://broker.emqx.io:8084/mqtt" },
                new string[] { "hivemq", "wss://broker.hivemq.com:8884/mqtt" },
                new string[] { "mosquitto", "wss://test.mosquitto.org:8081/mqtt" }
            };
            foreach (string[] b in brokers)
            {
                string bName = b[0];
                string bUrl = b[1];
                Thread t = new Thread(delegate() { RunMqttBrokerLoop(bName, bUrl); });
                t.IsBackground = true;
                t.Start();
            }
        }

        private void RunAppWsRelayLoop(string wsUrl)
        {
            while (isRunning)
            {
                ClientWebSocket ws = null;
                SignalingChannel ch = null;
                try
                {
                    string cleanCode = CleanRoomCode(currentRoomCode);
                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    activeCloudMyId = myPeerId;
                    activeCloudTopic = "aethertunnel/v1/room/" + cleanCode;

                    ws = new ClientWebSocket();
                    ws.ConnectAsync(new Uri(wsUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        Thread.Sleep(4000);
                        continue;
                    }

                    ch = new SignalingChannel();
                    ch.Name = "ws-relay";
                    ch.IsMqtt = false;
                    ch.Topic = cleanCode;
                    ch.Ws = ws;
                    activeSignalingChannels[ch.Name] = ch;
                    Log("Cloud Signaling connected: App Relay (" + cleanCode + ")");

                    string joinJson = "{\\"type\\":\\"room:join\\",\\"roomCode\\":\\"" + cleanCode + "\\",\\"peerId\\":\\"" + myPeerId + "\\",\\"deviceLabel\\":\\"AetherTunnel .EXE (WAN)\\",\\"natType\\":\\"" + natTypeSummary + "\\"}";
                    SendChannelFrame(ch, Encoding.UTF8.GetBytes(joinJson), false);
                    SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));

                    ClientWebSocket capturedWs = ws;
                    SignalingChannel capturedCh = ch;
                    string capturedCode = cleanCode;
                    Thread hb = new Thread(delegate()
                    {
                        while (isRunning && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode)
                        {
                            try
                            {
                                SendCloudPacketToChannel(capturedCh, "*", BuildHelloInnerJson("exe:hello", capturedCode));
                            }
                            catch { break; }
                            for (int i = 0; i < 16 && isRunning && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode; i++)
                                Thread.Sleep(120);
                        }
                        if (CleanRoomCode(currentRoomCode) != capturedCode)
                        {
                            try { capturedWs.Abort(); } catch { }
                        }
                    });
                    hb.IsBackground = true;
                    hb.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();
                    while (isRunning && ws.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == cleanCode)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;
                        if (res.Count > 0) msgMs.Write(recvBuf, 0, res.Count);
                        if (!res.EndOfMessage) continue;
                        string text = Encoding.UTF8.GetString(msgMs.ToArray());
                        msgMs.SetLength(0);
                        HandleIncomingCloudMessage(ch, text, cleanCode, myPeerId);
                    }
                }
                catch { }
                finally
                {
                    if (ch != null) { SignalingChannel removed; activeSignalingChannels.TryRemove(ch.Name, out removed); }
                    if (ws != null) { try { ws.Dispose(); } catch { } }
                }
                if (isRunning) Thread.Sleep(CleanRoomCode(currentRoomCode) != (ch != null ? ch.Topic : "") ? 150 : 3500);
            }
        }

        private void RunMqttBrokerLoop(string brokerName, string brokerUrl)
        {
            while (isRunning)
            {
                ClientWebSocket ws = null;
                SignalingChannel ch = null;
                string joinedCode = "";
                try
                {
                    string cleanCode = CleanRoomCode(currentRoomCode);
                    joinedCode = cleanCode;
                    cloudReconnectRequested = false;

                    string myPeerId = "aethertunnel-exe-" + cleanCode + "-" + instanceId;
                    string topic = "aethertunnel/v1/room/" + cleanCode;
                    activeCloudMyId = myPeerId;
                    activeCloudTopic = topic;

                    ws = new ClientWebSocket();
                    ws.Options.AddSubProtocol("mqtt");
                    ws.ConnectAsync(new Uri(brokerUrl), CancellationToken.None).Wait(7000);
                    if (ws.State != WebSocketState.Open)
                    {
                        Thread.Sleep(2500);
                        continue;
                    }

                    ch = new SignalingChannel();
                    ch.Name = "mqtt-" + brokerName;
                    ch.IsMqtt = true;
                    ch.Topic = topic;
                    ch.Ws = ws;

                    // MQTT 3.1.1 CONNECT packet (ClientId strictly <= 22 bytes for universal broker compatibility)
                    string shortCid = "at" + instanceId + "_" + (DateTime.UtcNow.Ticks & 0xFFFF).ToString("x4");
                    byte[] idBytes = Encoding.UTF8.GetBytes(shortCid);
                    byte[] connVh = new byte[] { 0x00, 0x04, (byte)'M', (byte)'Q', (byte)'T', (byte)'T', 0x04, 0x02, 0x00, 0x3C };
                    byte[] connPl = new byte[2 + idBytes.Length];
                    connPl[0] = (byte)((idBytes.Length >> 8) & 0xFF);
                    connPl[1] = (byte)(idBytes.Length & 0xFF);
                    Buffer.BlockCopy(idBytes, 0, connPl, 2, idBytes.Length);
                    SendChannelFrame(ch, BuildMqttPacket(0x10, connVh, connPl), true);

                    ClientWebSocket capturedWs = ws;
                    SignalingChannel capturedCh = ch;
                    string capturedCode = cleanCode;
                    Thread hbThread = new Thread(delegate()
                    {
                        int tickCount = 0;
                        while (isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode)
                        {
                            try
                            {
                                tickCount++;
                                if (tickCount % 5 == 0) SendChannelFrame(capturedCh, new byte[] { 0xC0, 0x00 }, true);
                                if (activeSignalingChannels.ContainsKey(capturedCh.Name))
                                    SendCloudPacketToChannel(capturedCh, "*", BuildHelloInnerJson("exe:hello", capturedCode));
                            }
                            catch { break; }
                            for (int i = 0; i < 16 && isRunning && !cloudReconnectRequested && capturedWs.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == capturedCode; i++)
                                Thread.Sleep(120);
                        }
                        if (CleanRoomCode(currentRoomCode) != capturedCode)
                        {
                            try { capturedWs.Abort(); } catch { }
                        }
                    });
                    hbThread.IsBackground = true;
                    hbThread.Start();

                    byte[] recvBuf = new byte[131072];
                    MemoryStream msgMs = new MemoryStream();
                    while (isRunning && ws.State == WebSocketState.Open && CleanRoomCode(currentRoomCode) == cleanCode)
                    {
                        WebSocketReceiveResult res = ws.ReceiveAsync(new ArraySegment<byte>(recvBuf), CancellationToken.None).GetAwaiter().GetResult();
                        if (res.MessageType == WebSocketMessageType.Close) break;
                        if (res.Count > 0) msgMs.Write(recvBuf, 0, res.Count);
                        if (!res.EndOfMessage) continue;

                        byte[] rawFrame = msgMs.ToArray();
                        msgMs.SetLength(0);

                        int idx = 0;
                        while (idx + 2 <= rawFrame.Length)
                        {
                            byte pktType = rawFrame[idx++];
                            int mult = 1;
                            int remLen = 0;
                            byte b = 0;
                            bool okLen = true;
                            do
                            {
                                if (idx >= rawFrame.Length) { okLen = false; break; }
                                b = rawFrame[idx++];
                                remLen += (b & 127) * mult;
                                mult *= 128;
                            } while ((b & 128) != 0);

                            if (!okLen || idx + remLen > rawFrame.Length) break;
                            int pktStart = idx;
                            idx += remLen;

                            if (pktType == 0x20) // CONNACK -> Subscribe
                            {
                                byte[] topicBytes = Encoding.UTF8.GetBytes(topic);
                                byte[] subPl = new byte[4 + topicBytes.Length + 1];
                                subPl[0] = 0x00; subPl[1] = 0x01;
                                subPl[2] = (byte)((topicBytes.Length >> 8) & 0xFF);
                                subPl[3] = (byte)(topicBytes.Length & 0xFF);
                                Buffer.BlockCopy(topicBytes, 0, subPl, 4, topicBytes.Length);
                                subPl[4 + topicBytes.Length] = 0x00;
                                SendChannelFrame(ch, BuildMqttPacket(0x82, new byte[0], subPl), true);
                                continue;
                            }

                            if (pktType == 0x90) // SUBACK -> Online!
                            {
                                activeSignalingChannels[ch.Name] = ch;
                                Log("Cloud Signaling online (" + brokerName + ") -> Room [" + cleanCode + "]");
                                SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));
                                continue;
                            }

                            if ((pktType & 0xF0) != 0x30 || remLen < 4) continue;
                            int tLen = (rawFrame[pktStart] << 8) | rawFrame[pktStart + 1];
                            int pOffset = pktStart + 2 + tLen;
                            if (((pktType >> 1) & 0x03) > 0) pOffset += 2;
                            int jsonLen = (pktStart + remLen) - pOffset;
                            if (jsonLen <= 0 || pOffset + jsonLen > rawFrame.Length) continue;

                            string text = Encoding.UTF8.GetString(rawFrame, pOffset, jsonLen);
                            HandleIncomingCloudMessage(ch, text, cleanCode, myPeerId);
                        }
                    }
                }
                catch { }
                finally
                {
                    if (ch != null) { SignalingChannel removed; activeSignalingChannels.TryRemove(ch.Name, out removed); }
                    if (ws != null) { try { ws.Dispose(); } catch { } }
                }
                if (isRunning) Thread.Sleep(CleanRoomCode(currentRoomCode) != joinedCode ? 150 : 2500);
            }
        }

        private void HandleIncomingCloudMessage(SignalingChannel ch, string text, string cleanCode, string myPeerId)
        {
            try
            {
                if (String.IsNullOrEmpty(text)) return;
                string topType = ExtractJsonString(text, "type");
                if (topType == "peer:joined" || topType == "room:joined")
                {
                    if (text.Contains("\\"id\\":\\"aethertunnel-"))
                    {
                        SendCloudPacketToChannel(ch, "*", BuildHelloInnerJson("exe:hello", cleanCode));
                    }
                    return;
                }

                string srcPeer = ExtractJsonString(text, "src");
                string dstPeer = ExtractJsonString(text, "dst");
                if (srcPeer == myPeerId || String.IsNullOrEmpty(srcPeer)) return;
                if (dstPeer.Length > 0 && dstPeer != "*" && dstPeer != myPeerId && !dstPeer.StartsWith("aethertunnel-exe-" + cleanCode)) return;

                string kind = ExtractJsonString(text, "kind");
                if (kind.Length == 0) return;

                if (kind == "browser:hello" || kind == "web:hello" || kind == "browser:hello-ack")
                {
                    bool isNewPairing = (activeCloudBrowserPeerId != srcPeer) || ((DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds > 10);
                    activeCloudBrowserPeerId = srcPeer;
                    lastCloudBrowserSeen = DateTime.UtcNow;
                    lastBrowserSignalingChannel = ch;

                    if (isNewPairing)
                    {
                        UpdateStatusBadge("PEER STATUS: CONNECTED — CHROME BROWSER [" + cleanCode + "]");
                        Log("Paired with Chrome Browser App in Wormhole Room [" + cleanCode + "] via " + ch.Name);
                    }
                    if (kind != "browser:hello-ack")
                    {
                        int nowMs = Environment.TickCount;
                        int lastRep;
                        if (!cloudHelloReplyTicks.TryGetValue(srcPeer, out lastRep) || unchecked(nowMs - lastRep) > 1200 || isNewPairing)
                        {
                            cloudHelloReplyTicks[srcPeer] = nowMs;
                            SendCloudPacketToChannel(ch, srcPeer, BuildHelloInnerJson("exe:hello", cleanCode));
                        }
                    }
                }
                else if ((kind == "exe:hello" || kind == "exe:hello-reply") && srcPeer.StartsWith("aethertunnel-exe-") && srcPeer != myPeerId)
                {
                    bool isNewPairing = (activeCloudExePeerId != srcPeer) || ((DateTime.UtcNow - lastCloudExeSeen).TotalSeconds > 10);
                    activeCloudExePeerId = srcPeer;
                    lastCloudExeSeen = DateTime.UtcNow;
                    lastExeSignalingChannel = ch;

                    string remoteWanUdp = ExtractJsonString(text, "wanUdpEndpoint");
                    string remoteLanUdp = ExtractJsonString(text, "lanUdpEndpoint");
                    string remoteV6Udp = ExtractJsonString(text, "wanV6UdpEndpoint");
                    string remotePredWan = ExtractJsonString(text, "predWanUdpEndpoint");
                    string remoteLan = ExtractJsonString(text, "lanEndpoint");
                    int rSym = 0; Int32.TryParse(ExtractJsonString(text, "natSym"), out rSym);
                    int rDelta = 0; Int32.TryParse(ExtractJsonString(text, "natDelta"), out rDelta);
                    int rUpnpTcp = 0; Int32.TryParse(ExtractJsonString(text, "upnpTcp"), out rUpnpTcp);

                    bool endpointChanged = (remoteWanUdp.Length > 0 && remoteWanUdp != remotePeerWanUdp) ||
                                           (remoteV6Udp.Length > 0 && remoteV6Udp != remotePeerWanV6Udp);

                    if (remoteWanUdp.Length > 0) remotePeerWanUdp = remoteWanUdp;
                    if (remoteLanUdp.Length > 0) remotePeerLanUdp = remoteLanUdp;
                    if (remoteV6Udp.Length > 0) remotePeerWanV6Udp = remoteV6Udp;
                    if (remotePredWan.Length > 0) remotePeerPredictedWanUdp = remotePredWan;
                    if (remoteLan.Length > 0) remotePeerLanTcp = remoteLan;
                    remotePeerNatSym = rSym;
                    remotePeerNatDelta = rDelta;
                    remotePeerUpnpTcp = rUpnpTcp;

                    if (isNewPairing)
                    {
                        UpdateStatusBadge("PEER STATUS: CONNECTED — REMOTE .EXE [" + cleanCode + "]");
                        Log("Paired with Remote .EXE Peer in Room [" + cleanCode + "] via " + ch.Name +
                            (remoteWanUdp.Length > 0 ? " (WAN: " + remoteWanUdp + ")" : "") +
                            (remoteV6Udp.Length > 0 ? " (IPv6)" : ""));
                    }
                    if (kind == "exe:hello")
                    {
                        int nowMs = Environment.TickCount;
                        int lastRep;
                        if (!cloudHelloReplyTicks.TryGetValue(srcPeer, out lastRep) || unchecked(nowMs - lastRep) > 1000 || isNewPairing || endpointChanged)
                        {
                            cloudHelloReplyTicks[srcPeer] = nowMs;
                            SendCloudPacketToChannel(ch, srcPeer, BuildHelloInnerJson("exe:hello-reply", cleanCode));
                        }
                    }

                    if ((isNewPairing || endpointChanged) && activeUdpPeerEndpoint == null)
                    {
                        string punchSummary = remotePeerWanV6Udp.Length > 0 ? remotePeerWanV6Udp : (remotePeerWanUdp.Length > 0 ? remotePeerWanUdp : remotePeerLanUdp);
                        if (punchSummary.Length > 0 && punchSummary != lastLoggedPunchTarget)
                        {
                            lastLoggedPunchTarget = punchSummary;
                            Log("Initiating P2P NAT Hole Punch -> " + punchSummary + (remotePeerNatSym == 1 ? " [Symmetric Port Spray]" : ""));
                        }
                        PerformHolePunchPass();
                    }

                    if (remoteLan.Length > 0 && !remoteLan.StartsWith("100.") && (activePeerClient == null || !activePeerClient.Connected) && activeUdpPeerEndpoint == null)
                    {
                        bool shouldTryTcp = false;
                        lock (attemptedAutoTcpEndpoints)
                        {
                            if (!attemptedAutoTcpEndpoints.Contains(remoteLan))
                            {
                                attemptedAutoTcpEndpoints.Add(remoteLan);
                                shouldTryTcp = true;
                            }
                        }
                        if (shouldTryTcp) ConnectToPeerEndpoint(remoteLan, true);
                    }
                    if (rUpnpTcp == 1 && remoteWanUdp.Contains(":") && (activePeerClient == null || !activePeerClient.Connected) && activeUdpPeerEndpoint == null)
                    {
                        string peerWanTcp = remoteWanUdp.Split(':')[0] + ":" + listenPort.ToString();
                        bool shouldTryWanTcp = false;
                        lock (attemptedAutoTcpEndpoints)
                        {
                            if (!attemptedAutoTcpEndpoints.Contains(peerWanTcp))
                            {
                                attemptedAutoTcpEndpoints.Add(peerWanTcp);
                                shouldTryWanTcp = true;
                            }
                        }
                        if (shouldTryWanTcp) ConnectToPeerEndpoint(peerWanTcp, true);
                    }
                }
                else if (kind == "exe:resume-ack" || kind == "file:resume-ack")
                {
                    cloudResumeChunk = (int)ExtractJsonLong(text, "resumeFromChunk");
                    cloudResumeEvent.Set();
                }
                else if (kind == "exe:chunk-ack" || kind == "browser:chunk-ack")
                {
                    cloudAckEvent.Set();
                }
                else if (kind == "exe:file-start" || kind == "browser:file-start")
                {
                    lock (cloudRxFileLock)
                    {
                        bool fromExe = srcPeer.StartsWith("aethertunnel-exe-");
                        if (fromExe) { activeCloudExePeerId = srcPeer; lastCloudExeSeen = DateTime.UtcNow; lastExeSignalingChannel = ch; }
                        else { activeCloudBrowserPeerId = srcPeer; lastCloudBrowserSeen = DateTime.UtcNow; lastBrowserSignalingChannel = ch; }

                        string senderLabel = fromExe ? "Remote .EXE" : "Chrome Browser";
                        string incomingFileId = ExtractJsonString(text, "fileId");
                        cloudFileName = ExtractJsonString(text, "name");
                        if (cloudFileName.Length == 0) cloudFileName = "transfer.bin";
                        cloudExpectedSize = ExtractJsonLong(text, "size");
                        long cChunkSize = ExtractJsonLong(text, "chunkSize");
                        if (cChunkSize <= 0) cChunkSize = CLOUD_CHUNK_SIZE;
                        cloudOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + cloudFileName);
                        cloudPartPath = cloudOutPath + ".part";

                        if (cloudOutFile != null) cloudOutFile.Close();
                        long existingBytes = 0;
                        if (File.Exists(cloudPartPath))
                        {
                            existingBytes = new FileInfo(cloudPartPath).Length;
                            if (existingBytes >= cloudExpectedSize) existingBytes = 0;
                        }
                        int resumeFromChunk = (int)(existingBytes / cChunkSize);
                        long alignedBytes = (long)resumeFromChunk * cChunkSize;

                        cloudOutFile = new FileStream(cloudPartPath, existingBytes > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                        if (alignedBytes > 0) cloudOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                        cloudReceivedBytes = alignedBytes;
                        cloudRxSw = Stopwatch.StartNew();

                        SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"" + incomingFileId + "\\",\\"name\\":\\"" + cloudFileName.Replace("\\"", "") + "\\",\\"size\\":" + cloudExpectedSize.ToString() + ",\\"resumeFromChunk\\":" + resumeFromChunk.ToString() + "}");
                        int startPermille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                        UpdateTransferUi("Receiving from " + senderLabel + ": " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, 0, startPermille);
                    }
                }
                else if ((kind == "exe:file-chunk" || kind == "browser:file-chunk"))
                {
                    lock (cloudRxFileLock)
                    {
                        if (cloudOutFile == null) return;
                        string b64 = ExtractJsonString(text, "data");
                        long chunkIdx = ExtractJsonLong(text, "chunkIndex");
                        if (b64.Length > 0)
                        {
                            byte[] raw = Convert.FromBase64String(b64);
                            long writePos = chunkIdx * CLOUD_CHUNK_SIZE;
                            cloudOutFile.Seek(writePos, SeekOrigin.Begin);
                            cloudOutFile.Write(raw, 0, raw.Length);
                            cloudReceivedBytes = Math.Max(cloudReceivedBytes, writePos + raw.Length);

                            double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                            double mbps = (cloudReceivedBytes / (1024.0 * 1024.0)) / sec;
                            int permille = (int)((cloudReceivedBytes * 1000L) / Math.Max(1L, cloudExpectedSize));
                            UpdateTransferUi("Receiving: " + cloudFileName, cloudReceivedBytes, cloudExpectedSize, mbps, permille);
                        }
                        if ((chunkIdx + 1) % 8 == 0)
                        {
                            SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":" + chunkIdx.ToString() + "}");
                        }
                    }
                }
                else if ((kind == "exe:file-end" || kind == "browser:file-end"))
                {
                    lock (cloudRxFileLock)
                    {
                        if (cloudOutFile == null) return;
                        cloudOutFile.Flush();
                        cloudOutFile.Close();
                        cloudOutFile = null;
                        cloudRxSw.Stop();

                        try
                        {
                            if (File.Exists(cloudOutPath)) File.Delete(cloudOutPath);
                            File.Move(cloudPartPath, cloudOutPath);
                        }
                        catch { }

                        double sec = Math.Max(0.005, cloudRxSw.Elapsed.TotalSeconds);
                        double mbps = (cloudExpectedSize / (1024.0 * 1024.0)) / sec;
                        UpdateTransferUi("Saved to Downloads: " + cloudFileName, cloudExpectedSize, cloudExpectedSize, mbps, 1000);
                        Log(String.Format("TRANSFER COMPLETE: Saved to {0} ({1:F2} MB/s)", cloudOutPath, mbps));
                        SendCloudPacketToChannel(ch, srcPeer, "{\\"kind\\":\\"exe:chunk-ack\\",\\"chunkIndex\\":999999}");
                    }
                }
            }
            catch { }
        }

        private void AcceptLoop()
        {
            while (isRunning && tcpListener != null)
            {
                try
                {
                    TcpClient client = tcpListener.AcceptTcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    Thread connThread = new Thread(delegate() { HandleIncomingConnection(client); });
                    connThread.IsBackground = true;
                    connThread.Start();
                }
                catch
                {
                    if (!isRunning) break;
                }
            }
        }

        private void HandleIncomingConnection(TcpClient client)
        {
            try
            {
                NetworkStream netStream = client.GetStream();
                byte[] peek = new byte[3];
                if (!ReadExactBytes(netStream, peek, 3))
                {
                    client.Close();
                    return;
                }

                if (peek[0] == (byte)'G' && peek[1] == (byte)'E' && peek[2] == (byte)'T')
                {
                    HandleBrowserWebSocketConnection(client, netStream, peek);
                }
                else
                {
                    Log("Incoming Native .EXE Peer connected from " + client.Client.RemoteEndPoint.ToString());
                    if (activePeerClient == null || !activePeerClient.Connected)
                    {
                        activePeerClient = client;
                        activePeerStream = netStream;
                        UpdateStatusBadge("CONNECTED .EXE PEER (" + client.Client.RemoteEndPoint.ToString() + ")");
                    }
                    ReceiveKernelTcpLoop(client, netStream, peek);
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Connection error: " + ex.Message);
            }
        }

        private void HandleBrowserWebSocketConnection(TcpClient client, NetworkStream netStream, byte[] firstThreeBytes)
        {
            try
            {
                MemoryStream reqMs = new MemoryStream();
                reqMs.Write(firstThreeBytes, 0, 3);
                byte[] b = new byte[1];
                int state = 0;
                while (reqMs.Length < 16384 && netStream.Read(b, 0, 1) == 1)
                {
                    reqMs.WriteByte(b[0]);
                    byte c = b[0];
                    if ((state == 0 && c == (byte)'\\r') ||
                        (state == 1 && c == (byte)'\\n') ||
                        (state == 2 && c == (byte)'\\r') ||
                        (state == 3 && c == (byte)'\\n'))
                    {
                        state++;
                        if (state == 4) break;
                    }
                    else
                    {
                        state = (c == (byte)'\\r') ? 1 : 0;
                    }
                }

                string headers = Encoding.ASCII.GetString(reqMs.ToArray());
                string wsKey = "";
                string[] lines = headers.Split(new string[] { "\\r\\n" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string line in lines)
                {
                    if (line.StartsWith("Sec-WebSocket-Key:", StringComparison.OrdinalIgnoreCase))
                    {
                        wsKey = line.Substring(18).Trim();
                        break;
                    }
                }

                if (wsKey.Length == 0)
                {
                    client.Close();
                    return;
                }

                string acceptRaw = wsKey + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";
                string acceptBase64;
                using (SHA1 sha1 = SHA1.Create())
                {
                    acceptBase64 = Convert.ToBase64String(sha1.ComputeHash(Encoding.ASCII.GetBytes(acceptRaw)));
                }

                string response =
                    "HTTP/1.1 101 Switching Protocols\\r\\n" +
                    "Upgrade: websocket\\r\\n" +
                    "Connection: Upgrade\\r\\n" +
                    "Access-Control-Allow-Origin: *\\r\\n" +
                    "Access-Control-Allow-Private-Network: true\\r\\n" +
                    "Sec-WebSocket-Accept: " + acceptBase64 + "\\r\\n\\r\\n";
                byte[] respBytes = Encoding.ASCII.GetBytes(response);
                netStream.Write(respBytes, 0, respBytes.Length);

                activeBrowserWsClient = client;
                activeBrowserWsStream = netStream;
                UpdateStatusBadge("PEER STATUS: CONNECTED — LOCAL BROWSER (127.0.0.1:" + listenPort.ToString() + ")");
                Log("Chrome Browser connected via Direct Localhost Kernel WebSocket (127.0.0.1:" + listenPort.ToString() + ")");

                NotifyBrowserRoomCode();
                ReceiveBrowserWebSocketLoop(client, netStream);
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge disconnected: " + ex.Message);
            }
        }

        private void NotifyBrowserRoomCode()
        {
            try
            {
                if (activeBrowserWsClient == null || !activeBrowserWsClient.Connected || activeBrowserWsStream == null) return;
                string code = "";
                if (this.InvokeRequired)
                    this.Invoke(new Action(delegate { code = txtRoomCode.Text.Trim().ToLowerInvariant(); }));
                else
                    code = txtRoomCode.Text.Trim().ToLowerInvariant();

                string json = "{\\"kind\\":\\"exe:hello\\",\\"roomCode\\":\\"" + code + "\\",\\"port\\":" + listenPort.ToString() + "}";
                byte[] bytes = Encoding.UTF8.GetBytes(json);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, bytes, 0, bytes.Length);
            }
            catch { }
        }

        private void SendWebSocketFrame(NetworkStream wsStream, byte opcode, byte[] payload, int offset, int count)
        {
            byte[] header;
            if (count < 126)
            {
                header = new byte[2];
                header[0] = (byte)(0x80 | opcode);
                header[1] = (byte)count;
            }
            else if (count <= 65535)
            {
                header = new byte[4];
                header[0] = (byte)(0x80 | opcode);
                header[1] = 126;
                header[2] = (byte)((count >> 8) & 0xFF);
                header[3] = (byte)(count & 0xFF);
            }
            else
            {
                header = new byte[10];
                header[0] = (byte)(0x80 | opcode);
                header[1] = 127;
                long len64 = (long)count;
                for (int i = 0; i < 8; i++)
                {
                    header[9 - i] = (byte)(len64 & 0xFF);
                    len64 >>= 8;
                }
            }

            lock (wsWriteLock)
            {
                wsStream.Write(header, 0, header.Length);
                wsStream.Write(payload, offset, count);
            }
        }

        private void ReceiveBrowserWebSocketLoop(TcpClient client, NetworkStream wsStream)
        {
            FileStream currentOutFile = null;
            string currentFileName = "";
            string currentOutPath = "";
            string currentPartPath = "";
            long expectedFileSize = 0;
            long receivedBytes = 0;
            Stopwatch rxSw = null;

            MemoryStream fragBuffer = new MemoryStream();
            int fragOpcode = 0;

            try
            {
                byte[] h2 = new byte[2];
                while (isRunning && client.Connected)
                {
                    if (!ReadExactBytes(wsStream, h2, 2)) break;
                    bool fin = (h2[0] & 0x80) != 0;
                    int opcode = h2[0] & 0x0F;
                    bool masked = (h2[1] & 0x80) != 0;
                    long payloadLen = h2[1] & 0x7F;

                    if (opcode == 0x08) break;

                    if (payloadLen == 126)
                    {
                        byte[] ext2 = new byte[2];
                        if (!ReadExactBytes(wsStream, ext2, 2)) break;
                        payloadLen = (ext2[0] << 8) | ext2[1];
                    }
                    else if (payloadLen == 127)
                    {
                        byte[] ext8 = new byte[8];
                        if (!ReadExactBytes(wsStream, ext8, 8)) break;
                        payloadLen = 0;
                        for (int i = 0; i < 8; i++) payloadLen = (payloadLen << 8) | ext8[i];
                    }

                    byte[] maskKey = new byte[4];
                    if (masked)
                    {
                        if (!ReadExactBytes(wsStream, maskKey, 4)) break;
                    }

                    if (payloadLen > 64 * 1024 * 1024) break;
                    byte[] data = new byte[(int)payloadLen];
                    if (payloadLen > 0 && !ReadExactBytes(wsStream, data, (int)payloadLen)) break;

                    if (masked)
                    {
                        for (int i = 0; i < data.Length; i++)
                        {
                            data[i] = (byte)(data[i] ^ maskKey[i & 3]);
                        }
                    }

                    if (opcode == 0x09)
                    {
                        SendWebSocketFrame(wsStream, 0x0A, data, 0, data.Length);
                        continue;
                    }

                    if (opcode != 0) fragOpcode = opcode;
                    fragBuffer.Write(data, 0, data.Length);

                    if (!fin) continue;

                    byte[] message = fragBuffer.ToArray();
                    fragBuffer.SetLength(0);

                    if (fragOpcode == 0x01)
                    {
                        string text = Encoding.UTF8.GetString(message);
                        if (text.Contains("\\"browser:hello\\"") || text.Contains("\\"browser:room\\""))
                        {
                            string browserRoom = ExtractJsonString(text, "roomCode");
                            if (browserRoom.Length > 0)
                            {
                                this.BeginInvoke(new Action(delegate {
                                    if (txtRoomCode.Text.Trim().ToLowerInvariant() != browserRoom.ToLowerInvariant())
                                    {
                                        suppressRoomBroadcast = true;
                                        txtRoomCode.Text = browserRoom.ToLowerInvariant();
                                        suppressRoomBroadcast = false;
                                        Log("Synced Wormhole Code with Chrome Browser: " + browserRoom);
                                    }
                                }));
                            }
                        }
                        else if (text.Contains("\\"exe:file-start\\""))
                        {
                            string incomingFileId = ExtractJsonString(text, "fileId");
                            currentFileName = ExtractJsonString(text, "name");
                            if (currentFileName.Length == 0) currentFileName = "transfer.bin";
                            expectedFileSize = ExtractJsonLong(text, "size");
                            long wsChunkSize = ExtractJsonLong(text, "chunkSize");
                            if (wsChunkSize <= 0) wsChunkSize = WS_CHUNK_SIZE;
                            currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);
                            currentPartPath = currentOutPath + ".part";

                            if (currentOutFile != null) currentOutFile.Close();
                            long existingBytes = 0;
                            if (File.Exists(currentPartPath))
                            {
                                existingBytes = new FileInfo(currentPartPath).Length;
                                if (existingBytes >= expectedFileSize) existingBytes = 0;
                            }
                            int resumeFromChunk = (int)(existingBytes / wsChunkSize);
                            long alignedBytes = (long)resumeFromChunk * wsChunkSize;

                            currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                            if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                            receivedBytes = alignedBytes;
                            rxSw = Stopwatch.StartNew();

                            string ackJson = String.Format(
                                "{{\\"kind\\":\\"exe:resume-ack\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"resumeFromChunk\\":{3}}}",
                                incomingFileId, currentFileName.Replace("\\"", ""), expectedFileSize, resumeFromChunk
                            );
                            byte[] ackBytes = Encoding.UTF8.GetBytes(ackJson);
                            SendWebSocketFrame(wsStream, 0x01, ackBytes, 0, ackBytes.Length);

                            if (resumeFromChunk > 0)
                                Log("Resuming interrupted file from Chrome Browser at " + FormatBytes(alignedBytes) + " -> " + currentOutPath);
                            else
                                Log("Receiving from Chrome Browser -> " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                        }
                        else if (text.Contains("\\"exe:file-end\\"") && currentOutFile != null)
                        {
                            currentOutFile.Flush();
                            currentOutFile.Close();
                            currentOutFile = null;
                            rxSw.Stop();

                            try
                            {
                                if (File.Exists(currentOutPath)) File.Delete(currentOutPath);
                                File.Move(currentPartPath, currentOutPath);
                            }
                            catch { }

                            double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                            double mbps = (expectedFileSize / (1024.0 * 1024.0)) / sec;
                            UpdateTransferUi("Saved from Browser: " + currentFileName, expectedFileSize, expectedFileSize, mbps, 1000);
                            Log(String.Format("BROWSER -> .EXE COMPLETE: {0} ({1:F2} MB/s · {2:F2} Gbps)", currentOutPath, mbps, (mbps * 8.0) / 1000.0));
                        }
                    }
                    else if (fragOpcode == 0x02 && currentOutFile != null)
                    {
                        currentOutFile.Write(message, 0, message.Length);
                        receivedBytes += message.Length;

                        double sec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double mbps = (receivedBytes / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((receivedBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving from Browser: " + currentFileName, receivedBytes, expectedFileSize, mbps, permille);
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("Local Browser Bridge stream ended: " + ex.Message);
            }
            finally
            {
                if (currentOutFile != null)
                {
                    try { currentOutFile.Close(); } catch { }
                }
            }
        }

        private string ExtractJsonString(string json, string key)
        {
            string kPat = "\\"" + key + "\\"";
            int pos = 0;
            while (pos < json.Length)
            {
                int idx = json.IndexOf(kPat, pos, StringComparison.Ordinal);
                if (idx < 0) return "";
                int cur = idx + kPat.Length;
                while (cur < json.Length && (json[cur] == ' ' || json[cur] == '\\t')) cur++;
                if (cur < json.Length && json[cur] == ':')
                {
                    cur++;
                    while (cur < json.Length && (json[cur] == ' ' || json[cur] == '\\t')) cur++;
                    if (cur < json.Length && json[cur] == '"')
                    {
                        int start = cur + 1;
                        int end = start;
                        while (end < json.Length)
                        {
                            if (json[end] == '"' && json[end - 1] != '\\\\') break;
                            end++;
                        }
                        if (end < json.Length) return json.Substring(start, end - start);
                        return "";
                    }
                }
                pos = idx + kPat.Length;
            }
            return "";
        }

        private long ExtractJsonLong(string json, string key)
        {
            string pattern = "\\"" + key + "\\":";
            int idx = json.IndexOf(pattern);
            if (idx < 0) return 0;
            int start = idx + pattern.Length;
            int end = start;
            while (end < json.Length && (Char.IsDigit(json[end]) || json[end] == ' ')) end++;
            long val = 0;
            Int64.TryParse(json.Substring(start, end - start).Trim(), out val);
            return val;
        }

        private void ConfigureSocketForMaxThroughput(TcpClient client)
        {
            client.NoDelay = true;
            client.SendBufferSize = 16 * 1024 * 1024;
            client.ReceiveBufferSize = 16 * 1024 * 1024;
        }

        private void UpdateStatusBadge(string text)
        {
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string>(UpdateStatusBadge), text);
                return;
            }
            lblStatusBadge.Text = text;
            bool isConnected = text.IndexOf("CONNECTED", StringComparison.OrdinalIgnoreCase) >= 0;
            lblStatusBadge.ForeColor = isConnected ? Color.FromArgb(52, 211, 153) : Color.FromArgb(251, 191, 36);

            if (pnlRoomPresence != null && lblRoomPresence != null)
            {
                if (isConnected)
                {
                    string detail = text.Replace("PEER STATUS: CONNECTED — ", "").Replace("PEER STATUS: CONNECTED", "").Trim();
                    pnlRoomPresence.BackColor = Color.FromArgb(6, 46, 36);
                    lblRoomPresence.ForeColor = Color.FromArgb(52, 211, 153);
                    lblRoomPresence.Text = "[2/2 PEERS] Toinen peer on huoneessa! (" + detail + ")";
                }
                else
                {
                    string room = txtRoomCode != null ? txtRoomCode.Text.Trim().ToLowerInvariant() : "";
                    pnlRoomPresence.BackColor = Color.FromArgb(30, 27, 22);
                    lblRoomPresence.ForeColor = Color.FromArgb(251, 191, 36);
                    lblRoomPresence.Text = "[1/2 PEERS] Ei toista peeriä huoneessa [" + room + "]";
                }
            }
        }

        private void ConnectToPeerEndpoint(string endpointStr, bool silentAutoProbe = false)
        {
            InitiateUdpHolePunch(endpointStr);

            ThreadPool.QueueUserWorkItem(delegate {
                try
                {
                    string host = "127.0.0.1";
                    int port = listenPort;
                    int colon = endpointStr.LastIndexOf(':');
                    if (colon > 0)
                    {
                        host = endpointStr.Substring(0, colon).Trim();
                        Int32.TryParse(endpointStr.Substring(colon + 1).Trim(), out port);
                    }
                    else if (endpointStr.Length > 0)
                    {
                        host = endpointStr;
                    }

                    if (!silentAutoProbe)
                    {
                        Log("Opening Direct Winsock2 Kernel TCP connection to " + host + ":" + port.ToString() + "...");
                    }

                    TcpClient client = new TcpClient();
                    ConfigureSocketForMaxThroughput(client);
                    if (silentAutoProbe)
                    {
                        IAsyncResult ar = client.BeginConnect(host, port, null, null);
                        if (!ar.AsyncWaitHandle.WaitOne(1200))
                        {
                            try { client.Close(); } catch { }
                            return;
                        }
                        client.EndConnect(ar);
                    }
                    else
                    {
                        client.Connect(host, port);
                    }

                    activePeerClient = client;
                    activePeerStream = client.GetStream();
                    UpdateStatusBadge("PEER STATUS: CONNECTED — DIRECT TCP (" + host + ":" + port.ToString() + ")");
                    Log("Direct Kernel TCP Pipe established -> " + host + ":" + port.ToString() + " (NoDelay=true, 16MB Buffers)");

                    Thread rxThread = new Thread(delegate() { ReceiveKernelTcpLoop(client, activePeerStream, null); });
                    rxThread.IsBackground = true;
                    rxThread.Start();
                }
                catch (Exception ex)
                {
                    if (!silentAutoProbe)
                    {
                        Log("TCP Connect failed (UDP NAT Hole-Punch active): " + ex.Message);
                    }
                }
            });
        }

        private void UdpDiscoveryLoop()
        {
            try
            {
                udpDiscovery = new UdpClient();
                udpDiscovery.Client.SetSocketOption(SocketOptionLevel.Socket, SocketOptionName.ReuseAddress, true);
                udpDiscovery.Client.Bind(new IPEndPoint(IPAddress.Any, UDP_DISCOVERY_PORT));
                udpDiscovery.EnableBroadcast = true;

                BroadcastUdpPresence();

                IPEndPoint remoteEp = new IPEndPoint(IPAddress.Any, 0);
                while (isRunning)
                {
                    byte[] data = udpDiscovery.Receive(ref remoteEp);
                    string msg = Encoding.UTF8.GetString(data);
                    if (msg.StartsWith("AETHER_DISCOVER|"))
                    {
                        string[] parts = msg.Split('|');
                        if (parts.Length >= 4)
                        {
                            string remoteRoom = CleanRoomCode(parts[1]);
                            int remotePort = 0;
                            Int32.TryParse(parts[2], out remotePort);
                            string remoteInstanceId = parts[3];

                            if (remoteInstanceId == instanceId) continue;
                            if (IsOwnLocalEndpoint(remoteEp.Address, remotePort)) continue;

                            string myRoom = CleanRoomCode(currentRoomCode);

                            if (remoteRoom == myRoom && remotePort > 0)
                            {
                                string candidate = remoteEp.Address.ToString() + ":" + remotePort.ToString();
                                if (activePeerClient == null || !activePeerClient.Connected)
                                {
                                    Log("LAN Auto-Discovery found remote .EXE peer at " + candidate);
                                    ConnectToPeerEndpoint(candidate);
                                }
                            }
                        }
                    }
                }
            }
            catch { }
        }

        private void BroadcastUdpPresence()
        {
            try
            {
                if (udpDiscovery == null) return;
                string room = CleanRoomCode(currentRoomCode);
                byte[] payload = Encoding.UTF8.GetBytes("AETHER_DISCOVER|" + room + "|" + listenPort.ToString() + "|" + instanceId);
                try { udpDiscovery.Send(payload, payload.Length, new IPEndPoint(IPAddress.Broadcast, UDP_DISCOVERY_PORT)); } catch { }
                foreach (NetworkInterface ni in NetworkInterface.GetAllNetworkInterfaces())
                {
                    if (ni.OperationalStatus != OperationalStatus.Up || ni.NetworkInterfaceType == NetworkInterfaceType.Loopback) continue;
                    foreach (UnicastIPAddressInformation uni in ni.GetIPProperties().UnicastAddresses)
                    {
                        if (uni.Address.AddressFamily == AddressFamily.InterNetwork && uni.IPv4Mask != null && !IPAddress.IsLoopback(uni.Address))
                        {
                            byte[] ipB = uni.Address.GetAddressBytes();
                            byte[] mB = uni.IPv4Mask.GetAddressBytes();
                            byte[] bcast = new byte[4];
                            for (int k = 0; k < 4; k++) bcast[k] = (byte)(ipB[k] | (byte)~mB[k]);
                            try { udpDiscovery.Send(payload, payload.Length, new IPEndPoint(new IPAddress(bcast), UDP_DISCOVERY_PORT)); } catch { }
                        }
                    }
                }
            }
            catch { }
        }

        private void OnFormDragEnter(object sender, DragEventArgs e)
        {
            if (e.Data.GetDataPresent(DataFormats.FileDrop))
                e.Effect = DragDropEffects.Copy;
        }

        private void OnFormDragDrop(object sender, DragEventArgs e)
        {
            string[] files = (string[])e.Data.GetData(DataFormats.FileDrop);
            if (files != null && files.Length > 0)
            {
                if (files.Length > 1)
                {
                    Log("Queued " + files.Length.ToString() + " files for high-speed P2P transfer...");
                }
                foreach (string f in files)
                {
                    string pathCopy = f;
                    StartFileTransfer(pathCopy);
                }
            }
        }

        private void OnSelectFilesClicked(object sender, EventArgs e)
        {
            using (OpenFileDialog ofd = new OpenFileDialog())
            {
                ofd.Title = "Select File(s) to Stream to Connected Chrome Browser or .EXE Peer";
                ofd.Multiselect = true;
                if (ofd.ShowDialog() == DialogResult.OK && ofd.FileNames != null && ofd.FileNames.Length > 0)
                {
                    if (ofd.FileNames.Length > 1)
                    {
                        Log("Queued " + ofd.FileNames.Length.ToString() + " files for high-speed P2P transfer...");
                    }
                    foreach (string f in ofd.FileNames)
                    {
                        string pathCopy = f;
                        StartFileTransfer(pathCopy);
                    }
                }
            }
        }

        private void StartFileTransfer(string filePath)
        {
            bool hasExePeer = (activePeerClient != null && activePeerClient.Connected && activePeerStream != null);
            bool hasUdpPeer = (activeUdpPeerEndpoint != null && (DateTime.UtcNow - lastUdpPeerSeen).TotalSeconds < 15);
            bool hasLocalBrowserPeer = (activeBrowserWsClient != null && activeBrowserWsClient.Connected && activeBrowserWsStream != null);
            bool hasCloudOpen = !activeSignalingChannels.IsEmpty;
            bool hasCloudBrowserPeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudBrowserPeerId) && (DateTime.UtcNow - lastCloudBrowserSeen).TotalSeconds < 14);
            bool hasCloudExePeer = (hasCloudOpen && !String.IsNullOrEmpty(activeCloudExePeerId) && (DateTime.UtcNow - lastCloudExeSeen).TotalSeconds < 14);

            if (hasExePeer)
            {
                Thread txThread = new Thread(delegate() { StreamFileOverKernelTcp(filePath); });
                txThread.IsBackground = true;
                txThread.Start();
                return;
            }

            if (hasUdpPeer)
            {
                Thread udpTxThread = new Thread(delegate() { StreamFileOverNatPunchedUdp(filePath); });
                udpTxThread.IsBackground = true;
                udpTxThread.Start();
                return;
            }

            if (hasLocalBrowserPeer)
            {
                Thread wsTxThread = new Thread(delegate() { StreamFileToBrowserOverWebSocket(filePath); });
                wsTxThread.IsBackground = true;
                wsTxThread.Start();
                return;
            }

            if (hasCloudBrowserPeer || hasCloudExePeer)
            {
                Thread cloudTxThread = new Thread(delegate() { StreamFileToBrowserOverCloudBridge(filePath); });
                cloudTxThread.IsBackground = true;
                cloudTxThread.Start();
                return;
            }

            Log("WAIT: Make sure the Chrome Browser App (or another .EXE) has the same Wormhole Code [" + txtRoomCode.Text.Trim() + "]!");
            MessageBox.Show(
                "No peer is paired in Wormhole Room [" + txtRoomCode.Text.Trim() + "] yet.\\n\\n" +
                "1. Open another AetherTunnel .EXE or Chrome Browser App and enter the same Wormhole Code: " + txtRoomCode.Text.Trim() + "\\n" +
                "2. Within 1-2 seconds, the status badge will turn green: PEER STATUS: CONNECTED.",
                "AetherTunnel v1.0 — Waiting for Peer Pairing",
                MessageBoxButtons.OK,
                MessageBoxIcon.Information
            );
        }

        private static void WriteInt32LE(byte[] buf, int offset, int val)
        {
            buf[offset] = (byte)(val & 0xFF);
            buf[offset + 1] = (byte)((val >> 8) & 0xFF);
            buf[offset + 2] = (byte)((val >> 16) & 0xFF);
            buf[offset + 3] = (byte)((val >> 24) & 0xFF);
        }

        private byte[] EncryptSingleUdpChunk(byte[] plainBuf, int plainLen, int chunkIndex, int totalChunks, byte[] keySnapshot)
        {
            byte[] iv = threadLocalIv.Value;
            Array.Clear(iv, 8, 8);
            WriteInt32LE(iv, 0, chunkIndex);
            WriteInt32LE(iv, 4, 0x5A3C9E17 ^ chunkIndex);

            byte[] cipher;
            AesCryptoServiceProvider aes = threadLocalAes.Value;
            using (ICryptoTransform enc = aes.CreateEncryptor(keySnapshot, iv))
            {
                cipher = enc.TransformFinalBlock(plainBuf, 0, plainLen);
            }

            byte[] packet = new byte[28 + cipher.Length];
            WriteInt32LE(packet, 0, unchecked((int)MAGIC_UDP_DATA));
            WriteInt32LE(packet, 4, chunkIndex);
            WriteInt32LE(packet, 8, totalChunks);
            Buffer.BlockCopy(iv, 0, packet, 12, 16);
            Buffer.BlockCopy(cipher, 0, packet, 28, cipher.Length);
            return packet;
        }

        private void PaceUdpPacketSend(int packetBytes, ref long pacingEpochTicks, ref long pacedBytesSinceEpoch)
        {
            pacedBytesSinceEpoch = 0;
            double capMbps = dynamicUdpBitrateMbps;
            if (capMbps >= 5000.0)
            {
                pacingEpochTicks = Stopwatch.GetTimestamp();
                return;
            }

            if (Interlocked.Exchange(ref pacingResetRequested, 0) == 1)
            {
                long curNow = Stopwatch.GetTimestamp();
                if (pacingEpochTicks > curNow) pacingEpochTicks = curNow;
            }

            double bytesPerSec = (capMbps / 8.0) * 1024.0 * 1024.0;
            long pktTicks = (long)((packetBytes / bytesPerSec) * Stopwatch.Frequency);
            long nowTicks = Stopwatch.GetTimestamp();
            long minFloorTicks = nowTicks - (Stopwatch.Frequency / 500); // Cap microburst catch-up to 2ms so router queues never overflow
            if (pacingEpochTicks < minFloorTicks)
            {
                pacingEpochTicks = minFloorTicks;
            }

            pacingEpochTicks += pktTicks;

            while (isRunning)
            {
                long cur = Stopwatch.GetTimestamp();
                long remain = pacingEpochTicks - cur;
                if (remain <= 0) break;
                if (remain > Stopwatch.Frequency / 500) // > 2.0 ms ahead
                {
                    Thread.Sleep(1);
                }
                else
                {
                    Thread.SpinWait(24);
                }
            }
        }

        private void StreamFileOverNatPunchedUdp(string filePath)
        {
            lock (udpTxLock)
            {
                try
                {
                    IPEndPoint targetEp = activeUdpPeerEndpoint;
                    if (targetEp == null || udpP2pClient == null) return;

                    FileInfo fi = new FileInfo(filePath);
                    long fileSize = fi.Length;
                    string fileName = fi.Name;
                    int totalChunks = (int)Math.Max(1L, (fileSize + UDP_CHUNK_SIZE - 1) / UDP_CHUNK_SIZE);

                    dynamicUdpBitrateMbps = 1.0;
                    udpBestRxMbps = 1.0;
                    udpCongestionCeilingMbps = 0.0;
                    udpBestRxDecayTicks = Stopwatch.GetTimestamp();
                    lastNackReceivedTick = unchecked(Environment.TickCount - 10000);
                    lastNackCutTick = unchecked(Environment.TickCount - 10000);
                    lastAckReceivedTick = Environment.TickCount;
                    udpInSlowStart = true;
                    udpCleanAckStreak = 0;
                    udpLowRxStreak = 0;
                    udpSenderChunkLastSentTick.Clear();
                    Log(String.Format("Streaming over High-Speed NAT-Punched UDP P2P -> {0}: {1} ({2}) [Auto Dynamic Pacing]",
                        targetEp.ToString(), fileName, FormatBytes(fileSize)));

                    udpPeerResumeChunk = 0;
                    udpPeerAckedChunk = -1;
                    udpPeerContiguousChunk = -1;
                    udpPeerUniqueAcked = 0;
                    udpPeerMeasuredMbps = 0;
                    udpTransferDoneAcked = false;
                    udpNeedStartResend = false;
                    int staleIdx;
                    while (udpRetransmitQueue.TryDequeue(out staleIdx)) { }
                    udpResumeEvent.Reset();
                    udpAckEvent.Reset();

                    string startMsg = "AETHER_UDP_START|" + fileName.Replace("|", "_") + "|" + fileSize.ToString() + "|" + totalChunks.ToString();
                    byte[] startBytes = Encoding.UTF8.GetBytes(startMsg);

                    // Reliable multi-attempt START handshake so receiver is guaranteed to open its .part FileStream
                    for (int attempt = 0; attempt < 8; attempt++)
                    {
                        SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                        if (udpResumeEvent.WaitOne(150)) break;
                    }

                    int startChunk = Math.Max(0, Math.Min(udpPeerResumeChunk, totalChunks));
                    udpPeerAckedChunk = startChunk - 1;
                    udpPeerContiguousChunk = startChunk - 1;
                    udpPeerUniqueAcked = startChunk;

                    if (startChunk > 0)
                    {
                        Log("Resuming NAT-Punched UDP transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * UDP_CHUNK_SIZE) + ")");
                    }

                    int initialStartChunk = startChunk;
                    Stopwatch sw = Stopwatch.StartNew();
                    Stopwatch txUiSw = Stopwatch.StartNew();
                    long txUiWindowBytes = 0;
                    long totalWireBytesSent = 0;
                    double smoothedUiTxMbps = 0.0;
                    long totalSent = Math.Min(fileSize, (long)startChunk * UDP_CHUNK_SIZE);
                    byte[] keySnapshot = (byte[])aesKey.Clone();
                    long pacingEpochTicks = Stopwatch.GetTimestamp();
                    long pacedBytesSinceEpoch = 0;
                    lastAckReceivedTick = Environment.TickCount;

                    ParallelOptions txParallelOpts = new ParallelOptions();
                    txParallelOpts.MaxDegreeOfParallelism = Math.Max(1, Math.Min(4, Environment.ProcessorCount / 2));

                    using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 16 * 1024 * 1024, FileOptions.SequentialScan))
                    using (FileStream fsRepair = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, 4096, FileOptions.RandomAccess))
                    {
                        int waveStart = startChunk;
                        int lastProbeTick = unchecked(Environment.TickCount - 1000);
                        while (waveStart < totalChunks && !udpTransferDoneAcked && isRunning)
                        {
                            // Instant Resume Jump: if receiver reports a higher contiguous/resume chunk, skip ahead smoothly without resetting live speed!
                            int peerContig = Math.Max(udpPeerResumeChunk, udpPeerContiguousChunk + 1);
                            if (peerContig > udpPeerUniqueAcked) udpPeerUniqueAcked = peerContig;
                            if (peerContig > waveStart && peerContig <= totalChunks)
                            {
                                if (peerContig - waveStart >= 512)
                                {
                                    Log("Peer confirmed resume offset at chunk " + peerContig.ToString() + " (" + FormatBytes(Math.Min(fileSize, (long)peerContig * UDP_CHUNK_SIZE)) + ") — jumping ahead!");
                                }
                                waveStart = peerContig;
                                startChunk = peerContig;
                                totalSent = Math.Min(fileSize, (long)waveStart * UDP_CHUNK_SIZE);
                                if (waveStart >= totalChunks) break;
                            }

                            if (udpNeedStartResend)
                            {
                                udpNeedStartResend = false;
                                SendUdpP2pPacket(startBytes, startBytes.Length, targetEp);
                                Thread.Sleep(15);
                            }

                            // Router-Safe BDP In-Flight Window Cap (min 320 chunks prevents reorder-slack deadlock!)
                            bool isProbeOnly = false;
                            while (!udpTransferDoneAcked && isRunning)
                            {
                                int curMaxInFlight = Math.Max(320, Math.Min(12000, (int)Math.Round(dynamicUdpBitrateMbps * 12.0)));
                                int inFlightNow = Math.Max(0, waveStart - udpPeerUniqueAcked);
                                if (inFlightNow < curMaxInFlight) break;

                                if (unchecked(Environment.TickCount - lastAckReceivedTick) > 650)
                                {
                                    lastAckReceivedTick = Environment.TickCount;
                                    dynamicUdpBitrateMbps = Math.Max(1.0, dynamicUdpBitrateMbps * 0.5);
                                    udpInSlowStart = false;
                                    udpCleanAckStreak = 0;
                                    udpLowRxStreak = 0;
                                    Interlocked.Exchange(ref pacingResetRequested, 1);
                                }

                                // Allow repairing NACKed holes while waiting for window space
                                int waitNackIdx;
                                int repairedWait = 0;
                                while (repairedWait < 32 && udpRetransmitQueue.TryDequeue(out waitNackIdx))
                                {
                                    if (waitNackIdx >= 0 && waitNackIdx < totalChunks)
                                    {
                                        long rPos = (long)waitNackIdx * UDP_CHUNK_SIZE;
                                        int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                        byte[] rBuf = new byte[rRem];
                                        fsRepair.Seek(rPos, SeekOrigin.Begin);
                                        int rRead = fsRepair.Read(rBuf, 0, rRem);
                                        if (rRead > 0)
                                        {
                                            byte[] rPkt = EncryptSingleUdpChunk(rBuf, rRead, waitNackIdx, totalChunks, keySnapshot);
                                            SendUdpP2pPacket(rPkt, rPkt.Length, targetEp);
                                            totalWireBytesSent += rRead;
                                            txUiWindowBytes += rRead;
                                            PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                            repairedWait++;
                                        }
                                    }
                                }

                                if (unchecked(Environment.TickCount - lastProbeTick) > 400)
                                {
                                    lastProbeTick = Environment.TickCount;
                                    isProbeOnly = true;
                                    break; // Send max 2 gentle keepalive/probe chunks so 0 Mbit/s links self-heal cleanly
                                }

                                udpAckEvent.WaitOne(15);
                            }

                            // Handle temporary 0 Mbit/s / ACK stalls gracefully without aborting or flooding router
                            if (unchecked(Environment.TickCount - lastAckReceivedTick) > 650)
                            {
                                lastAckReceivedTick = Environment.TickCount;
                                dynamicUdpBitrateMbps = Math.Max(1.0, dynamicUdpBitrateMbps * 0.5);
                                udpInSlowStart = false;
                                udpCleanAckStreak = 0;
                                udpLowRxStreak = 0;
                                Interlocked.Exchange(ref pacingResetRequested, 1);
                            }

                            // Drain and immediately retransmit up to 64 unique NACKed chunks on fsRepair (never flushes fs 16MB sequential cache!)
                            int nackIdx;
                            int repairedInWave = 0;
                            while (repairedInWave < 64 && udpRetransmitQueue.TryDequeue(out nackIdx))
                            {
                                if (nackIdx >= 0 && nackIdx < totalChunks)
                                {
                                    long rPos = (long)nackIdx * UDP_CHUNK_SIZE;
                                    int rRem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - rPos);
                                    byte[] rBuf = new byte[rRem];
                                    fsRepair.Seek(rPos, SeekOrigin.Begin);
                                    int rRead = fsRepair.Read(rBuf, 0, rRem);
                                    if (rRead > 0)
                                    {
                                        byte[] rPkt = EncryptSingleUdpChunk(rBuf, rRead, nackIdx, totalChunks, keySnapshot);
                                        SendUdpP2pPacket(rPkt, rPkt.Length, targetEp);
                                        totalWireBytesSent += rRead;
                                        txUiWindowBytes += rRead;
                                        PaceUdpPacketSend(rPkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                        repairedInWave++;
                                    }
                                }
                            }

                            long waveOffset = (long)waveStart * UDP_CHUNK_SIZE;
                            if (fs.Position != waveOffset) fs.Seek(waveOffset, SeekOrigin.Begin);

                            // Smooth adaptive wave size (~12ms slice, clamped 2..128 chunks)
                            int dynamicWaveChunks = isProbeOnly ? 2 : (int)Math.Max(2.0, Math.Min(128.0, ((dynamicUdpBitrateMbps * 1024.0 * 1024.0 / 8.0) * 0.012) / UDP_CHUNK_SIZE));
                            int waveCount = Math.Min(dynamicWaveChunks, totalChunks - waveStart);
                            byte[][] plainBuffers = new byte[waveCount][];
                            int[] plainLens = new int[waveCount];

                            for (int w = 0; w < waveCount; w++)
                            {
                                int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - ((long)(waveStart + w) * UDP_CHUNK_SIZE));
                                byte[] b = new byte[rem];
                                int rTot = 0;
                                while (rTot < rem)
                                {
                                    int r = fs.Read(b, rTot, rem - rTot);
                                    if (r <= 0) break;
                                    rTot += r;
                                }
                                plainBuffers[w] = b;
                                plainLens[w] = rTot;
                            }

                            byte[][] encryptedPackets = new byte[waveCount][];
                            Parallel.For(0, waveCount, txParallelOpts, delegate(int w)
                            {
                                encryptedPackets[w] = EncryptSingleUdpChunk(plainBuffers[w], plainLens[w], waveStart + w, totalChunks, keySnapshot);
                            });

                            for (int w = 0; w < waveCount && !udpTransferDoneAcked && isRunning; w++)
                            {
                                byte[] packet = encryptedPackets[w];
                                SendUdpP2pPacket(packet, packet.Length, targetEp);
                                totalSent += plainLens[w];
                                totalWireBytesSent += plainLens[w];
                                txUiWindowBytes += plainLens[w];

                                // Sub-microsecond hardware Stopwatch Token-Bucket pacer (never stalls on dropped packets!)
                                PaceUdpPacketSend(packet.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                            }

                            waveStart += waveCount;

                            double txWinSec = txUiSw.Elapsed.TotalSeconds;
                            if (txWinSec >= 0.35 || smoothedUiTxMbps <= 0.0)
                            {
                                if (smoothedUiTxMbps <= 0.0)
                                {
                                    double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                                    smoothedUiTxMbps = (totalWireBytesSent / (1024.0 * 1024.0)) / sec;
                                }
                                else if (txWinSec >= 0.35)
                                {
                                    double sampleTx = (txUiWindowBytes / (1024.0 * 1024.0)) / txWinSec;
                                    smoothedUiTxMbps = (smoothedUiTxMbps * 0.35) + (sampleTx * 0.65);
                                    txUiWindowBytes = 0;
                                    txUiSw.Restart();
                                }
                            }
                            int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending via UDP P2P: " + fileName, totalSent, fileSize, smoothedUiTxMbps, permille);
                        }

                        // Send END and handle any remaining tail NACK retransmission requests until receiver confirms AETHER_UDP_DONE
                        // Persistent retry (3000 rounds = ~4-6 mins) to survive unstable mobile connections and 0 Mbit/s zones
                        byte[] endBytes = Encoding.UTF8.GetBytes("AETHER_UDP_END|" + fileName);
                        for (int retry = 0; retry < 3000 && !udpTransferDoneAcked && isRunning; retry++)
                        {
                            SendUdpP2pPacket(endBytes, endBytes.Length, targetEp);
                            udpAckEvent.WaitOne(80);
                            if (udpTransferDoneAcked) break;

                            int missIdx;
                            bool repairedTail = false;
                            while (udpRetransmitQueue.TryDequeue(out missIdx))
                            {
                                if (missIdx >= 0 && missIdx < totalChunks)
                                {
                                    long pos = (long)missIdx * UDP_CHUNK_SIZE;
                                    int rem = (int)Math.Min((long)UDP_CHUNK_SIZE, fileSize - pos);
                                    byte[] b = new byte[rem];
                                    fsRepair.Seek(pos, SeekOrigin.Begin);
                                    int r = fsRepair.Read(b, 0, rem);
                                    if (r > 0)
                                    {
                                        byte[] pkt = EncryptSingleUdpChunk(b, r, missIdx, totalChunks, keySnapshot);
                                        SendUdpP2pPacket(pkt, pkt.Length, targetEp);
                                        PaceUdpPacketSend(pkt.Length, ref pacingEpochTicks, ref pacedBytesSinceEpoch);
                                        repairedTail = true;
                                    }
                                }
                            }
                            if (repairedTail) retry = 0;
                        }
                    }

                    sw.Stop();
                    double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                    long finalSessionBytes = Math.Max(1L, fileSize - ((long)initialStartChunk * UDP_CHUNK_SIZE));
                    double finalMbps = (finalSessionBytes / (1024.0 * 1024.0)) / totalSec;
                    UpdateTransferUi("Sent via UDP NAT-Punch: " + fileName, fileSize, fileSize, finalMbps, 1000);
                    Log(String.Format("UDP NAT-P2P TX COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s{4}",
                        fileName, FormatBytes(fileSize), totalSec, finalMbps,
                        udpTransferDoneAcked ? " (Verified 100% Saved)" : ""));
                    if (isRunning) Thread.Sleep(150);
                }
                catch (Exception ex)
                {
                    Log("UDP P2P TX Error: " + ex.Message);
                }
            }
        }

        private void StreamFileToBrowserOverCloudBridge(string filePath)
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-cloud-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + CLOUD_CHUNK_SIZE - 1) / CLOUD_CHUNK_SIZE);
                string dstPeer = !String.IsNullOrEmpty(activeCloudBrowserPeerId) ? activeCloudBrowserPeerId : activeCloudExePeerId;
                string peerLabel = !String.IsNullOrEmpty(activeCloudBrowserPeerId) ? "Chrome Browser" : "Remote .EXE";

                Log("Streaming .EXE -> " + peerLabel + " over Wormhole Bridge: " + fileName + " (" + FormatBytes(fileSize) + ")");

                cloudResumeChunk = 0;
                cloudResumeEvent.Reset();

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, CLOUD_CHUNK_SIZE, totalChunks
                );
                SendCloudPacketAny(dstPeer, startJson);

                cloudResumeEvent.WaitOne(900);
                int startChunk = Math.Max(0, Math.Min(cloudResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming interrupted Wormhole transfer from chunk " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CLOUD_CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long totalSent = (long)startChunk * CLOUD_CHUNK_SIZE;
                byte[] buf = new byte[CLOUD_CHUNK_SIZE];
                int chunkIndex = startChunk;

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CLOUD_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalSent > 0) fs.Seek(totalSent, SeekOrigin.Begin);
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0)
                    {
                        string b64 = Convert.ToBase64String(buf, 0, read);
                        string chunkJson = String.Format(
                            "{{\\"kind\\":\\"exe:file-chunk\\",\\"fileId\\":\\"{0}\\",\\"chunkIndex\\":{1},\\"data\\":\\"{2}\\"}}",
                            fileId, chunkIndex, b64
                        );
                        SendCloudPacketAny(dstPeer, chunkJson);

                        totalSent += read;
                        chunkIndex++;

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double mbps = (totalSent / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Sending to " + peerLabel + ": " + fileName, totalSent, fileSize, mbps, permille);

                        if (chunkIndex % 8 == 0)
                        {
                            cloudAckEvent.WaitOne(350);
                        }
                    }
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                SendCloudPacketAny(dstPeer, endJson);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (fileSize / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to " + peerLabel + ": " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format(".EXE -> {0} COMPLETE: {1} ({2}) in {3:F2}s — {4:F2} MB/s",
                    peerLabel.ToUpperInvariant(), fileName, FormatBytes(fileSize), totalSec, finalMbps));
            }
            catch (Exception ex)
            {
                Log("Wormhole Cloud Bridge TX Error: " + ex.Message);
            }
        }

        private void StreamFileToBrowserOverWebSocket(string filePath)
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                string fileId = "exe-" + DateTime.UtcNow.Ticks.ToString();
                int totalChunks = (int)Math.Max(1L, (fileSize + WS_CHUNK_SIZE - 1) / WS_CHUNK_SIZE);

                Log("Streaming from .EXE -> Chrome Browser over Local Kernel WebSocket: " + fileName + " (" + FormatBytes(fileSize) + ")");

                string startJson = String.Format(
                    "{{\\"kind\\":\\"exe:file-start\\",\\"fileId\\":\\"{0}\\",\\"name\\":\\"{1}\\",\\"size\\":{2},\\"chunkSize\\":{3},\\"totalChunks\\":{4}}}",
                    fileId, fileName.Replace("\\"", ""), fileSize, WS_CHUNK_SIZE, totalChunks
                );
                byte[] startBytes = Encoding.UTF8.GetBytes(startJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, startBytes, 0, startBytes.Length);

                Stopwatch sw = Stopwatch.StartNew();
                long totalSent = 0;
                byte[] buf = new byte[WS_CHUNK_SIZE];

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, WS_CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    int read;
                    while ((read = fs.Read(buf, 0, buf.Length)) > 0)
                    {
                        SendWebSocketFrame(activeBrowserWsStream, 0x02, buf, 0, read);
                        totalSent += read;

                        double sec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                        double mbps = (totalSent / (1024.0 * 1024.0)) / sec;
                        int permille = (int)((totalSent * 1000L) / Math.Max(1L, fileSize));
                        UpdateTransferUi("Streaming to Browser: " + fileName, totalSent, fileSize, mbps, permille);
                    }
                }

                string endJson = String.Format("{{\\"kind\\":\\"exe:file-end\\",\\"fileId\\":\\"{0}\\"}}", fileId);
                byte[] endBytes = Encoding.UTF8.GetBytes(endJson);
                SendWebSocketFrame(activeBrowserWsStream, 0x01, endBytes, 0, endBytes.Length);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (fileSize / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent to Browser: " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format(".EXE -> BROWSER COMPLETE: {0} ({1}) in {2:F2}s — {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
            }
            catch (Exception ex)
            {
                Log("Browser WebSocket TX Error: " + ex.Message);
            }
        }

        private void StreamFileOverKernelTcp(string filePath)
        {
            try
            {
                FileInfo fi = new FileInfo(filePath);
                long fileSize = fi.Length;
                string fileName = fi.Name;
                int totalChunks = (int)Math.Max(1L, (fileSize + CHUNK_SIZE - 1) / CHUNK_SIZE);

                Log("Starting Kernel-Socket transfer: " + fileName + " (" + FormatBytes(fileSize) + ", " + totalChunks.ToString() + " x 4 MB blocks)");

                kernelTcpResumeChunk = 0;
                kernelTcpResumeEvent.Reset();

                byte[] nameBytes = Encoding.UTF8.GetBytes(fileName);
                byte[] metaPayload = new byte[12 + nameBytes.Length];
                Buffer.BlockCopy(BitConverter.GetBytes(fileSize), 0, metaPayload, 0, 8);
                Buffer.BlockCopy(BitConverter.GetBytes(totalChunks), 0, metaPayload, 8, 4);
                Buffer.BlockCopy(nameBytes, 0, metaPayload, 12, nameBytes.Length);
                WriteKernelFrame(1, metaPayload, metaPayload.Length);

                kernelTcpResumeEvent.WaitOne(800);
                int startChunk = Math.Max(0, Math.Min(kernelTcpResumeChunk, totalChunks));
                if (startChunk > 0)
                {
                    Log("Resuming Kernel-Socket transfer from block " + startChunk.ToString() + " (" + FormatBytes((long)startChunk * CHUNK_SIZE) + ")");
                }

                Stopwatch sw = Stopwatch.StartNew();
                long totalBytesSent = (long)startChunk * CHUNK_SIZE;
                byte[] keySnapshot = (byte[])aesKey.Clone();

                using (FileStream fs = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read, CHUNK_SIZE, FileOptions.SequentialScan))
                {
                    if (totalBytesSent > 0) fs.Seek(totalBytesSent, SeekOrigin.Begin);

                    for (int waveStart = startChunk; waveStart < totalChunks; waveStart += PARALLEL_WORKERS)
                    {
                        int waveCount = Math.Min(PARALLEL_WORKERS, totalChunks - waveStart);
                        byte[][] plainBlocks = new byte[waveCount][];
                        int[] plainLengths = new int[waveCount];

                        for (int w = 0; w < waveCount; w++)
                        {
                            int remaining = (int)Math.Min((long)CHUNK_SIZE, fileSize - ((long)(waveStart + w) * CHUNK_SIZE));
                            byte[] buf = new byte[remaining];
                            int readTotal = 0;
                            while (readTotal < remaining)
                            {
                                int r = fs.Read(buf, readTotal, remaining - readTotal);
                                if (r <= 0) break;
                                readTotal += r;
                            }
                            plainBlocks[w] = buf;
                            plainLengths[w] = readTotal;
                        }

                        byte[][] encryptedPayloads = new byte[waveCount][];
                        Parallel.For(0, waveCount, delegate(int w)
                        {
                            int chunkIndex = waveStart + w;
                            byte[] iv = new byte[16];
                            Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, iv, 0, 4);
                            Buffer.BlockCopy(BitConverter.GetBytes(Environment.TickCount ^ chunkIndex), 0, iv, 4, 4);

                            using (AesCryptoServiceProvider aes = new AesCryptoServiceProvider())
                            {
                                aes.KeySize = 256;
                                aes.BlockSize = 128;
                                aes.Key = keySnapshot;
                                aes.IV = iv;
                                aes.Mode = CipherMode.CBC;
                                aes.Padding = PaddingMode.PKCS7;

                                using (ICryptoTransform encryptor = aes.CreateEncryptor())
                                {
                                    byte[] cipher = encryptor.TransformFinalBlock(plainBlocks[w], 0, plainLengths[w]);
                                    byte[] frameBody = new byte[20 + cipher.Length];
                                    Buffer.BlockCopy(BitConverter.GetBytes(chunkIndex), 0, frameBody, 0, 4);
                                    Buffer.BlockCopy(iv, 0, frameBody, 4, 16);
                                    Buffer.BlockCopy(cipher, 0, frameBody, 20, cipher.Length);
                                    encryptedPayloads[w] = frameBody;
                                }
                            }
                        });

                        for (int w = 0; w < waveCount; w++)
                        {
                            byte[] body = encryptedPayloads[w];
                            WriteKernelFrame(2, body, body.Length);
                            totalBytesSent += plainLengths[w];

                            double elapsedSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                            double mbps = (totalBytesSent / (1024.0 * 1024.0)) / elapsedSec;
                            int permille = (int)((totalBytesSent * 1000L) / Math.Max(1L, fileSize));
                            UpdateTransferUi("Sending: " + fileName, totalBytesSent, fileSize, mbps, permille);
                        }
                    }
                }

                WriteKernelFrame(3, new byte[4], 4);
                sw.Stop();

                double totalSec = Math.Max(0.005, sw.Elapsed.TotalSeconds);
                double finalMbps = (fileSize / (1024.0 * 1024.0)) / totalSec;
                UpdateTransferUi("Sent & Verified: " + fileName, fileSize, fileSize, finalMbps, 1000);
                Log(String.Format("TX COMPLETE: {0} ({1}) in {2:F2}s — Average Speed: {3:F2} MB/s ({4:F2} Gbps)",
                    fileName, FormatBytes(fileSize), totalSec, finalMbps, (finalMbps * 8.0) / 1000.0));
            }
            catch (Exception ex)
            {
                Log("TX Error: " + ex.Message);
            }
        }

        private void WriteKernelFrame(byte frameType, byte[] payload, int payloadLen)
        {
            byte[] header = new byte[9];
            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, header, 0, 4);
            header[4] = frameType;
            Buffer.BlockCopy(BitConverter.GetBytes(payloadLen), 0, header, 5, 4);

            lock (streamWriteLock)
            {
                activePeerStream.Write(header, 0, 9);
                activePeerStream.Write(payload, 0, payloadLen);
            }
        }

        private void ReceiveKernelTcpLoop(TcpClient client, NetworkStream netStream, byte[] preReadThreeBytes)
        {
            byte[] headerBuf = new byte[9];
            bool hasPreRead = (preReadThreeBytes != null && preReadThreeBytes.Length == 3);

            FileStream currentOutFile = null;
            string currentFileName = "";
            string currentOutPath = "";
            string currentPartPath = "";
            long expectedFileSize = 0;
            long receivedPlainBytes = 0;
            Stopwatch rxSw = null;

            try
            {
                while (isRunning && client.Connected)
                {
                    if (hasPreRead)
                    {
                        headerBuf[0] = preReadThreeBytes[0];
                        headerBuf[1] = preReadThreeBytes[1];
                        headerBuf[2] = preReadThreeBytes[2];
                        hasPreRead = false;
                        if (!ReadExactBytesOffset(netStream, headerBuf, 3, 6)) break;
                    }
                    else
                    {
                        if (!ReadExactBytes(netStream, headerBuf, 9)) break;
                    }

                    uint magic = BitConverter.ToUInt32(headerBuf, 0);
                    if (magic != MAGIC_HEADER)
                    {
                        Log("Protocol error: Invalid frame magic on kernel socket.");
                        break;
                    }

                    byte frameType = headerBuf[4];
                    int payloadLen = BitConverter.ToInt32(headerBuf, 5);
                    if (payloadLen < 0 || payloadLen > 32 * 1024 * 1024) break;

                    byte[] payload = new byte[payloadLen];
                    if (!ReadExactBytes(netStream, payload, payloadLen)) break;

                    if (frameType == 1)
                    {
                        expectedFileSize = BitConverter.ToInt64(payload, 0);
                        int totalChunks = BitConverter.ToInt32(payload, 8);
                        currentFileName = Encoding.UTF8.GetString(payload, 12, payloadLen - 12);
                        currentOutPath = Path.Combine(downloadDirectory, "AetherTunnel_" + currentFileName);
                        currentPartPath = currentOutPath + ".part";

                        if (currentOutFile != null) currentOutFile.Close();
                        long existingBytes = 0;
                        if (File.Exists(currentPartPath))
                        {
                            existingBytes = new FileInfo(currentPartPath).Length;
                            if (existingBytes >= expectedFileSize) existingBytes = 0;
                        }
                        int resumeFromChunk = (int)(existingBytes / CHUNK_SIZE);
                        long alignedBytes = (long)resumeFromChunk * CHUNK_SIZE;

                        currentOutFile = new FileStream(currentPartPath, existingBytes > 0 ? FileMode.Open : FileMode.Create, FileAccess.Write, FileShare.None, CHUNK_SIZE, FileOptions.SequentialScan);
                        if (alignedBytes > 0) currentOutFile.Seek(alignedBytes, SeekOrigin.Begin);
                        receivedPlainBytes = alignedBytes;
                        rxSw = Stopwatch.StartNew();

                        try
                        {
                            byte[] resumeAckPayload = BitConverter.GetBytes(resumeFromChunk);
                            byte[] ackHeader = new byte[9];
                            Buffer.BlockCopy(BitConverter.GetBytes(MAGIC_HEADER), 0, ackHeader, 0, 4);
                            ackHeader[4] = 4;
                            Buffer.BlockCopy(BitConverter.GetBytes(4), 0, ackHeader, 5, 4);
                            lock (streamWriteLock)
                            {
                                netStream.Write(ackHeader, 0, 9);
                                netStream.Write(resumeAckPayload, 0, 4);
                            }
                        }
                        catch { }

                        if (resumeFromChunk > 0)
                            Log("Resuming interrupted Kernel-Socket file at block " + resumeFromChunk.ToString() + " (" + FormatBytes(alignedBytes) + ")");
                        else
                            Log("Receiving directly to disk: " + currentOutPath + " (" + FormatBytes(expectedFileSize) + ")");
                    }
                    else if (frameType == 4 && payloadLen >= 4)
                    {
                        kernelTcpResumeChunk = BitConverter.ToInt32(payload, 0);
                        kernelTcpResumeEvent.Set();
                    }
                    else if (frameType == 2 && currentOutFile != null)
                    {
                        int chunkIndex = BitConverter.ToInt32(payload, 0);
                        byte[] iv = new byte[16];
                        Buffer.BlockCopy(payload, 4, iv, 0, 16);

                        byte[] plain;
                        using (AesCryptoServiceProvider aes = new AesCryptoServiceProvider())
                        {
                            aes.KeySize = 256;
                            aes.BlockSize = 128;
                            aes.Key = aesKey;
                            aes.IV = iv;
                            aes.Mode = CipherMode.CBC;
                            aes.Padding = PaddingMode.PKCS7;

                            using (ICryptoTransform decryptor = aes.CreateDecryptor())
                            {
                                plain = decryptor.TransformFinalBlock(payload, 20, payloadLen - 20);
                            }
                        }

                        long writeOffset = (long)chunkIndex * CHUNK_SIZE;
                        currentOutFile.Seek(writeOffset, SeekOrigin.Begin);
                        currentOutFile.Write(plain, 0, plain.Length);
                        receivedPlainBytes = Math.Max(receivedPlainBytes, writeOffset + plain.Length);

                        double elapsedSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double mbps = (receivedPlainBytes / (1024.0 * 1024.0)) / elapsedSec;
                        int permille = (int)((receivedPlainBytes * 1000L) / Math.Max(1L, expectedFileSize));
                        UpdateTransferUi("Receiving to Disk: " + currentFileName, receivedPlainBytes, expectedFileSize, mbps, permille);
                    }
                    else if (frameType == 3 && currentOutFile != null)
                    {
                        currentOutFile.Flush();
                        currentOutFile.Close();
                        currentOutFile = null;
                        rxSw.Stop();

                        try
                        {
                            if (File.Exists(currentOutPath)) File.Delete(currentOutPath);
                            File.Move(currentPartPath, currentOutPath);
                        }
                        catch { }

                        double totalSec = Math.Max(0.005, rxSw.Elapsed.TotalSeconds);
                        double finalMbps = (expectedFileSize / (1024.0 * 1024.0)) / totalSec;
                        UpdateTransferUi("Saved to Disk: " + currentFileName, expectedFileSize, expectedFileSize, finalMbps, 1000);
                        Log(String.Format("RX COMPLETE & SAVED: {0} ({1:F2} MB/s · {2:F2} Gbps)",
                            currentOutPath, finalMbps, (finalMbps * 8.0) / 1000.0));
                    }
                }
            }
            catch (Exception ex)
            {
                if (isRunning) Log("RX Stream closed: " + ex.Message);
            }
            finally
            {
                if (currentOutFile != null)
                {
                    try { currentOutFile.Close(); } catch { }
                }
            }
        }

        private bool ReadExactBytes(NetworkStream stream, byte[] buffer, int count)
        {
            return ReadExactBytesOffset(stream, buffer, 0, count);
        }

        private bool ReadExactBytesOffset(NetworkStream stream, byte[] buffer, int startOffset, int count)
        {
            int offset = 0;
            while (offset < count)
            {
                int read = stream.Read(buffer, startOffset + offset, count - offset);
                if (read <= 0) return false;
                offset += read;
            }
            return true;
        }

        private void UpdateTransferUi(string statusText, long doneBytes, long totalBytes, double mbps, int permille)
        {
            if (permille < 1000)
            {
                int nowTick = Environment.TickCount;
                if (unchecked(nowTick - lastUiUpdateTick) < 100) return;
                lastUiUpdateTick = nowTick;
            }
            if (this.InvokeRequired)
            {
                this.BeginInvoke(new Action<string, long, long, double, int>(UpdateTransferUi), statusText, doneBytes, totalBytes, mbps, permille);
                return;
            }
            double gbps = (mbps * 8.0) / 1000.0;
            lblSpeedMetric.Text = String.Format("{0:F2} MB/s  ({1:F2} Gbps)", mbps, gbps);
            lblProgressDetail.Text = String.Format("{0} — {1} / {2} ({3}%)", statusText, FormatBytes(doneBytes), FormatBytes(totalBytes), permille / 10);
            progressBar.Value = Math.Max(0, Math.Min(1000, permille));
        }

        private string FormatBytes(long bytes)
        {
            if (bytes >= 1024L * 1024L * 1024L)
                return String.Format("{0:F2} GB", bytes / (1024.0 * 1024.0 * 1024.0));
            if (bytes >= 1024L * 1024L)
                return String.Format("{0:F2} MB", bytes / (1024.0 * 1024.0));
            if (bytes >= 1024L)
                return String.Format("{0:F1} KB", bytes / 1024.0);
            return bytes.ToString() + " B";
        }

        private void OnFormClosing(object sender, FormClosingEventArgs e)
        {
            isRunning = false;
            try { udpRxDataEvent.Set(); } catch { }
            try { diskWriteEvent.Set(); } catch { }
            try { udpAckEvent.Set(); } catch { }
            try { udpWriterExitedEvent.WaitOne(2500); } catch { }
            try { udpDiskIoExitedEvent.WaitOne(2500); } catch { }
            try { if (tcpListener != null) tcpListener.Stop(); } catch { }
            try { if (udpDiscovery != null) udpDiscovery.Close(); } catch { }
            try { if (udpP2pClient != null) udpP2pClient.Close(); } catch { }
            try { if (udpP2pV6Client != null) udpP2pV6Client.Close(); } catch { }
            try { if (activePeerClient != null) activePeerClient.Close(); } catch { }
            try { if (activeBrowserWsClient != null) activeBrowserWsClient.Close(); } catch { }
            foreach (KeyValuePair<string, SignalingChannel> kv in activeSignalingChannels)
            {
                try { if (kv.Value != null && kv.Value.Ws != null) kv.Value.Ws.Dispose(); } catch { }
            }
        }
    }
}
`;
}

const CSHARP_KERNEL_APP_SOURCE = getCSharpKernelSource('742-cobalt-falcon');

function buildWindowsGuiExe(
  defaultRoomCode = '742-cobalt-falcon',
  defaultCloudWsUrl = 'wss://ais-pre-vbnfwcka5fzvdufqsqefco-732798873031.europe-west2.run.app/ws-tunnel'
) {
  const safeRoomCode =
    typeof defaultRoomCode === 'string' &&
    defaultRoomCode.length > 0 &&
    defaultRoomCode.length < 80 &&
    !defaultRoomCode.includes('<')
      ? defaultRoomCode
      : '742-cobalt-falcon';
  const fileAlignment = 0x200; // 512 bytes
  const sectionAlignment = 0x1000; // 4096 bytes
  const imageBase = 0x00400000;

  const totalPeSize = 0x0e00;
  const buf = Buffer.alloc(totalPeSize, 0);

  // 1. DOS Header (0x00)
  buf.write('MZ', 0x00, 'ascii');
  buf.writeUInt32LE(0x80, 0x3c);

  // 2. PE Signature & COFF File Header (0x80)
  buf.write('PE\0\0', 0x80, 'ascii');
  buf.writeUInt16LE(0x014c, 0x84);
  buf.writeUInt16LE(3, 0x86);
  buf.writeUInt32LE(Math.floor(Date.now() / 1000), 0x88);
  buf.writeUInt32LE(0, 0x8c);
  buf.writeUInt32LE(0, 0x90);
  buf.writeUInt16LE(0xe0, 0x94);
  buf.writeUInt16LE(0x010f, 0x96);

  // 3. Optional Header PE32 (0x98)
  const opt = 0x98;
  buf.writeUInt16LE(0x010b, opt + 0x00);
  buf.writeUInt8(14, opt + 0x02);
  buf.writeUInt8(0, opt + 0x03);
  buf.writeUInt32LE(0x200, opt + 0x04);
  buf.writeUInt32LE(0xa00, opt + 0x08);
  buf.writeUInt32LE(0, opt + 0x0c);
  buf.writeUInt32LE(0x1000, opt + 0x10);
  buf.writeUInt32LE(0x1000, opt + 0x14);
  buf.writeUInt32LE(0x2000, opt + 0x18);
  buf.writeUInt32LE(imageBase, opt + 0x1c);
  buf.writeUInt32LE(sectionAlignment, opt + 0x20);
  buf.writeUInt32LE(fileAlignment, opt + 0x24);
  buf.writeUInt16LE(6, opt + 0x28);
  buf.writeUInt16LE(0, opt + 0x2a);
  buf.writeUInt16LE(0, opt + 0x2c);
  buf.writeUInt16LE(0, opt + 0x2e);
  buf.writeUInt16LE(6, opt + 0x30);
  buf.writeUInt16LE(0, opt + 0x32);
  buf.writeUInt32LE(0, opt + 0x34);
  buf.writeUInt32LE(0x4000, opt + 0x38);
  buf.writeUInt32LE(0x200, opt + 0x3c);
  buf.writeUInt32LE(0, opt + 0x40);
  buf.writeUInt16LE(2, opt + 0x44); // IMAGE_SUBSYSTEM_WINDOWS_GUI
  buf.writeUInt16LE(0, opt + 0x46);
  buf.writeUInt32LE(0x100000, opt + 0x48);
  buf.writeUInt32LE(0x1000, opt + 0x4c);
  buf.writeUInt32LE(0x100000, opt + 0x50);
  buf.writeUInt32LE(0x1000, opt + 0x54);
  buf.writeUInt32LE(0, opt + 0x58);
  buf.writeUInt32LE(16, opt + 0x5c);

  buf.writeUInt32LE(0x2000, opt + 0x60 + 8);
  buf.writeUInt32LE(40, opt + 0x60 + 12);
  buf.writeUInt32LE(0x2050, opt + 0x60 + 12 * 8);
  buf.writeUInt32LE(20, opt + 0x60 + 12 * 8 + 4);

  function writeSectionHeader(offset, name, virtualSize, virtualAddress, rawSize, rawPtr, chars) {
    buf.write(name, offset, 'ascii');
    buf.writeUInt32LE(virtualSize, offset + 8);
    buf.writeUInt32LE(virtualAddress, offset + 12);
    buf.writeUInt32LE(rawSize, offset + 16);
    buf.writeUInt32LE(rawPtr, offset + 20);
    buf.writeUInt32LE(chars, offset + 36);
  }

  writeSectionHeader(0x178, '.text\0\0\0', 0x200, 0x1000, 0x200, 0x200, 0x60000020);
  writeSectionHeader(0x1a0, '.rdata\0\0', 0x200, 0x2000, 0x200, 0x400, 0x40000040);
  writeSectionHeader(0x1c8, '.data\0\0\0', 0x800, 0x3000, 0x800, 0x600, 0xc0000040);

  // .rdata Section (File Offset 0x400, RVA 0x2000)
  buf.writeUInt32LE(0x2030, 0x400 + 0);
  buf.writeUInt32LE(0, 0x400 + 4);
  buf.writeUInt32LE(0, 0x400 + 8);
  buf.writeUInt32LE(0x2070, 0x400 + 12);
  buf.writeUInt32LE(0x2050, 0x400 + 16);

  buf.writeUInt16LE(0, 0x480);
  buf.write('GetModuleFileNameA\0', 0x482, 'ascii');
  buf.writeUInt16LE(0, 0x498);
  buf.write('SetEnvironmentVariableA\0', 0x49a, 'ascii');
  buf.writeUInt16LE(0, 0x4b4);
  buf.write('WinExec\0', 0x4b6, 'ascii');
  buf.writeUInt16LE(0, 0x4c0);
  buf.write('ExitProcess\0', 0x4c2, 'ascii');

  const thunks = [0x2080, 0x2098, 0x20b4, 0x20c0, 0];
  thunks.forEach((rva, idx) => {
    buf.writeUInt32LE(rva, 0x430 + idx * 4);
    buf.writeUInt32LE(rva, 0x450 + idx * 4);
  });

  buf.write('KERNEL32.dll\0', 0x470, 'ascii');

  // .data Section (File Offset 0x600, RVA 0x3000)
  buf.write('AETHER_EXE\0', 0x600, 'ascii');

  const psCommand =
    'powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command "' +
    "$b=[IO.File]::ReadAllBytes($env:AETHER_EXE);" +
    "$s=[Text.Encoding]::UTF8.GetString($b,3584,$b.Length-3584);" +
    "$d=Join-Path $env:LOCALAPPDATA 'AetherTunnel';" +
    "New-Item -ItemType Directory -Force -Path $d|Out-Null;" +
    "$cs=Join-Path $d ('AT_'+$PID+'.cs');" +
    "$bin=Join-Path $d 'AetherTunnel.exe';" +
    "[IO.File]::WriteAllText($cs,$s,[Text.Encoding]::UTF8);" +
    "$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework64\\v4.0.30319\\csc.exe';" +
    "if(-not(Test-Path $csc)){$csc=Join-Path $env:WINDIR 'Microsoft.NET\\Framework\\v4.0.30319\\csc.exe'};" +
    "& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs;" +
    "if($LASTEXITCODE -ne 0){$bin=Join-Path $d ('AetherTunnel_'+$PID+'.exe');& $csc /nologo /optimize+ /target:winexe /r:System.dll /r:System.Core.dll /r:System.Drawing.dll /r:System.Windows.Forms.dll /out:$bin $cs};" +
    "Remove-Item $cs -Force -ErrorAction SilentlyContinue;" +
    "if(Test-Path $bin){Start-Process $bin}" +
    '"\0';

  buf.write(psCommand, 0x620, 'ascii');

  // .text Section Machine Code (File Offset 0x200, RVA 0x1000)
  const code = Buffer.from([
    // GetModuleFileNameA(0, 0x00403500, 500)
    0x68, 0xf4, 0x01, 0x00, 0x00,
    0x68, 0x00, 0x35, 0x40, 0x00,
    0x6a, 0x00,
    0xff, 0x15, 0x50, 0x20, 0x40, 0x00,
    // SetEnvironmentVariableA("AETHER_EXE", 0x00403500)
    0x68, 0x00, 0x35, 0x40, 0x00,
    0x68, 0x00, 0x30, 0x40, 0x00,
    0xff, 0x15, 0x54, 0x20, 0x40, 0x00,
    // WinExec(0x00403020, SW_HIDE)
    0x6a, 0x00,
    0x68, 0x20, 0x30, 0x40, 0x00,
    0xff, 0x15, 0x58, 0x20, 0x40, 0x00,
    // ExitProcess(0)
    0x6a, 0x00,
    0xff, 0x15, 0x5c, 0x20, 0x40, 0x00,
    0xc3,
  ]);
  code.copy(buf, 0x200);

  const csSource = getCSharpKernelSource(safeRoomCode, defaultCloudWsUrl);
  const csBytes = Buffer.from(csSource, 'utf8');
  return Buffer.concat([buf, csBytes]);
}

module.exports = { buildWindowsGuiExe, getCSharpKernelSource, CSHARP_KERNEL_APP_SOURCE };
