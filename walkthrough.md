# Security Summary

**Reviewed Files**: 9 (`package.json`, `bun.lock`, `server.ts`, `src/App.tsx`, `src/utils/crypto.ts`, `src/utils/standaloneBuilder.ts`, `scripts/pe-exe-builder.cjs`, `scripts/build-desktop-entry.cjs`, `src/services/natProber.ts`)
**Issues Resolved**: 14

### Issues Resolved
| Area | File | Line | What Was Happening | Impact | Status | How It Was Fixed |
|---|---|---|---|---|---|---|
| Vulnerable Dependency (`qs` / `body-parser`) | `package.json`, `bun.lock` | — | `express` pulled in a vulnerable `qs` / `body-parser` release (`GHSA-27r3-jxmh-p828`). | Medium | Fixed | Upgraded `express` to `4.22.3` and updated `body-parser` (`1.20.9`), resulting in 0 flagged packages in `bun audit`. |
| Unsanitized HTML & File Download Rendering | `server.ts`, `src/utils/standaloneBuilder.ts` | 70, 585 | Transfer status rows, peer names, file names, and `defaultRoom` were interpolated into `innerHTML` or HTML attributes without safe node construction or `blob:` URL validation. | High | Fixed | Replaced `innerHTML` templating with `document.createElement`, `.textContent`, `replaceChildren`, `sanitizeSafeFileName`, strict `blob:` scheme enforcement, and strict room-code sanitization. |
| Path Traversal & Argument Injection in Windows `.EXE` Client | `scripts/pe-exe-builder.cjs`, `src/utils/standaloneBuilder.ts` | 1119, 1143 | Remote peer-supplied filenames across UDP, Cloud Relay, Local WS, and Kernel TCP paths were combined directly with the download directory; `defaultRoomCode` / `cloudWsUrl` were interpolated into C# source strings; `explorer.exe` argument lacked quoting. | High | Fixed | Added `SanitizeSafeFileName` and `BuildSafeDownloadPath` confinement checks, strict URL/room validation before C# string interpolation, `SanitizeJsonText` escaping, and explicit directory quoting/existence checks. |
| Plaintext Browser File Chunks on Public Cloud MQTT Brokers | `src/App.tsx`, `server.ts`, `src/utils/standaloneBuilder.ts` | 5267, 1669 | Browser-to-browser transfers falling back to public MQTT WebSocket brokers sent `browser:file-chunk` payloads as unencrypted Base64. | High | Fixed | Encrypted `browser:file-chunk` payloads end-to-end with AES-256-GCM using the room tunnel key (`encrypted: true`, random 96-bit IV, authenticated ciphertext) and verified decryption on receive. |
| WebSocket Peer-ID Hijacking & Sender Spoofing | `server.ts` | 2328, 2445 | Any socket could join with an already active `peerId`/`cloudId` or supply an arbitrary `msg.src` in `CANDIDATE` signaling messages. | High | Fixed | Added active-socket collision rejection on `room:join`, format/length validation on room/peer identifiers, and server-authoritative `src` enforcement on `CANDIDATE` relays. |
| Weak / Truncated AES Nonces | `src/utils/crypto.ts`, `server.ts`, `src/utils/standaloneBuilder.ts`, `scripts/pe-exe-builder.cjs` | 85, 6269 | WebRTC and C# TX encryption either zeroed or overwrote 32 bits of the 96-bit IV or used a non-CSPRNG RNG fallback (`System.Random`). | High | Fixed | Used full 96-bit / 128-bit `crypto.getRandomValues` / `RNGCryptoServiceProvider` (`threadLocalRng`) per chunk without overwriting nonce bytes. |
| Binary Framing (`AETP`/`AETH`) Bounds & Memory DoS | `src/App.tsx`, `server.ts`, `src/utils/standaloneBuilder.ts`, `scripts/pe-exe-builder.cjs` | 1020, 760 | Unvalidated `totalFrameBytes`, `totalParts`, `byteOffset`, `chunkIndex`, and `payloadLen` headers could trigger oversized allocations, out-of-range array writes, or duplicate counting. | Medium | Fixed | Added strict frame size caps (`24..8 MB`), part bounds (`1..2048`), slice offset checks, `partialFrames` cap (`128`), duplicate part sets, and `chunkIndex < totalChunks` guards across Web and C#. |
| Cross-Origin Workflow Execution & Traversal Guards | `server.ts` | 2151, 2172 | `POST /api/workflow-run` had no cross-origin guard or concurrency lock, `/downloads/:filename` trusted raw `Host` headers, and `/tmp` launcher scripts used predictable paths. | Medium | Fixed | Enforced `Origin` matching on `POST /api/workflow-run`, single-flight `activeWorkflowPromise` locking, `Host` / room allowlist validation, `path.resolve` directory confinement, and `mktemp` in Unix launcher scripts. |
| Premature / Incomplete Transfer Completion Bugs | `src/App.tsx`, `server.ts`, `src/utils/standaloneBuilder.ts` | 2589, 3116 | Local `.EXE` WS and Cloud Relay receivers marked interrupted/partially decrypted transfers as `completed` and `verified`, `Cloud TX` dropped 0-byte files, and multi-file selection in Portable HTML only sent the first file. | Medium | Fixed | Added async decryption completion barriers (`pendingDecrypts`), strict chunk/byte completeness verification before completion, multi-file sequential send loops, and clean 0-byte transfer alignment. |

