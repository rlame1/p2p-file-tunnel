// Pure Node.js Windows PE32 (.exe) Self-Contained GUI Application Builder
// Generates a valid Windows Portable Executable (GUI subsystem, zero console flash)
// that extracts the appended single-file HTML bundle and opens it in a standalone native desktop window.

function buildWindowsGuiExe(embeddedHtmlString) {
  const fileAlignment = 0x200; // 512 bytes
  const sectionAlignment = 0x1000; // 4096 bytes
  const imageBase = 0x00400000;

  // Total header + 3 sections (.text, .rdata, .data) in file:
  // Headers: 0x0000 - 0x01FF (512 bytes) -> RVA 0x0000
  // .text  : 0x0200 - 0x03FF (512 bytes) -> RVA 0x1000
  // .rdata : 0x0400 - 0x05FF (512 bytes) -> RVA 0x2000
  // .data  : 0x0600 - 0x0DFF (2048 bytes) -> RVA 0x3000
  const totalPeSize = 0x0e00;
  const buf = Buffer.alloc(totalPeSize, 0);

  // 1. DOS Header (0x00)
  buf.write('MZ', 0x00, 'ascii');
  buf.writeUInt32LE(0x80, 0x3c); // e_lfanew = 0x80

  // 2. PE Signature & COFF File Header (0x80)
  buf.write('PE\0\0', 0x80, 'ascii');
  buf.writeUInt16LE(0x014c, 0x84); // Machine: IMAGE_FILE_MACHINE_I386 (runs on all x86 & x64 Windows)
  buf.writeUInt16LE(3, 0x86); // NumberOfSections: 3 (.text, .rdata, .data)
  buf.writeUInt32LE(Math.floor(Date.now() / 1000), 0x88); // TimeDateStamp
  buf.writeUInt32LE(0, 0x8c); // PointerToSymbolTable
  buf.writeUInt32LE(0, 0x90); // NumberOfSymbols
  buf.writeUInt16LE(0xe0, 0x94); // SizeOfOptionalHeader (224 bytes for PE32)
  buf.writeUInt16LE(0x010f, 0x96); // Characteristics: EXECUTABLE_IMAGE | 32BIT_MACHINE | RELOCS_STRIPPED

  // 3. Optional Header PE32 (0x98)
  const opt = 0x98;
  buf.writeUInt16LE(0x010b, opt + 0x00); // Magic: PE32
  buf.writeUInt8(14, opt + 0x02); // MajorLinkerVersion
  buf.writeUInt8(0, opt + 0x03); // MinorLinkerVersion
  buf.writeUInt32LE(0x200, opt + 0x04); // SizeOfCode
  buf.writeUInt32LE(0xa00, opt + 0x08); // SizeOfInitializedData
  buf.writeUInt32LE(0, opt + 0x0c); // SizeOfUninitializedData
  buf.writeUInt32LE(0x1000, opt + 0x10); // AddressOfEntryPoint: RVA 0x1000 (.text)
  buf.writeUInt32LE(0x1000, opt + 0x14); // BaseOfCode
  buf.writeUInt32LE(0x2000, opt + 0x18); // BaseOfData
  buf.writeUInt32LE(imageBase, opt + 0x1c); // ImageBase: 0x00400000
  buf.writeUInt32LE(sectionAlignment, opt + 0x20); // SectionAlignment: 0x1000
  buf.writeUInt32LE(fileAlignment, opt + 0x24); // FileAlignment: 0x200
  buf.writeUInt16LE(6, opt + 0x28); // MajorOperatingSystemVersion (Windows Vista/7/10/11)
  buf.writeUInt16LE(0, opt + 0x2a);
  buf.writeUInt16LE(0, opt + 0x2c);
  buf.writeUInt16LE(0, opt + 0x2e);
  buf.writeUInt16LE(6, opt + 0x30); // MajorSubsystemVersion
  buf.writeUInt16LE(0, opt + 0x32);
  buf.writeUInt32LE(0, opt + 0x34); // Win32VersionValue
  buf.writeUInt32LE(0x4000, opt + 0x38); // SizeOfImage (headers + 3 sections aligned to 0x1000)
  buf.writeUInt32LE(0x200, opt + 0x3c); // SizeOfHeaders
  buf.writeUInt32LE(0, opt + 0x40); // CheckSum
  buf.writeUInt16LE(2, opt + 0x44); // Subsystem: IMAGE_SUBSYSTEM_WINDOWS_GUI (2 = GUI, no console window)
  buf.writeUInt16LE(0, opt + 0x46); // DllCharacteristics
  buf.writeUInt32LE(0x100000, opt + 0x48); // SizeOfStackReserve
  buf.writeUInt32LE(0x1000, opt + 0x4c); // SizeOfStackCommit
  buf.writeUInt32LE(0x100000, opt + 0x50); // SizeOfHeapReserve
  buf.writeUInt32LE(0x1000, opt + 0x54); // SizeOfHeapCommit
  buf.writeUInt32LE(0, opt + 0x58); // LoaderFlags
  buf.writeUInt32LE(16, opt + 0x5c); // NumberOfRvaAndSizes

  // Data Directories (start at opt + 0x60 = 0xF8)
  // Directory 1: Import Table at RVA 0x2000, size 40 (2 descriptors)
  buf.writeUInt32LE(0x2000, opt + 0x60 + 8);
  buf.writeUInt32LE(40, opt + 0x60 + 12);
  // Directory 12: IAT at RVA 0x2050, size 20
  buf.writeUInt32LE(0x2050, opt + 0x60 + 12 * 8);
  buf.writeUInt32LE(20, opt + 0x60 + 12 * 8 + 4);

  // 4. Section Headers (start at 0x178)
  function writeSectionHeader(offset, name, virtualSize, virtualAddress, rawSize, rawPtr, chars) {
    buf.write(name, offset, 'ascii');
    buf.writeUInt32LE(virtualSize, offset + 8);
    buf.writeUInt32LE(virtualAddress, offset + 12);
    buf.writeUInt32LE(rawSize, offset + 16);
    buf.writeUInt32LE(rawPtr, offset + 20);
    buf.writeUInt32LE(chars, offset + 36);
  }

  // .text (Code)
  writeSectionHeader(0x178, '.text\0\0\0', 0x200, 0x1000, 0x200, 0x200, 0x60000020);
  // .rdata (Imports)
  writeSectionHeader(0x1a0, '.rdata\0\0', 0x200, 0x2000, 0x200, 0x400, 0x40000040);
  // .data (Strings)
  writeSectionHeader(0x1c8, '.data\0\0\0', 0x800, 0x3000, 0x800, 0x600, 0xc0000040);

  // 5. .rdata Section (File Offset 0x400, RVA 0x2000)
  // Import Directory Table (RVA 0x2000, File 0x400):
  // Entry 0: KERNEL32.dll
  buf.writeUInt32LE(0x2030, 0x400 + 0); // OriginalFirstThunk (ILT RVA)
  buf.writeUInt32LE(0, 0x400 + 4); // TimeDateStamp
  buf.writeUInt32LE(0, 0x400 + 8); // ForwarderChain
  buf.writeUInt32LE(0x2070, 0x400 + 12); // Name RVA ("KERNEL32.dll")
  buf.writeUInt32LE(0x2050, 0x400 + 16); // FirstThunk (IAT RVA)
  // Entry 1: Null terminator descriptor (20 bytes of 0 at 0x414)

  // Hint/Name Table entries:
  // RVA 0x2080 (File 0x480): GetCommandLineA
  buf.writeUInt16LE(0, 0x480);
  buf.write('GetCommandLineA\0', 0x482, 'ascii');
  // RVA 0x2094 (File 0x494): SetEnvironmentVariableA
  buf.writeUInt16LE(0, 0x494);
  buf.write('SetEnvironmentVariableA\0', 0x496, 'ascii');
  // RVA 0x20B0 (File 0x4B0): WinExec
  buf.writeUInt16LE(0, 0x4b0);
  buf.write('WinExec\0', 0x4b2, 'ascii');
  // RVA 0x20BC (File 0x4BC): ExitProcess
  buf.writeUInt16LE(0, 0x4bc);
  buf.write('ExitProcess\0', 0x4be, 'ascii');

  // ILT at RVA 0x2030 (File 0x430) & IAT at RVA 0x2050 (File 0x450)
  const thunks = [0x2080, 0x2094, 0x20b0, 0x20bc, 0];
  thunks.forEach((rva, idx) => {
    buf.writeUInt32LE(rva, 0x430 + idx * 4);
    buf.writeUInt32LE(rva, 0x450 + idx * 4);
  });

  // DLL Name at RVA 0x2070 (File 0x470)
  buf.write('KERNEL32.dll\0', 0x470, 'ascii');

  // 6. .data Section (File Offset 0x600, RVA 0x3000)
  // RVA 0x3000 (File 0x600): Environment variable name "AETHER_CMDLINE\0"
  buf.write('AETHER_CMDLINE\0', 0x600, 'ascii');

  // RVA 0x3020 (File 0x620): PowerShell extraction & native app-window launcher command
  const psCommand =
    'powershell.exe -WindowStyle Hidden -NoProfile -ExecutionPolicy Bypass -Command "' +
    "$rawCmd = $env:AETHER_CMDLINE.Trim(); " +
    "if ($rawCmd.StartsWith('\\\"')) { $exe = $rawCmd.Split('\\\"')[1] } else { $exe = $rawCmd.Split(' ')[0] }; " +
    "$bytes = [System.IO.File]::ReadAllBytes($exe); " +
    "$text = [System.Text.Encoding]::UTF8.GetString($bytes); " +
    "$marker = '<!--AETHERTUNNEL_SINGLE_FILE_APP-->'; " +
    "$idx = $text.IndexOf($marker); " +
    "if ($idx -ge 0) { " +
    "  $html = $text.Substring($idx); " +
    "  $out = Join-Path $env:TEMP 'AetherTunnel-Standalone-GUI.html'; " +
    "  [System.IO.File]::WriteAllText($out, $html, [System.Text.Encoding]::UTF8); " +
    "  $url = 'file:///' + $out.Replace('\\', '/'); " +
    "  if (Get-Command msedge -ErrorAction SilentlyContinue) { Start-Process msedge -ArgumentList ('--app=' + $url, '--window-size=1360,860') } " +
    "  else { Start-Process $out } " +
    '}"\0';

  buf.write(psCommand, 0x620, 'ascii');

  // 7. .text Section Machine Code (File Offset 0x200, RVA 0x1000)
  // IAT virtual addresses:
  // GetCommandLineA         = 0x00402050
  // SetEnvironmentVariableA = 0x00402054
  // WinExec                 = 0x00402058
  // ExitProcess             = 0x0040205C
  const code = Buffer.from([
    // call dword ptr [0x00402050] (GetCommandLineA -> EAX)
    0xff, 0x15, 0x50, 0x20, 0x40, 0x00,
    // push eax (lpValue = EAX)
    0x50,
    // push 0x00403000 (lpName = "AETHER_CMDLINE")
    0x68, 0x00, 0x30, 0x40, 0x00,
    // call dword ptr [0x00402054] (SetEnvironmentVariableA)
    0xff, 0x15, 0x54, 0x20, 0x40, 0x00,
    // push 0 (uCmdShow = SW_HIDE)
    0x6a, 0x00,
    // push 0x00403020 (lpCmdLine = PowerShell command)
    0x68, 0x20, 0x30, 0x40, 0x00,
    // call dword ptr [0x00402058] (WinExec)
    0xff, 0x15, 0x58, 0x20, 0x40, 0x00,
    // push 0 (uExitCode = 0)
    0x6a, 0x00,
    // call dword ptr [0x0040205C] (ExitProcess)
    0xff, 0x15, 0x5c, 0x20, 0x40, 0x00,
    // ret
    0xc3,
  ]);
  code.copy(buf, 0x200);

  // 8. Append the self-contained HTML application overlay
  const markerAndHtml = Buffer.from(
    '\n<!--AETHERTUNNEL_SINGLE_FILE_APP-->\n' + embeddedHtmlString,
    'utf8'
  );

  return Buffer.concat([buf, markerAndHtml]);
}

module.exports = { buildWindowsGuiExe };
