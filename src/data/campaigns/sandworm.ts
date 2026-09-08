import { Campaign, StageDefinition } from "@/types/campaign";

export const SANDWORM_STAGES: StageDefinition[] = [
  {
    id: "initial_access",
    title: "Stage 1: IT Network Infiltration & Pivot to SCADA/OT",
    shortTitle: "1. IT/OT Infiltration",
    description:
      "Sandworm actors infiltrate the energy provider's corporate IT network via compromised VPN credentials, establish foothold on an engineering jump host, and pivot through firewalled OT DMZ boundaries.",
    keyObjectives: [
      "Access enterprise perimeter via stolen administrative VPN credentials",
      "Compromise internal Active Directory domain controller",
      "Deploy Scheduled Tasks targeting IT-to-OT jump host bastions",
    ],
    order: 1,
  },
  {
    id: "persistence_evasion",
    title: "Stage 2: Staging Industroyer2 & Destructive Wiper Payloads",
    shortTitle: "2. Malware Staging & Evasion",
    description:
      "Operators stage the custom compiled Industroyer2 IEC-104 ICS malware alongside CaddyWiper and OrcaShred wipers, disguising processes as standard Windows services and batch scripts.",
    keyObjectives: [
      "Place 108_urv.exe (Industroyer2) in temporary directories",
      "Execute CaddyWiper via GPO scheduled task to wipe disk sectors",
      "Masquerade malware execution under svchost.exe wrapper scripts",
    ],
    order: 2,
  },
  {
    id: "lateral_movement",
    title: "Stage 3: Substation RTU Addressing & IEC 60870-5-104 Telemetry",
    shortTitle: "3. OT Protocol Execution",
    description:
      "Industroyer2 sends hardcoded IEC-104 Application Protocol Data Units (APDUs) to specific substation Remote Terminal Units (RTUs) to manipulate high-voltage electrical circuit breakers.",
    keyObjectives: [
      "Initiate IEC-104 STARTDT (Start Data Transfer) handshakes on TCP port 2404",
      "Send ASDU Type 45 (Single Command) and Type 46 (Double Command) frames",
      "Force circuit breakers to OPEN state across transmission substations",
    ],
    order: 3,
  },
  {
    id: "exfiltration",
    title: "Stage 4: Blackout Trigger, MBR Destruction & Log Eradication",
    shortTitle: "4. Impact & Destructive Wipe",
    description:
      "Simultaneously triggers physical electrical power outages while deploying CaddyWiper to zero out Master Boot Records (MBR), erasing event logs and bricking SCADA Human-Machine Interfaces (HMIs).",
    keyObjectives: [
      "Trip high-voltage feeder breakers plunging target regions into blackout",
      "Execute CaddyWiper to overwrite physical drive sectors from offset 0x00",
      "Destroy Windows event logs via wevtutil to impede post-incident digital forensics",
    ],
    order: 4,
  },
];