### Safeguards Verified
| Area | File | How It's Protected |
|---|---|---|
| End-to-End WebRTC Encryption | `src/utils/crypto.ts` | Keys are derived client-side with PBKDF2-SHA256 (`100,000` iterations) and chunks are encrypted with full 96-bit CSPRNG IVs under AES-256-GCM. |
| Release Artifact Confinement | `server.ts` | `/downloads/:filename` enforces strict filename allowlists, resolves against `releaseDir`, and checks `.isFile()` before serving. |
| Native Desktop Binary Storage | `scripts/pe-exe-builder.cjs` | Incoming filenames across all four native transports pass `SanitizeSafeFileName` and `BuildSafeDownloadPath` canonical directory prefix verification. |
| Dependency Security | `package.json`, `bun.lock` | `bun audit` passes with 0 known vulnerabilities across 267 packages. |

## PoC Verification

### Unsanitized HTML Rendering & Room Attribute Injection
#### Summary
| Field | Value |
|---|---|
| Issue Type | Unsanitized HTML Rendering |
| Impact | High |
| Affected File | `server.ts:70`, `src/utils/standaloneBuilder.ts:5`, `src/utils/standaloneBuilder.ts:519` |
| Test Scenario | `generateStandalonePortableHtml('123-test-room" onfocus="alert(1)')` and an incoming filename `<img src=x onerror=alert(1)>.txt` |

#### How It Was Fixed
Room codes embedded into HTML `<input>` values are stripped to lowercase `[a-z0-9-]` up to 64 characters. All status, peer, and download UI updates construct DOM nodes via `document.createElement`, assign text exclusively via `.textContent`, sanitize filenames, and permit only `blob:` download URLs.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Untrusted room parameter enters `generateStandalonePortableHtml` / `generateSelfContainedAppHtml`. | Stripped via `.replace(/[^a-z0-9-]/gi, '')` (`server.ts:70`, `standaloneBuilder.ts:5`). |
| 2 | Malicious remote filename enters `renderDownload` / `renderIncomingRow` / `setPeerRow`. | Normalized by `sanitizeSafeFileName` and written to `.textContent` (`server.ts:585`, `standaloneBuilder.ts:519`). |
| 3 | Final rendered DOM contains inert text and safe `blob:` download links. | **Handled Safely** |

#### Conclusion
**Fix Verified** - Verified via runtime test script that injected attributes are stripped and remote strings cannot execute scripts in the standalone client.

---

