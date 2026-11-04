# AetherTunnel v1.0 — Huippunopean P2P NAT-UDP -moottorin (600–5000 Mbit/s) ja säädettävän nopeuskaton korjaussuunnitelma

Tämä suunnitelma korjaa **0,64 MB/s** -nopeuslukituksen ja mahdollistaa täyden linjanopeuden (**600 Mbit/s vastaanottajalle = ~70–75 MB/s** sekä jopa **5000 Mbit/s = ~600 MB/s** nopeammille yhteyksille) yhdistämällä reaaliaikaisen NACK-virheenkorjauksen, mikrosekuntitason Token-Bucket -lähetystahdistuksen, dynaamisen nopeudensäädön sekä lennosta vaihdettavan nopeuskaton (**Speed Cap**).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> **Vahvistetut valinnat ja arkkitehtuuripäätökset:**
> - **Confirmed Decision 1 (5000 Mbit/s maksimikyky + Säädettävä nopeuskatto & Dynaaminen säätö):** Moottori pystyy puskemaan täydet **5000 Mbit/s** (moniytiminen `ThreadLocal<Aes>` AES-NI ilman roskienkeruuta), ja käyttöliittymään lisätään lennosta säädettävä **Nopeuskatto (TX Speed Limit)** (`Auto Dynamic`, `5000 Mbit/s`, `2500 Mbit/s`, `1000 Mbit/s`, `600 Mbit/s`, `300 Mbit/s`, `100 Mbit/s`), jota voi vaihtaa myös kesken siirron.
> - **Confirmed Decision 2 (Operaattorin CGNAT `100.78.109.243` ja WAN UDP P2P):** Osoitealue `100.64.0.0/10` (`100.64.*` – `100.127.*`) tunnistetaan operaattorin CGNAT-avaruudeksi, jolloin sovellus ei tuhlaa aikaa turhiin LAN TCP -yrityksiin vaan keskittyy 100 % suoraan STUN WAN UDP P2P -yhteyteen.

---

## 1. Miksi nopeus putosi 0,64 MB/s -tasolle (Juurisyyanalyysi)