export const SANDWORM_CAMPAIGN: Campaign = {
  id: "sandworm",
  title: "Sandworm / Industroyer2 OT Grid Sabotage",
  actor: "Sandworm (GRU Military Unit 74455)",
  actorAliases: ["TeleBots", "Voodoo Bear", "Iron Viking", "Seashell Blizzard"],
  year: "2022",
  targetSector: "Energy & Electrical Power Distribution Infrastructure",
  attackVector: "Compromised Corporate IT Network -> OT SCADA Jump Host Pivot",
  impact: "Targeted transmission substations in Ukraine; thwarted moments before disconnecting electrical power to millions of residents.",
  summary:
    "A direct cyber-physical sabotage attack targeting high-voltage electrical substations in Ukraine using Industroyer2, a tailored IEC 60870-5-104 protocol attack framework paired with CaddyWiper disk wiping malware.",
  stages: SANDWORM_STAGES,
  nodes: [
    // STAGE 1
    {
      id: "sandworm-node-vpn",
      type: "custom",
      position: { x: 50, y: 120 },
      data: {
        id: "sandworm-node-vpn",
        label: "Compromised VPN Gateway",
        subLabel: "External Perimeter Infiltration",
        entityType: "network",
        techniqueId: "T1133",
        techniqueName: "External Remote Services",
        stage: "initial_access",
        redDetails: {
          summary: "Threat actor utilized valid enterprise VPN credentials without multi-factor authentication to access the internal corporate network.",
          commandLine: "SSL-VPN Authentication from IP 194.26.29.112 -> User: ot-admin",
          attackerIntent: "Establish reliable, authenticated ingress into the enterprise active directory environment.",
          mechanics: [
            "Authenticates against corporate SSL VPN using harvested credentials",
            "Leverages split-tunneling to map internal management subnets",
            "Identifies engineering jump stations with dual-homed NICs to the OT network",
          ],
        },
        blueDetails: {
          summary: "Correlate VPN connection source geolocation and anomalous concurrent logon times with Active Directory authentications.",
          telemetry: [
            {
              source: "Windows Security",
              eventId: 4624,
              description: "Successful network logon (LogonType 3) via VPN gateway",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Security-Auditing" Guid="{54849625-5478-4994-A5BA-3E3B0328C30D}" />
    <EventID>4624</EventID>
    <TimeCreated SystemTime="2022-04-08T16:20:00.1248000Z" />
    <Computer>DC-PRIMARY.power-grid.local</Computer>
  </System>
  <EventData>
    <Data Name="TargetUserName">ot-admin</Data>
    <Data Name="LogonType">3</Data>
    <Data Name="IpAddress">194.26.29.112</Data>
    <Data Name="AuthenticationPackageName">Kerberos</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Anomalous Admin VPN Logon from Foreign IP Space",
              severity: "high",
              mitreRef: "T1133",
              ruleContent: `title: Administrative Remote VPN Ingress Anomalies
id: 3c8e41a9-3382-4911-b3b4-482a170562e1
status: production
logsource:
  product: windows
  service: security
detection:
  selection:
    EventID: 4624
    LogonType: 3
    TargetUserName|contains:
      - 'ot-admin'
      - 'scada-admin'
  condition: selection
level: high`,
            },
          ],
          detectionPitfalls: [
            "Valid credentials look legitimate in standard authentication logs unless correlated with threat intelligence IP reputations.",
          ],
        },
      },
    },
    {
      id: "sandworm-node-jumphost",
      type: "custom",
      position: { x: 440, y: 120 },
      data: {
        id: "sandworm-node-jumphost",
        label: "SCADA Jump Host",
        subLabel: "Dual-NIC Pivot Gateway",
        entityType: "host",
        techniqueId: "T1021.001",
        techniqueName: "Remote Desktop Protocol",
        stage: "initial_access",
        redDetails: {
          summary: "Threat actors RDP into the designated SCADA engineering jump host, bridging the corporate IT network and the segmented OT substation networks.",
          commandLine: "mstsc.exe /v:10.100.4.50:3389",
          parentProcess: "explorer.exe",
          toolOrMalware: "Native Remote Desktop Protocol",
          attackerIntent: "Gain direct interactive console access inside the protected ICS/OT operational subnet.",
          mechanics: [
            "Pivots through firewall rule permitting RDP from IT management VLAN to OT Jump Host",
            "Verifies network connectivity to remote RTUs over IEC-104 (TCP 2404)",
            "Prepares scheduled task payload deployment scripts",
          ],
        },
        blueDetails: {
          summary: "Monitor for cross-zone RDP sessions bridging IT and OT security perimeters.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 3,
              description: "Network connection initiated to RDP service on OT Jump Host",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>3</EventID>
    <TimeCreated SystemTime="2022-04-08T16:35:12.9810200Z" />
    <Computer>OT-JUMP-01.scada.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\System32\\svchost.exe</Data>
    <Data Name="DestinationIp">10.100.4.50</Data>
    <Data Name="DestinationPort">3389</Data>
    <Data Name="Protocol">tcp</Data>
    <Data Name="User">NT AUTHORITY\\NETWORK SERVICE</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Unauthorized IT-to-OT Perimeter RDP Traffic",
              severity: "critical",
              mitreRef: "T1021.001",
              ruleContent: `title: Cross-Zone RDP Connection into OT Subnet
id: 61fa9041-e940-4cb1-8071-692ab1805da1
status: production
logsource:
  category: network_connection
detection:
  selection:
    DestinationPort: 3389
    DestinationIp|startswith: '10.100.'
  condition: selection
level: critical`,
            },
          ],
          detectionPitfalls: [
            "Jump host was legitimate administrative infrastructure, making RDP traffic appear normal during shift changes.",
          ],
        },
      },
    },

    // STAGE 2
    {
      id: "sandworm-node-loader",
      type: "custom",
      position: { x: 860, y: 120 },
      data: {
        id: "sandworm-node-loader",
        label: "Industroyer2 Binary",
        subLabel: "108_urv.exe / IEC-104 Malware",
        entityType: "process",
        techniqueId: "T1059.003",
        techniqueName: "Windows Command Shell",
        stage: "persistence_evasion",
        redDetails: {
          summary: "Custom compiled C++ standalone binary (108_urv.exe) containing hardcoded configuration data for target substation RTU IP addresses and ASDU IOA addresses.",
          commandLine: "C:\\Temp\\108_urv.exe 192.168.122.10 2404 1 0 0 1",
          toolOrMalware: "Industroyer2 / CrashOverride.v2",
          attackerIntent: "Execute automated IEC-104 protocol commands to change electrical breaker positions without operator awareness.",
          mechanics: [
            "Contains hardcoded configuration parameters for 8 distinct electrical substations",
            "Supports IEC 60870-5-104 protocol over TCP port 2404",
            "Executes automated looping commands to toggle IOA breaker switches to OFF/TRIP",
          ],
        },
        blueDetails: {
          summary: "Detect execution of unverified binaries connecting to TCP port 2404 or creating suspicious child processes in temporary directories.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 1,
              description: "Process creation: Industroyer2 executable launched from C:\\Temp",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>1</EventID>
    <TimeCreated SystemTime="2022-04-08T17:15:00.0021900Z" />
    <Computer>OT-JUMP-01.scada.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Temp\\108_urv.exe</Data>
    <Data Name="CommandLine">108_urv.exe 192.168.122.10 2404 1 0 0 1</Data>
    <Data Name="CurrentDirectory">C:\\Temp\\</Data>
    <Data Name="User">SCADA\\ot-operator</Data>
    <Data Name="Hashes">SHA256=d69665f56d40f111082c1607645f549d8070000d54367aec0c59279c0fa345a3</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "YARA",
              title: "APT_Sandworm_Industroyer2_IEC104",
              severity: "critical",
              mitreRef: "T1059.003",
              ruleContent: `rule APT_Sandworm_Industroyer2_IEC104 {
    meta:
        description = "Detects Industroyer2 IEC-104 ICS malware payload"
        author = "CERT-UA / ESET Research"
        date = "2022-04-12"
    strings:
        $iec1 = "APCI: STARTDT act" ascii
        $iec2 = "ASDU: 45 (Single Command)" ascii
        $fmt = "%s %s %d %d %d %d" ascii
    condition:
        uint16(0) == 0x5a4d and 2 of ($iec*) and $fmt
}`,
            },
          ],
          detectionPitfalls: [
            "Malware was stripped of debugging symbols and configured to run quietly in background without UI popups.",
          ],
        },
      },
    },
    {
      id: "sandworm-node-wiper",
      type: "custom",
      position: { x: 860, y: 400 },
      data: {
        id: "sandworm-node-wiper",
        label: "CaddyWiper Payload",
        subLabel: "Raw Disk Sector Destructor",
        entityType: "file",
        techniqueId: "T1561.002",
        techniqueName: "Disk Structure Wipe",
        stage: "persistence_evasion",
        redDetails: {
          summary: "CaddyWiper was deployed to wipe physical drives, destroying Master Boot Records (MBR) and GUID Partition Tables (GPT) right after the electrical breaker trip command.",
          commandLine: "C:\\Windows\\Temp\\caddy.exe /s",
          toolOrMalware: "CaddyWiper (HermeticWiper Family)",
          attackerIntent: "Render engineering workstations and SCADA operator HMIs permanently unbootable.",
          mechanics: [
            "Checks if running machine is an Active Directory Domain Controller; if so, halts to preserve pivot",
            "Opens \\\\.\\PhysicalDrive0 via CreateFileW with GENERIC_WRITE permissions",
            "Calls DeviceIoControl with FSCTL_LOCK_VOLUME and overwrites all sector bytes with 0x00",
          ],
        },
        blueDetails: {
          summary: "Detect direct physical drive handle opens (\\\\.\\PhysicalDriveX) by non-system disk utilities.",
          telemetry: [
            {
              source: "Sysmon",
              eventId: 1,
              description: "Process creation: CaddyWiper binary invocation",
              format: "xml",
              rawSample: `<Event xmlns="http://schemas.microsoft.com/win/2004/08/events/event">
  <System>
    <Provider Name="Microsoft-Windows-Sysmon" Guid="{5770385F-C22A-43E0-BF4C-06F5698FFBD9}" />
    <EventID>1</EventID>
    <TimeCreated SystemTime="2022-04-08T17:18:22.9102400Z" />
    <Computer>HMI-SUBSTATION-04.scada.local</Computer>
  </System>
  <EventData>
    <Data Name="Image">C:\\Windows\\Temp\\caddy.exe</Data>
    <Data Name="CommandLine">caddy.exe</Data>
    <Data Name="User">NT AUTHORITY\\SYSTEM</Data>
    <Data Name="Hashes">SHA256=a294620543bc34d96083cb8105d7f9b3d5b2f221c62d0d7a2c813be5e804fa3a</Data>
  </EventData>
</Event>`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Direct Physical Drive Access by Suspicious Process",
              severity: "critical",
              mitreRef: "T1561.002",
              ruleContent: `title: Suspicious Direct Raw Disk Handle Write
id: d7192a01-4439-4ab1-8e01-19b02a718c01
status: production
logsource:
  category: process_creation
detection:
  selection:
    Image|contains:
      - '\\Temp\\'
      - '\\AppData\\'
    CommandLine|contains:
      - 'PhysicalDrive'
  condition: selection
level: critical`,
            },
          ],
          detectionPitfalls: [
            "CaddyWiper is tiny (under 10KB), contains no external library imports, and dynamically locates Win32 APIs.",
          ],
        },
      },
    },

    // STAGE 3
    {
      id: "sandworm-node-iec104",
      type: "custom",
      position: { x: 1280, y: 120 },
      data: {
        id: "sandworm-node-iec104",
        label: "IEC 60870-5-104 Attack",
        subLabel: "TCP 2404 / ASDU Type 45 Commands",
        entityType: "network",
        techniqueId: "T0855",
        techniqueName: "Unauthorized Command Message (ICS MITRE)",
        stage: "lateral_movement",
        redDetails: {
          summary: "Industroyer2 initiates connection to Remote Terminal Units (RTUs) across multiple substations, transmitting Type 45 Single Command APDUs to force breaker contacts open.",
          commandLine: "TCP Stream: 10.100.4.50:51280 -> 192.168.122.10:2404 [IEC-104 ASDU 45 (Single Command) SCO=OFF]",
          attackerIntent: "De-energize transmission substations and interrupt power delivery to the regional electric grid.",
          mechanics: [
            "Sends IEC-104 APCI frame STARTDT (Start Data Transfer)",
            "Issues Interrogation Command (ASDU Type 100) to map telemetry state",
            "Transmits unauthorized ASDU Type 45 with Select-and-Execute sequence to trip breakers",
          ],
        },
        blueDetails: {
          summary: "Inspect OT network traffic with Zeek or Suricata for anomalous burst of IEC-104 control commands originating from non-SCADA master IPs.",
          telemetry: [
            {
              source: "Zeek",
              eventId: "iec104.log",
              description: "Zeek ICS protocol analysis showing unauthorized single command execution",
              format: "json",
              rawSample: `{
  "ts": 1649438100.124,
  "uid": "Cot8192aKlx901",
  "id.orig_h": "10.100.4.50",
  "id.orig_p": 51280,
  "id.resp_h": "192.168.122.10",
  "id.resp_p": 2404,
  "apci_type": "I-format",
  "asdu_type": 45,
  "asdu_type_str": "C_SC_NA_1 (Single Command)",
  "cot": 6,
  "cot_str": "ACTIVATION",
  "ioa": 1001,
  "command_state": "OPEN/TRIP"
}`,
            },
          ],
          rules: [
            {
              format: "Suricata",
              title: "SCADA IEC 60870-5-104 Unauthorized Breaker Trip Command",
              severity: "critical",
              mitreRef: "T0855",
              ruleContent: `alert tcp any any -> $OT_RTU_NET 2404 (msg:"SCADA IEC-104 Unauthorized Single Command ASDU 45 Trip"; content:"|68|"; depth:1; byte_test:1,=,45,6; flow:established,to_server; reference:url,cert.gov.ua/article/39518; classtype:policy-violation; sid:3000912; rev:1;)`,
            },
          ],
          detectionPitfalls: [
            "IEC 60870-5-104 has no built-in cryptographic authentication; commands from any reachable IP are accepted by legacy RTUs.",
          ],
        },
      },
    },

    // STAGE 4
    {
      id: "sandworm-node-blackout",
      type: "custom",
      position: { x: 1700, y: 120 },
      data: {
        id: "sandworm-node-blackout",
        label: "Substation De-energization",
        subLabel: "Physical Power Grid Disruption",
        entityType: "host",
        techniqueId: "T0813",
        techniqueName: "Denial of Control (ICS MITRE)",
        stage: "exfiltration",
        redDetails: {
          summary: "Physical substation circuit breakers disconnect transmission lines, causing immediate loss of power to connected distribution networks.",
          commandLine: "Electrical Breaker State Change: CLOSED -> OPEN (TRIPPED)",
          attackerIntent: "Cause catastrophic regional blackout and destabilize national electrical grid frequency.",
          mechanics: [
            "Simultaneous tripping of 330kV and 110kV high-voltage circuit breakers",
            "Attempts to overload adjacent transmission pathways through rapid cascade",
          ],
        },
        blueDetails: {
          summary: "SCADA alarm state monitoring and immediate telemetry correlation with cyber detection alerts.",
          telemetry: [
            {
              source: "EDR",
              eventId: "SCADA_ALARM",
              description: "SCADA Master System critical alarm: unexpected breaker disconnect",
              format: "json",
              rawSample: `{
  "timestamp": "2022-04-08T17:20:00Z",
  "substation": "SUB-NORTH-330",
  "event_type": "CIRCUIT_BREAKER_TRIP",
  "feeder": "BAY_04_330KV",
  "cause": "REMOTE_COMMAND",
  "operator_session": "NONE"
}`,
            },
          ],
          rules: [
            {
              format: "Splunk SPL",
              title: "SCADA Uncommanded Breaker Trip Event",
              severity: "critical",
              mitreRef: "T0813",
              ruleContent: `index=scada_events event_type="CIRCUIT_BREAKER_TRIP" cause="REMOTE_COMMAND" operator_session="NONE"
| eval delta_time=now()-_time
| where delta_time < 300
| alert critical`,
            },
          ],
          detectionPitfalls: [
            "Physical sensor alarms may be mistaken for weather anomalies or equipment failure without correlated network logs.",
          ],
        },
      },
    },
  ],
  edges: [
    {
      id: "sw-edge-1-2",
      source: "sandworm-node-vpn",
      target: "sandworm-node-jumphost",
      animated: true,
      data: {
        relation: "RDP Lateral Pivot",
        label: "Pivots via RDP",
        stage: "initial_access",
        protocol: "RDP (TCP 3389)",
        isCausal: true,
      },
    },
    {
      id: "sw-edge-2-3",
      source: "sandworm-node-jumphost",
      target: "sandworm-node-loader",
      animated: true,
      data: {
        relation: "Binary Deployment",
        label: "Executes 108_urv.exe",
        stage: "persistence_evasion",
        isCausal: true,
      },
    },
    {
      id: "sw-edge-2-4",
      source: "sandworm-node-jumphost",
      target: "sandworm-node-wiper",
      animated: true,
      data: {
        relation: "Wiper Delivery",
        label: "Deploys CaddyWiper",
        stage: "persistence_evasion",
        isCausal: true,
      },
    },
    {
      id: "sw-edge-3-5",
      source: "sandworm-node-loader",
      target: "sandworm-node-iec104",
      animated: true,
      data: {
        relation: "Protocol Transmission",
        label: "Sends IEC-104 ASDU 45",
        stage: "lateral_movement",
        protocol: "IEC-104 (TCP 2404)",
        isCausal: true,
      },
    },
    {
      id: "sw-edge-5-6",
      source: "sandworm-node-iec104",
      target: "sandworm-node-blackout",
      animated: true,
      data: {
        relation: "Physical Impact",
        label: "Trips Breakers -> Blackout",
        stage: "exfiltration",
        isCausal: true,
      },
    },
  ],
};
