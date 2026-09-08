import { Campaign, StageDefinition } from "@/types/campaign";

export const SUNBURST_STAGES: StageDefinition[] = [
  {
    id: "initial_access",
    title: "Stage 1: Supply Chain Tampering & Backdoor Deployment",
    shortTitle: "1. Initial Access",
    description:
      "Attacker compromises the SolarWinds Orion build pipeline and injects the SUNBURST backdoor (SolarWinds.Orion.Core.BusinessLayer.dll) into legitimate, digitally signed updates.",
    keyObjectives: [
      "Infiltrate software build environment (SUNSPOT injector)",
      "Trojanize SolarWinds.Orion.Core.BusinessLayer.dll without breaking digital signature",
      "Deliver malicious updates to ~18,000 public and private sector Orion instances",
    ],
    order: 1,
  },
  {
    id: "persistence_evasion",
    title: "Stage 2: Dormancy, Anti-Analysis & In-Memory Staging",
    shortTitle: "2. Defense Evasion",
    description:
      "SUNBURST executes a mandatory 12 to 14-day sleep cycle. Upon waking, it checks running processes, services, and driver hashes against an extensive blacklist of AV/EDR tools.",
    keyObjectives: [
      "Evade sandbox analysis via two-week dormancy timer",
      "Scan process list for security agents (Defender, CrowdStrike, Carbon Black, Sysmon)",
      "Set registry keys to disable Windows Defender telemetry and event reporting",
      "Dynamically resolve Windows API hashes at runtime to bypass static IAT inspection",
    ],
    order: 2,
  },
  {
    id: "lateral_movement",
    title: "Stage 3: Token Impersonation & Golden SAML Lateral Pivot",
    shortTitle: "3. Credential & Lateral",
    description:
      "Nobelium operators obtain administrative access on the Orion server, pivot to Active Directory Federation Services (ADFS), extract the token-signing private key, and mint Golden SAML assertions.",
    keyObjectives: [
      "Dump memory from LSASS using mini-dump APIs masquerading as crash dump utilities",
      "Steal ADFS token-signing private certificates using custom toolkits",
      "Forge Golden SAML assertions to access Microsoft 365 cloud workloads as any target user",
      "Bypass Multi-Factor Authentication (MFA) entirely via forged trusted SAML claims",
    ],
    order: 3,
  },
  {
    id: "exfiltration",
    title: "Stage 4: DGA DNS Tunneling, C2 Beacons & Data Exfiltration",
    shortTitle: "4. C2 & Exfiltration",
    description:
      "SUNBURST calculates a Domain Generation Algorithm (DGA) sub-domain targeting avsvmcloud[.]com. Telemetry is encoded in DNS A record queries, resolving to secondary HTTP/HTTPS beacons.",
    keyObjectives: [
      "Encode victim AD domain and GUID into synthetic DNS queries to avsvmcloud[.]com",
      "Receive CNAME response directing victim to tier-2 dedicated C2 VPS infrastructures",
      "Stage TEARDROP / Raindrop in-memory memory-only loaders via custom named pipes",
      "Exfiltrate sensitive emails and executive communications via encrypted HTTPS POST payloads",
    ],
    order: 4,
  },
];

