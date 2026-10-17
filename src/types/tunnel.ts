export type TransportStrategy = 'auto' | 'webrtc_direct' | 'websocket_relay';

export type TunnelConnectionState =
  | 'idle'
  | 'signaling'
  | 'hole_punching'
  | 'connected_p2p'
  | 'connected_relay'
  | 'error';

export interface PeerSummary {
  id: string;
  deviceLabel: string;
  natType: string;
  joinedAt: number;
}

export interface TransferItem {
  id: string;
  name: string;
  size: number;
  mimeType: string;
  totalChunks: number;
  transferredChunks: number;
  bytesTransferred: number;
  speedBps: number;
  status: 'queued' | 'encrypting' | 'transferring' | 'verifying' | 'completed' | 'error';
  sha256: string;
  verified: boolean;
  direction: 'outgoing' | 'incoming';
  transportUsed: 'WebRTC Direct (UDP/DTLS)' | 'Encrypted WS Relay (TCP/443)';
  startedAt: number;
  completedAt?: number;
  downloadUrl?: string;
  errorMessage?: string;
}

export interface IceCandidateRecord {
  id: string;
  foundation: string;
  protocol: 'udp' | 'tcp';
  type: 'host' | 'srflx' | 'prflx' | 'relay';
  address: string;
  port: number;
  priority: number;
  relatedAddress?: string;
  stunServer?: string;
  discoveredAtMs: number;
}

export interface NatProbeReport {
  probedAt: number;
  observedPublicIp: string;
  detectedNatTopology:
    | 'Full Cone / Open NAT'
    | 'Address-Restricted Cone NAT'
    | 'Port-Restricted Cone NAT'
    | 'Symmetric NAT (Strict Firewall)';
  udpHolePunchViable: boolean;
  tcpWebsocketRelayReady: boolean;
  gatheringLatencyMs: number;
  candidates: IceCandidateRecord[];
  recommendedTransport: string;
}

export interface EncryptedNote {
  id: string;
  senderLabel: string;
  text: string;
  timestamp: number;
  verified: boolean;
}