1. **Kuittauslaskurin (`udpHighestContiguousChunk`) jäätyminen ensimmäiseen pudonneeseen UDP-pakettiin:**
   - Kun 5000 Mbit/s lähettäjä lähetti ensimmäisen puskurin 600 Mbit/s vastaanottajalle, operaattorin reititin pudotti nopeuseron vuoksi yksittäisen UDP-paketin (esim. paketin #12).
   - Koska vastaanottaja kasvatti `udpHighestContiguousChunk`-arvoa vain, jos **jokainen** paketti `0..N` oli saapunut ilman yhtäkään aukkoa, kuittauslaskuri jäätyi arvoon `11` koko loppulähetyksen ajaksi.
   - Koska puuttuvien pakettien `NACK`-pyyntö tehtiin vasta tiedoston lopussa (`AETHER_UDP_END`), pakettia #12 ei koskaan lähetetty uudelleen siirron aikana.
2. **Windowsin 15,625 ms ajastinkvantti (`WaitOne(2)` / `Thread.Sleep(1)`) jokaiselle 32 KB paketille:**
   - Kun kuittauslaskuri jäi jumiin, ehto `(currentChunk - udpPeerAckedChunk) > 192` oli tosi **jokaisella** 32 KB paketilla.
   - Windowsissa `WaitOne(2)` ja `Thread.Sleep(1)` nukuttavat säikeen oletuksena **15,625 ms** (64 Hz järjestelmäkello) ajaksi, jolloin lähetysnopeus lukittui arvoon $\frac{32\text{ KB}}{50\text{ ms}} \approx 0{,}64\text{ MB/s}$.

---

## 2. User Experience & Visual Design

- **Lennosta säädettävä Nopeuskatto (`TX Speed Cap`) `.EXE`-käyttöliittymässä:**
  - Oikeanpuoleiseen siirtopaneeliin (`2. Direct File Streamer`) lisätään selkeä valintavalikko (**UDP P2P Speed Cap / Pacing**):
    - `600 Mbit/s (75 MB/s — Optimal for 600 Mbit Receiver)` *(suositeltu oletus nykyiselle parille)*
    - `Auto Dynamic (Adapts 50–5000 Mbit/s from Receiver ACK Rate)`
    - `5000 Mbit/s (625 MB/s — Uncapped Line Rate)`
    - `2500 Mbit/s (312 MB/s)`
    - `1000 Mbit/s (125 MB/s — 1 Gbps)`
    - `300 Mbit/s (37,5 MB/s)`
    - `100 Mbit/s (12,5 MB/s)`
  - Jos käyttäjä vaihtaa arvoa kesken latauksen, lähettäjän Token-Bucket -tahdistin päivittää nopeuskaton välittömästi ilman siirron katkeamista.
- **Reaaliaikainen telemetria:**
  - Nopeusmittari näyttää todellisen siirtonopeuden (`MB/s` ja `Gbps`), ja loki raportoi mahdolliset reaaliaikaiset NACK-paikkaukset häiritsemättä siirtoa.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Mikrosekuntitason `Stopwatch` Token-Bucket -tahdistin (`Thread.Sleep` ja `WaitOne` kokonaan pois pakettisilmukasta)**
  - *Chosen Approach*: Käytetään laitteistotason korkean resoluution laskuria (`Stopwatch.GetTimestamp()`, tarkkuus 100 ns) ja Windows Multimedia Timer -tarkkuutta (`timeBeginPeriod(1)`). Jokaiselle 32 KB paketille lasketaan tarkka lähetysaika valitun nopeuskaton (esim. 600 Mbit/s = 13,33 µs / KB tai 5000 Mbit/s = 1,6 µs / KB) mukaan.
  - *Why*: Estää 5000 Mbit/s verkkokorttia ampumasta 5 Gbps mikro-purskeita, jotka ylivuotavat 600 Mbit/s vastaanottajan operaattoripuskurin, mutta ei koskaan pysäytä säiettä Windowsin 15,6 ms unisykliin.
- **Decision 2: Reaaliaikainen In-Flight NACK + Todelliseen vastaanottomäärään perustuva ACK**
  - *Chosen Approach*:
    1. Vastaanottaja lähettää `AETHER_UDP_ACK|<uniqueReceivedCount>|<highestSeenChunk>|<rxBitrateMbps>` 32 paketin (1 MB) välein. Yksittäinen pudonnut paketti **ei koskaan** pysäytä kuittauslaskuria.
    2. Heti kun vastaanottaja havaitsee aukon (`chunk < highestSeenChunk - 48`), se lähettää välittömästi `AETHER_UDP_NACK|<missingChunks>` **siirron aikana**, ja lähettäjä työntää puuttuvat palat suoraan seuraavaan lähetysaaltoon.
  - *Why*: Tiedosto valmistuu 100 % ehjänä yhdellä jatkuvalla vedolla ilman lopun pitkiä odotuksia tai ikkunan jumiutumista.
- **Decision 3: Lukkovapaa `ThreadLocal<Aes>` -instanssipooli 5000 Mbit/s suorituskykyyn**
  - *Chosen Approach*: Korvataan pakettikohtainen `new AesCryptoServiceProvider()` säiekohtaisella pysyvällä AES-NI -moottorilla, jolloin prosessoriytimet salaavat ja purkavat 4 MB aallot ilman muistiallokaatioiden tai avainten alustuksen viivettä.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────┐
│ LÄHETTÄJÄ (.EXE 5000 Mbit/s)                                               │
│                                                                            │
│  [16 MB FileStream] ──► [Parallel.For AES-NI (128x 32 KB = 4 MB Wave)]     │
│                                │                                           │
│                                ▼                                           │
│  [In-Flight NACK Queue] ──► [100ns Stopwatch Token-Bucket Pacer]           │
│   (Paikkaa pudonneet         • Säädettävä katto: Auto / 600 / 1000 / 5000  │
│    paketit lennosta)         • Ei koskaan WaitOne/Sleep-jumiutumista       │
└────────────────────────────────┬───────────────────────────────────────────┘
                                 │  STUN NAT-Punched WAN UDP (32 KB Frames)
                                 ▼
┌────────────────────────────────────────────────────────────────────────────┐
│ VASTAANOTTAJA (.EXE 600 Mbit/s)                                            │
│                                                                            │
│  [UdpP2pReceiveLoop (Highest Priority, 64 MB OS Socket Buffer)]            │
│         │                                                                  │
│         ▼ (Lock-Free ConcurrentQueue<byte[]>)                              │
│  [UdpP2pDiskWriterLoop]                                                    │
│   • Purkaa 128 pakettia rinnakkain (Parallel.For AES-NI)                   │
│   • Kirjoittaa 16 MB FileStreamiin (.part)                                 │
│   • Lähettää AETHER_UDP_ACK|<uniqueCount>|<highestSeen>|<measuredMbps>     │
│   • Lähettää reaaliaikaisen AETHER_UDP_NACK heti, kun aukko > 48 pakettia  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Keskeiset tilamuutokset ja komponentit:
1. **CGNAT-suodatus (`IsCgnatOrApipa`)**: Osoitteet `100.64.0.0/10` (`100.64.x.x` – `100.127.x.x`, kuten `100.78.109.243`) merkitään WAN/CGNAT-osoitteiksi, jolloin paikallinen TCP-yhdistäjä ohittaa ne ja käyttää suoraan STUN WAN UDP -tunnelia.
2. **Nopeusvalitsin (`cmbSpeedCap`)**: Päivittää atomisen `targetUdpBitrateMbps`-muuttujan (oletuksena `600 Mbit/s`, valittavissa `Auto Dynamic`, `5000 Mbit/s`, `2500 Mbit/s`, `1000 Mbit/s`, `600 Mbit/s`, `300 Mbit/s`, `100 Mbit/s`).
3. **Dynaaminen säätö (`Auto Dynamic`)**: Mittaa vastaanottajan `AETHER_UDP_ACK`-viesteistä todellisen vastaanottonopeuden ja pudonneiden pakettien suhteen: jos hävikki on `< 0,2 %`, kasvattaa lähetysnopeutta kohti 5000 Mbit/s; jos reititin pudottaa paketteja, asettaa tahdistimen automaattisesti vastaanottajan todellisen linjanopeuden (~600 Mbit/s) ylärajalle.