export const SUNBURST_CAMPAIGN: Campaign = {
  id: "sunburst",
  title: "UNC2452 / SolarWinds SUNBURST Supply Chain",
  actor: "Nobelium / APT29 / Cozy Bear (SVR)",
  actorAliases: ["UNC2452", "Dark Halo", "StellarParticle", "SolarStorm"],
  year: "2020",
  targetSector: "US Federal Agencies, Critical Infrastructure, Global IT & Cybersecurity Vendors",
  attackVector: "Compromised CI/CD Software Build System (Supply Chain Insertion)",
  impact: "Global compromise of over 18,000 Orion servers; direct secondary exfiltration on ~100 high-value government and tech entities.",
  summary:
    "A sophisticated state-sponsored supply-chain compromise where Russian SVR operators injected an evasive backdoor into the official Orion IT monitoring software, using DGA DNS tunneling and Golden SAML identity federation forgery.",
  stages: SUNBURST_STAGES,
  nodes: [
    // --- STAGE 1 NODES ---
    {
      id: "node-build-pipeline",
      type: "custom",
      position: { x: 50, y: 140 },
      data: {
        id: "node-build-pipeline",
        label: "SUNSPOT Injector",
        subLabel: "msbuild.exe / SolarWinds CI/CD",
        entityType: "process",
        techniqueId: "T1195.002",
        techniqueName: "Supply Chain Compromise: S/W Dependencies",
        stage: "initial_access",
        redDetails: {
          summary: "SUNSPOT monitored Orion build servers for MsBuild.exe and replaced InventoryManager.cs source files on-the-fly right before compilation.",
          commandLine: "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\MSBuild.exe /nologo /t:Rebuild SolarWinds.Orion.Core.sln",
          parentProcess: "jenkins-agent.exe (PID 4820)",
          toolOrMalware: "SUNSPOT / InventoryManager Injector",
          attackerIntent: "Inject backdoor without leaving disk traces or failing build hashes during compilation step.",
          mechanics: [
            "Intercepts msbuild.exe execution by monitoring process creations",
            "Scans source code directory for InventoryManager.cs",
            "Swaps file with malicious variant containing SUNBURST code",
            "Restores legitimate source file immediately after compiler finishes",
          ],
        },
        blueDetails: {
          summary: "Look for unexpected file writes to source directories by processes other than git/SVN or developer user accounts during build windows.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 11,
              description: "FileCreate event in build directory during MSBuild execution",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>11</EventID>
    <TimeCreated SystemTime="2020-03-24T11:42:01.8841920Z" />
    <Computer>BUILD-SRV-04.solarwinds.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\Temp\\taskhost_svc.exe</Data>
    <Data Name="TargetFilename">C:\\Source\\Orion\\Core\\InventoryManager.cs</Data>
    <Data Name="CreationUtcTime">2020-03-24 11:42:01.882</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Suspicious File Modification in Software Build Pipeline",
              severity: "high",
              mitreRef: "T1195.002",
              ruleContent: `title: Suspicious Build Pipeline Source Modification
id: 8f742b01-5e92-4f38-912a-0a41d99901aa
status: production
description: Detects unexpected non-compiler processes writing to source code repository folders on build machines
logsource:
  product: windows
  category: file_event
detection:
  selection:
    TargetFilename|startswith: 'C:\\Source\\'
    TargetFilename|endswith:
      - '.cs'
      - '.cpp'
      - '.c'
  filter_legit:
    Image|endswith:
      - '\\git.exe'
      - '\\devenv.exe'
  condition: selection and not filter_legit
falsepositives:
  - Automated code generation scripts
level: high`,
            },
          ],
          detectionPitfalls: [
            "Source file was reverted in under 400ms, defeating traditional scheduled disk scanners.",
            "Legitimate code-signing certificates were applied post-build, masking the artifact as trusted.",
          ],
        },
      },
    },
    {
      id: "node-trojan-dll",
      type: "custom",
      position: { x: 560, y: 140 },
      data: {
        id: "node-trojan-dll",
        label: "SolarWinds.Orion.Core.BusinessLayer.dll",
        subLabel: "Trojanized Signed Assembly",
        entityType: "file",
        techniqueId: "T1574.002",
        techniqueName: "Hijack Execution Flow: DLL Side-Loading",
        stage: "initial_access",
        redDetails: {
          summary: "The compiled SolarWinds.Orion.Core.BusinessLayer.dll contains the embedded SUNBURST backdoor payload, digitally signed by SolarWinds Worldwide, LLC.",
          commandLine: "Digital Signature: SHA256 0fe978583e630d607833daf140bc4b32ad9ff34d125ab4613b704f47f7300a3f",
          toolOrMalware: "SUNBURST Backdoor (Core Assembly)",
          attackerIntent: "Establish trusted execution footprint inside Orion service without triggering signature verification alarms.",
          mechanics: [
            "Embedded as a legitimate component within Orion Core Business Layer",
            "Loaded automatically when SolarWinds.BusinessLayerHost.exe starts",
            "Authenticated with genuine digital certificate timestamped March-May 2020",
          ],
        },
        blueDetails: {
          summary: "Monitor for unexpected exports or runtime hash discrepancies in SolarWinds core DLL files against baseline inventory.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 7,
              description: "ImageLoaded event: Orion service loading trojanized DLL",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>7</EventID>
    <TimeCreated SystemTime="2020-04-10T14:15:33.1092000Z" />
    <Computer>ORION-CORE-SRV.victim-corp.com</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe</Data>
    <Data Name="ImageLoaded">C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.Orion.Core.BusinessLayer.dll</Data>
    <Data Name="Hashes">SHA256=0fe978583e630d607833daf140bc4b32ad9ff34d125ab4613b704f47f7300a3f</Data>
    <Data Name="Signed">true</Data>
    <Data Name="SignatureStatus">Valid</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "YARA",
              title: "APT_UNC2452_SUNBURST_Core_Payload",
              severity: "critical",
              mitreRef: "T1574.002",
              ruleContent: `rule APT_UNC2452_SUNBURST_Core_Payload {
    meta:
        description = "Detects trojanized SolarWinds.Orion.Core.BusinessLayer.dll"
        author = "Detection Engineering Team"
        reference = "FireEye / CISA Alert AA20-352A"
        date = "2020-12-13"
    strings:
        $s1 = "SolarWinds.Orion.Core.BusinessLayer.BackgroundInventory" ascii
        $s2 = "avsvmcloud.com" wide ascii
        $s3 = "app_web_logo.png" wide
        $hash1 = { 56 61 6c 75 65 54 79 70 65 00 47 65 74 48 61 73 68 }
    condition:
        uint16(0) == 0x5a4d and all of ($s*)
}`,
            },
          ],
          detectionPitfalls: [
            "Signature validation passed because the malicious code was signed by the genuine vendor private key during build.",
          ],
        },
      },
    },

    // --- STAGE 2 NODES ---
    {
      id: "node-orion-host",
      type: "custom",
      position: { x: 1080, y: 140 },
      data: {
        id: "node-orion-host",
        label: "SolarWinds.BusinessLayerHost",
        subLabel: "PID 3144 / Orion Main Service",
        entityType: "process",
        techniqueId: "T1059.001",
        techniqueName: "Command and Scripting Interpreter",
        stage: "persistence_evasion",
        redDetails: {
          summary: "The main Orion service host process initializes SUNBURST background worker thread, initiates anti-analysis routines, and enforces dormancy.",
          commandLine: "C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe /service",
          parentProcess: "services.exe (PID 680)",
          attackerIntent: "Execute backdoor payload inside the context of a legitimate SYSTEM-level background service.",
          mechanics: [
            "Starts a background thread named OrionImprovementBusinessLayer",
            "Enforces strict 12 to 14-day sleep timer to prevent sandbox automated analysis",
            "Hashes names of running processes using fnv-1a custom hash to check against security tools",
          ],
        },
        blueDetails: {
          summary: "Analyze thread call stacks and parent-child process anomalies originating from SolarWinds.BusinessLayerHost.exe.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 1,
              description: "Process creation by Orion service spawning system utilities",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>1</EventID>
    <TimeCreated SystemTime="2020-04-25T08:19:04.1284920Z" />
    <Computer>ORION-CORE-SRV.victim-corp.com</Computer>
  </System>
  <EventData>
    <Data Name="UtcTime">2020-04-25 08:19:04.128</Data>
    <Data Name="ProcessId">4192</Data>
    <Data Name="Image">C:\\Windows\\System32\\cmd.exe</Data>
    <Data Name="CommandLine">cmd.exe /c "ipconfig /all & netstat -ano"</Data>
    <Data Name="ParentProcessId">3144</Data>
    <Data Name="ParentImage">C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "SolarWinds Service Spawning Suspicious Child Process",
              severity: "critical",
              mitreRef: "T1059.001",
              ruleContent: `title: SolarWinds Orion Process Spawning Shell or Recon
id: 53a2908f-bf2a-4318-912b-319ef47d6321
status: production
description: Detects SolarWinds.BusinessLayerHost.exe spawning shells, scripting interpreters, or network recon tools
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    ParentImage|endswith: '\\SolarWinds.BusinessLayerHost.exe'
    Image|endswith:
      - '\\cmd.exe'
      - '\\powershell.exe'
      - '\\pwsh.exe'
      - '\\rundll32.exe'
      - '\\appcmd.exe'
      - '\\wmic.exe'
  condition: selection
falsepositives:
  - Rare administrative custom scripts executed via SolarWinds Alert Manager
level: critical`,
            },
          ],
          detectionPitfalls: [
            "SolarWinds.BusinessLayerHost.exe normally generates high volumes of database and telemetry network traffic, masking malicious activity.",
          ],
        },
      },
    },
    {
      id: "node-anti-analysis",
      type: "custom",
      position: { x: 1080, y: 440 },
      data: {
        id: "node-anti-analysis",
        label: "Anti-EDR & Hash Check",
        subLabel: "fnv-1a Blacklist Filtering",
        entityType: "registry",
        techniqueId: "T1562.001",
        techniqueName: "Impair Defenses: Disable or Modify Tools",
        stage: "persistence_evasion",
        redDetails: {
          summary: "Iterates through all running processes and drivers, computing FNV-1a hashes to identify security products without storing plaintext tool strings.",
          commandLine: "Registry write: HKLM\\SYSTEM\\CurrentControlSet\\Services\\* -> Disable Registry Keys",
          attackerIntent: "Permanently terminate backdoor execution if running in analysis sandbox, or disable local telemetry.",
          mechanics: [
            "Calculates FNV-1a hash of process names (e.g. hash of 'sysmon64.exe' is 0x4f128c7b)",
            "Matches against hardcoded array of over 200 AV, EDR, and reverse-engineering tool hashes",
            "Adjusts service startup configurations in registry to 'Disabled' for targeted security agents",
          ],
        },
        blueDetails: {
          summary: "Monitor for registry modifications under CurrentControlSet\\Services tampering with security service start types.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 13,
              description: "Registry value set: modifying driver service configuration",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>13</EventID>
    <TimeCreated SystemTime="2020-04-25T08:21:12.3391020Z" />
    <Computer>ORION-CORE-SRV.victim-corp.com</Computer>
  </System>
  <EventData>
    <Data Name="EventType">SetValue</Data>
    <Data Name="Image">C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe</Data>
    <Data Name="TargetObject">HKLM\\SYSTEM\\CurrentControlSet\\Services\\WdFilter\\Start</Data>
    <Data Name="Details">DWORD (0x00000004)</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Tampering With Windows Defender Service Configuration",
              severity: "high",
              mitreRef: "T1562.001",
              ruleContent: `title: Windows Defender Filter Driver Service Disabled
id: c4a58b29-1051-419b-a0ee-60291e6b3419
status: production
description: Detects registry edits modifying start type of Windows Defender or EDR filter drivers to disabled (4)
logsource:
  product: windows
  category: registry_set
detection:
  selection:
    TargetObject|contains:
      - '\\Services\\WdFilter\\Start'
      - '\\Services\\WdBoot\\Start'
      - '\\Services\\Sense\\Start'
    Details: 'DWORD (0x00000004)'
  condition: selection
level: high`,
            },
          ],
          detectionPitfalls: [
            "In-memory hash checking produces zero network signatures and leaves no string artifacts in memory dump strings.",
          ],
        },
      },
    },

    // --- STAGE 3 NODES ---
    {
      id: "node-lsass-dump",
      type: "custom",
      position: { x: 1600, y: 140 },
      data: {
        id: "node-lsass-dump",
        label: "LSASS Memory Dump",
        subLabel: "comsvcs.dll / rundll32.exe",
        entityType: "process",
        techniqueId: "T1003.001",
        techniqueName: "OS Credential Dumping: LSASS Memory",
        stage: "lateral_movement",
        redDetails: {
          summary: "Executes MiniDump export via rundll32 and comsvcs.dll to extract local administrator and service account NTLM hashes and Kerberos tickets.",
          commandLine: "rundll32.exe C:\\Windows\\System32\\comsvcs.dll, MiniDump 672 C:\\Windows\\Temp\\crash.dmp full",
          parentProcess: "SolarWinds.BusinessLayerHost.exe (PID 3144)",
          toolOrMalware: "Native comsvcs.dll Living-Off-The-Land Binary (LOLBIN)",
          attackerIntent: "Obtain administrative credentials to enable lateral movement toward Active Directory Domain Controllers and ADFS servers.",
          mechanics: [
            "Leverages comsvcs.dll export #24 (MiniDumpW)",
            "Opens LSASS process with PROCESS_ALL_ACCESS rights",
            "Writes full memory contents to temporary file disguising as crash dump",
          ],
        },
        blueDetails: {
          summary: "Flag any process invocation referencing comsvcs.dll and MiniDump argument, or LSASS handle access with PROCESS_VM_READ permissions.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 10,
              description: "ProcessAccess: rundll32 accessing LSASS memory space",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>10</EventID>
    <TimeCreated SystemTime="2020-04-26T02:14:50.4819200Z" />
    <Computer>ORION-CORE-SRV.victim-corp.com</Computer>
  </System>
  <EventData>
    <Data Name="SourceImage">C:\\Windows\\System32\\rundll32.exe</Data>
    <Data Name="TargetImage">C:\\Windows\\System32\\lsass.exe</Data>
    <Data Name="GrantedAccess">0x1FFFFF</Data>
    <Data Name="CallTrace">C:\\Windows\\SYSTEM32\\ntdll.dll+9fb94|C:\\Windows\\System32\\KERNELBASE.dll+2746e|C:\\Windows\\System32\\comsvcs.dll+1a590</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "LSASS Memory Dump via Comsvcs DLL",
              severity: "critical",
              mitreRef: "T1003.001",
              ruleContent: `title: LSASS Memory Dump via Comsvcs.dll
id: 09e53611-a20c-4032-a4d4-28b9a14d59a8
status: production
description: Detects dumping of LSASS memory using rundll32 and comsvcs.dll
logsource:
  product: windows
  category: process_creation
detection:
  selection:
    Image|endswith: '\\rundll32.exe'
    CommandLine|contains:
      - 'comsvcs'
      - 'MiniDump'
  condition: selection
level: critical`,
            },
          ],
          detectionPitfalls: [
            "Attacker renamed output dump file to .tmp and .dmp, simulating legitimate Windows crash reporting dumps.",
          ],
        },
      },
    },
    {
      id: "node-adfs-pivot",
      type: "custom",
      position: { x: 1600, y: 440 },
      data: {
        id: "node-adfs-pivot",
        label: "Golden SAML Forgery",
        subLabel: "ADFS Token-Signing Key Theft",
        entityType: "user",
        techniqueId: "T1558.004",
        techniqueName: "Steal or Forge Kerberos/SAML Tickets",
        stage: "lateral_movement",
        redDetails: {
          summary: "Using stolen DA credentials, operators moved to ADFS servers, extracted the DKM-encrypted token-signing certificate, and generated offline SAML assertions.",
          commandLine: "Export-PfxCertificate -Cert (Get-Item Cert:\\LocalMachine\\My\\<Thumbprint>) -FilePath C:\\ADFS_Sign.pfx",
          parentProcess: "powershell.exe -NonInteractive",
          attackerIntent: "Gain persistent, unrevokable cloud authentication without password changes or triggering MFA challenges.",
          mechanics: [
            "Pivots to ADFS Federation Server using Windows Remote Management (WinRM)",
            "Accesses Active Directory Distributed Key Manager (DKM) container",
            "Extracts X.509 token-signing private certificate",
            "Mints synthetic SAML 2.0 assertions offline for any target user identity (e.g. C-Suite, SecOps)",
          ],
        },
        blueDetails: {
          summary: "Monitor ADFS database access, DKM container attribute reads in AD, and SAML claim issuance lacking correlating 4624 logon events on ADFS.",
          telemetry: [
            {
              source: "Windows Security",
              eventId: 4662,
              description: "Operation performed on Active Directory object (DKM Container read)",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing" Guid="{54849625-5478-4994-A5BA-3E3B0328C30D}" />
    <EventID>4662</EventID>
    <TimeCreated SystemTime="2020-04-26T03:45:11.8920190Z" />
    <Computer>DC-01.victim-corp.com</Computer>
  </System>
  <EventData>
    <Data Name="SubjectUserName">SVC_SolarWindsAdmin</Data>
    <Data Name="ObjectName">CN=ADFS,CN=Microsoft,CN=Program Data,DC=victim-corp,DC=com</Data>
    <Data Name="AccessMask">0x10</Data>
    <Data Name="Properties">{793a383f-7100-11d3-beae-0040f6dd79f8}</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Splunk SPL",
              title: "ADFS Token Signing Key Access Anomalies",
              severity: "critical",
              mitreRef: "T1558.004",
              ruleContent: `index=wineventlog EventCode=4662 ObjectName="*CN=ADFS,CN=Microsoft,CN=Program Data*"
| stats count by SubjectUserName, ComputerName, _time
| where count > 1 AND NOT SubjectUserName="ADFSServiceAccount$"`,
            },
          ],
          detectionPitfalls: [
            "Forged SAML tokens look completely authentic to Microsoft 365 and Azure AD because the signature is mathematically valid.",
          ],
        },
      },
    },

    // --- STAGE 4 NODES ---
    {
      id: "node-dga-dns",
      type: "custom",
      position: { x: 2120, y: 140 },
      data: {
        id: "node-dga-dns",
        label: "DGA DNS Tunnel",
        subLabel: "*.avsvmcloud.com",
        entityType: "network",
        techniqueId: "T1071.004",
        techniqueName: "Application Layer Protocol: DNS",
        stage: "exfiltration",
        redDetails: {
          summary: "SUNBURST constructs dynamic subdomains encoding victim computer GUID, AD domain name, and security status into DNS queries sent to avsvmcloud.com authoritative servers.",
          commandLine: "DNS Query: 1a2b3c4d5e6f7g8h.appsync-api.eu-west-1.avsvmcloud.com -> Type A / CNAME",
          attackerIntent: "Exfiltrate initial reconnaissance fingerprint and establish secondary C2 channel without direct IP connections.",
          mechanics: [
            "Encodes internal domain name using custom base32/hex encoding",
            "Transmits encoded string inside subdomain label to authoritative DNS server",
            "If victim is deemed high-value, attacker DNS server responds with CNAME record pointing to tier-2 C2 domain",
          ],
        },
        blueDetails: {
          summary: "Analyze DNS resolver logs for high-entropy subdomains resolving under avsvmcloud.com or newly registered dynamic DNS infrastructure.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 22,
              description: "DnsQuery event: SolarWinds process querying DGA subdomain",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>22</EventID>
    <TimeCreated SystemTime="2020-04-26T04:12:09.1120440Z" />
    <Computer>ORION-CORE-SRV.victim-corp.com</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Program Files (x86)\\SolarWinds\\Orion\\SolarWinds.BusinessLayerHost.exe</Data>
    <Data Name="QueryName">04fbc87a911e3b5a.appsync-api.us-east-1.avsvmcloud.com</Data>
    <Data Name="QueryStatus">0</Data>
    <Data Name="QueryResults">::ffff:13.59.205.66;</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "SUNBURST DGA Domain DNS Resolution",
              severity: "critical",
              mitreRef: "T1071.004",
              ruleContent: `title: SolarWinds SUNBURST C2 DNS Query
id: a9d8194b-14b5-4b51-9988-51f2b1cb56d0
status: production
description: Detects DNS queries to known SUNBURST C2 domain avsvmcloud.com and its subdomains
logsource:
  product: windows
  category: dns_query
detection:
  selection:
    QueryName|endswith:
      - '.avsvmcloud.com'
      - '.freescanonline.com'
      - '.deftsecurity.com'
  condition: selection
level: critical`,
            },
          ],
          detectionPitfalls: [
            "DNS queries mimic legitimate AWS/Azure cloud API endpoint naming conventions, blending into high-volume cloud egress.",
          ],
        },
      },
    },
    {
      id: "node-c2-beacon",
      type: "custom",
      position: { x: 2120, y: 440 },
      data: {
        id: "node-c2-beacon",
        label: "TEARDROP / Raindrop C2",
        subLabel: "Encrypted HTTPS Exfiltration",
        entityType: "network",
        techniqueId: "T1041",
        techniqueName: "Exfiltration Over C2 Channel",
        stage: "exfiltration",
        redDetails: {
          summary: "Deployed custom memory-only loaders (TEARDROP) that loaded Cobalt Strike Beacons into memory without writing binaries to disk, using custom SSL certificates.",
          commandLine: "HTTPS POST https://victim-specific-c2.cloudservice-telemetry.com/api/v1/metrics [Payload Encrypted AES-CBC]",
          attackerIntent: "Establish interactive command execution and exfiltrate sensitive executive mailboxes and source code.",
          mechanics: [
            "Runs entirely in RAM inside legitimate svchost.exe or print spooler process memory space",
            "Implements custom Named Pipes (\\\\.\\pipe\\583d7e95-...) for inter-process communications",
            "Sends periodic heartbeat beacons disguised as Microsoft WebSockets/JSON telemetry updates",
          ],
        },
        blueDetails: {
          summary: "Inspect outbound SSL/TLS sessions from non-browser system processes with anomalous JA3/JA3S fingerprints and irregular beacon jitter.",
          telemetry: [
            {
              source: "Zeek",
              eventId: "ssl.log",
              description: "Zeek SSL handshake record for secondary C2 communication",
              format: "json",
              rawSample: `{
  "ts": 1587874932.418,
  "uid": "CHz8912A349bcK",
  "id.orig_h": "10.0.4.15",
  "id.orig_p": 49812,
  "id.resp_h": "185.225.69.69",
  "id.resp_p": 443,
  "version": "TLSv1.2",
  "cipher": "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
  "server_name": "api.cloudservice-telemetry.com",
  "ja3": "a0e9f5d64349fb13191bc781f81f42e1",
  "ja3s": "ec74a5c5110605f9f8eac84b7252e1fb"
}`,
            },
          ],
          rules: [
            {
              format: "Suricata",
              title: "ET MALWARE Nobelium TEARDROP Outbound C2 Beacon",
              severity: "critical",
              mitreRef: "T1041",
              ruleContent: `alert tls $HOME_NET any -> $EXTERNAL_NET 443 (msg:"ET TROJAN UNC2452/Nobelium C2 TLS Certificate Observed"; tls.cert_subject; content:"CN=cloudservice-telemetry.com"; nocase; flow:established,to_server; reference:url,fireeye.com/blog/threat-research/2020/12/evasive-attacker-leverages-solarwinds-supply-chain.html; classtype:trojan-activity; sid:2031548; rev:1;)`,
            },
          ],
          detectionPitfalls: [
            "Attacker assigned a unique, dedicated second-stage C2 IP and domain name per victim organization, preventing global IOC IP blocklists.",
          ],
        },
      },
    },
  ],
  edges: [
    {
      id: "edge-1-2",
      source: "node-build-pipeline",
      target: "node-trojan-dll",
      animated: true,
      data: {
        relation: "Injected Malicious Code",
        label: "Compiles into",
        stage: "initial_access",
        isCausal: true,
      },
    },
    {
      id: "edge-2-3",
      source: "node-trojan-dll",
      target: "node-orion-host",
      animated: true,
      data: {
        relation: "Service Load Event",
        label: "Loaded by",
        stage: "persistence_evasion",
        isCausal: true,
      },
    },
    {
      id: "edge-3-4",
      source: "node-orion-host",
      target: "node-anti-analysis",
      animated: true,
      data: {
        relation: "Defensive Check",
        label: "Checks EDR / Disables",
        stage: "persistence_evasion",
        isCausal: true,
      },
    },
    {
      id: "edge-3-5",
      source: "node-orion-host",
      target: "node-lsass-dump",
      animated: true,
      data: {
        relation: "Process Spawn",
        label: "Spawns MiniDump",
        stage: "lateral_movement",
        isCausal: true,
      },
    },
    {
      id: "edge-5-6",
      source: "node-lsass-dump",
      target: "node-adfs-pivot",
      animated: true,
      data: {
        relation: "Credential Abuse",
        label: "Harvests DA / Extracts DKM",
        stage: "lateral_movement",
        isCausal: true,
      },
    },
    {
      id: "edge-3-7",
      source: "node-orion-host",
      target: "node-dga-dns",
      animated: true,
      data: {
        relation: "Network DNS Query",
        label: "DGA Queries",
        stage: "exfiltration",
        protocol: "DNS (UDP 53)",
        isCausal: true,
      },
    },
    {
      id: "edge-7-8",
      source: "node-dga-dns",
      target: "node-c2-beacon",
      animated: true,
      data: {
        relation: "C2 Resolution",
        label: "CNAME Pivot -> HTTPS",
        stage: "exfiltration",
        protocol: "HTTPS (TCP 443)",
        isCausal: true,
      },
    },
  ],
};