### Path Traversal on Native Windows `.EXE` File Reception
#### Summary
| Field | Value |
|---|---|
| Issue Type | Path Traversal |
| Impact | High |
| Affected File | `scripts/pe-exe-builder.cjs:1119`, `scripts/pe-exe-builder.cjs:1143`, `src/utils/standaloneBuilder.ts` |
| Test Scenario | Remote peer sends `file-start` / TCP metadata with filename `..\..\Windows\System32\evil.dll` |

#### How It Was Fixed
Added `SanitizeSafeFileName` and `BuildSafeDownloadPath` across UDP, Cloud Relay, Local WebSocket, and Kernel TCP incoming file handlers to strip path separators, traversal sequences, and invalid filename characters, then verify the resolved full path stays strictly inside `downloadDirectory`.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Remote peer sends metadata with `..\..\Windows\System32\evil.dll`. | Enters `BuildSafeDownloadPath` (`scripts/pe-exe-builder.cjs:1143`). |
| 2 | `SanitizeSafeFileName` removes directory parts, replaces invalid chars, and strips leading dots; `Path.GetFullPath` verifies prefix `downloadDirectory + DirectorySeparatorChar`. | Resolves only inside `downloadDirectory`. |
| 3 | Attempted traversal target path outside download folder is neutralized or rejected. | **Handled Safely** |

#### Conclusion
**Fix Verified** - Remote peers cannot write files outside the configured download folder.

---

### Plaintext Exposure on Public MQTT Relay Fallback
#### Summary
| Field | Value |
|---|---|
| Issue Type | Cleartext Transmission of Sensitive Data |
| Impact | High |
| Affected File | `src/App.tsx:5267`, `server.ts`, `src/utils/standaloneBuilder.ts:1669` |
| Test Scenario | Sending a file between two browsers over public `wss://broker.emqx.io:8084/mqtt` fallback without direct WebRTC |

#### How It Was Fixed
Updated `browser:file-chunk` transmission in `src/App.tsx`, `server.ts`, and `src/utils/standaloneBuilder.ts` to encrypt every chunk with AES-256-GCM (`encryptChunk` / `crypto.subtle.encrypt`) and a random 96-bit IV before Base64 encoding, and updated the receiver path to decrypt before assembly while keeping `pendingDecrypts` tracking so transfers never finalize before decryption completes.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | File slice enters Cloud Bridge TX (`src/App.tsx:5267`). | Encrypted with tunnel `CryptoKey` + fresh 96-bit IV (`encrypted: true`). |
| 2 | MQTT broker forwards JSON envelope containing only `iv` and ciphertext `data`. | Public broker never observes plaintext file contents. |
| 3 | Receiver decrypts via `decryptChunk` before storing into `rxChunks` and waits on `rxPendingDecrypts === 0`. | **Handled Safely** |

#### Conclusion
**Fix Verified** - Browser-to-browser Cloud Bridge transfers remain confidential even when relayed across public MQTT brokers.

---

### WebSocket Room Peer-ID Hijacking & Sender Spoofing
#### Summary
| Field | Value |
|---|---|
| Issue Type | Improper Access Control / Identity Spoofing |
| Impact | High |
| Affected File | `server.ts:2328`, `server.ts:2445` |
| Test Scenario | Attacker sends `room:join` with a victim's active `peerId` or sends `CANDIDATE` with forged `src` |

#### How It Was Fixed
Added strict active-session collision checks (`existingById` and `cloudId` checks against open sockets) in `room:join` so existing connected peers cannot be overwritten, and enforced server-authoritative `authorizedSrc` on `CANDIDATE` forwarding.

#### Step-by-Step Trace
| Step | What Happens in the Code | Outcome |
|---|---|---|
| 1 | Socket sends `room:join` with an already active `peerId` or `cloudId`. | Checked at `server.ts:2328`; rejected with `room:error`. |
| 2 | Authenticated peer sends `CANDIDATE` with mismatched `msg.src`. | Overridden by `authorizedSrc` at `server.ts:2445`. |
| 3 | Hijacking and impersonation within active rooms are blocked. | **Handled Safely** |

#### Conclusion
**Fix Verified** - Peers cannot displace active room members or spoof another participant's sender ID on the signaling server.
