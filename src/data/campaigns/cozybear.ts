import { Campaign, StageDefinition } from "@/types/campaign";

export const COZYBEAR_STAGES: StageDefinition[] = [
  {
    id: "initial_access",
    title: "Stage 1: Legacy Non-MFA Test Tenant Password Spray",
    shortTitle: "1. Cloud Password Spray",
    description:
      "Midnight Blizzard operators launch low-and-slow password spraying against non-production legacy test tenants lacking Multi-Factor Authentication (MFA), compromising a dormant OAuth application registration.",
    keyObjectives: [
      "Distribute password spray across residential proxy networks",
      "Compromise legacy non-MFA test user account",
      "Pivot to dormant OAuth Enterprise Application with tenant-wide administrative permissions",
    ],
    order: 1,
  },
  {
    id: "persistence_evasion",
    title: "Stage 2: OAuth App Consent Abuse & Graph API Permission Minting",
    shortTitle: "2. Cloud Persistence & Consent",
    description:
      "Threat actors grant the malicious OAuth app elevated Microsoft Graph API roles (full_access_as_app and Mail.ReadWrite) and create new secret credentials to maintain persistent backdoor access without user interaction.",
    keyObjectives: [
      "Create high-privilege app role assignment via Microsoft Graph API",
      "Generate synthetic application certificate credentials (Client Credentials flow)",
      "Establish persistent cloud service principal foothold independent of original user credentials",
    ],
    order: 2,
  },
  {
    id: "lateral_movement",
    title: "Stage 3: Cloud Pivot to Production M365 Mailboxes",
    shortTitle: "3. Exchange Web Services Pivot",
    description:
      "Using the newly minted Graph API application permissions, operators access executive and cybersecurity leadership Exchange Online mailboxes across production tenants.",
    keyObjectives: [
      "Obtain OAuth 2.0 access tokens via Client Credentials grant",
      "Query Microsoft Graph API /users/{id}/messages and Exchange Web Services (EWS)",
      "Enumerate leadership communications regarding threat intelligence and active incident responses",
    ],
    order: 3,
  },
  {
    id: "exfiltration",
    title: "Stage 4: Automated Cloud Mailbox Exfiltration via Residential Proxies",
    shortTitle: "4. Graph API Exfiltration",
    description:
      "Operators execute automated batch downloading of targeted email threads and confidential attachments, routing all API traffic through residential proxy networks to evade IP reputation defenses.",
    keyObjectives: [
      "Download MIME-format emails and confidential PDF/DOCX attachments",
      "Route all Microsoft Graph API queries through rotating residential proxy IPs",
      "Exfiltrate sensitive cybersecurity strategy documents and source code snippets",
    ],
    order: 4,
  },
];

export const COZYBEAR_CAMPAIGN: Campaign = {
  id: "cozybear",
  title: "APT29 / Midnight Blizzard Cloud Identity & OAuth Breach",
  actor: "Midnight Blizzard / APT29 / Cozy Bear (SVR)",
  actorAliases: ["Cozy Bear", "Nobelium", "Cloaked Ursa", "UAC-0029"],
  year: "2024",
  targetSector: "Major Tech Companies, Government Ministries, Defense Contractors",
  attackVector: "Password Spray on Legacy Test Tenant -> OAuth App Privilege Escalation",
  impact: "Compromise of senior executive and cybersecurity leadership corporate email accounts at Microsoft and other tech entities.",
  summary:
    "A sophisticated cloud-native espionage campaign that exploited a legacy non-MFA test tenant to grant OAuth app permissions, weaponizing the Microsoft Graph API to stealthily exfiltrate executive mailboxes via rotating residential proxies.",
  stages: COZYBEAR_STAGES,
  nodes: [
    // STAGE 1
    {
      id: "cb-node-spray",
      type: "custom",
      position: { x: 50, y: 120 },
      data: {
        id: "cb-node-spray",
        label: "Password Spraying",
        subLabel: "Residential Proxy Infrastructure",
        entityType: "network",
        techniqueId: "T1110.003",
        techniqueName: "Brute Force: Password Spraying",
        stage: "initial_access",
        redDetails: {
          summary: "Conducted low-frequency distributed password spraying against tenant user accounts using residential IP pools to stay under account lockout thresholds.",
          commandLine: "OAuth Token Endpoint: POST https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token [Grant: password]",
          attackerIntent: "Gain initial foothold in cloud tenant without alerting identity risk algorithms.",
          mechanics: [
            "Targets legacy accounts not enforced by Conditional Access MFA policies",
            "Attempts 1 password guess per account every few hours across hundreds of unique residential IPs",
            "Validates single successful authentication to legacy test tenant",
          ],
        },
        blueDetails: {
          summary: "Monitor Microsoft Entra ID Sign-In logs for distributed failed logon patterns converging on shared user targets.",
          telemetry: [
            {
              source: "EDR",
              eventId: "EntraSignIn",
              description: "Microsoft Entra ID Interactive Sign-in Event from anomalous IP",
              format: "json",
              rawSample: `{
  "time": "2024-01-12T04:18:22Z",
  "category": "SignInLogs",
  "identity": "legacy-test-admin@victim-corp.onmicrosoft.com",
  "appDisplayName": "Office 365 Exchange Online",
  "ipAddress": "185.191.171.42",
  "location": { "city": "Warsaw", "country": "PL" },
  "status": { "errorCode": 0, "additionalDetails": "MFA requirement not satisfied but bypassed by legacy policy" },
  "riskDetail": "none"
}`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Distributed Password Spraying Against Entra ID",
              severity: "high",
              mitreRef: "T1110.003",
              ruleContent: `title: Entra ID Password Spraying Detection
id: f48b1029-71ba-48d1-810b-19ba518e90a2
status: production
logsource:
  service: entra_signin
detection:
  selection:
    status.errorCode:
      - 50126 # Invalid credentials
      - 50053 # Account locked
  timeframe: 1h
  condition: selection | count(identity) > 20 by ipAddress
level: high`,
            },
          ],
          detectionPitfalls: [
            "Rotating residential proxies ensure no single IP address exceeds standard rate limits.",
          ],
        },
      },
    },
    {
      id: "cb-node-app-consent",
      type: "custom",
      position: { x: 440, y: 120 },
      data: {
        id: "cb-node-app-consent",
        label: "OAuth App Registration",
        subLabel: "Enterprise App Secret Creation",
        entityType: "user",
        techniqueId: "T1098.005",
        techniqueName: "Account Manipulation: Device/App Registration",
        stage: "initial_access",
        redDetails: {
          summary: "Operators created a new application secret and certificate credential for a dormant legacy OAuth test application, cementing persistence.",
          commandLine: "Graph API: POST /v1.0/applications/{id}/addPassword -> KeyId: c4b912-...",
          attackerIntent: "Decouple persistence from user credentials by creating independent service principal API keys.",
          mechanics: [
            "Leverages compromised test account's Application Administrator role",
            "Generates new client secret with 2-year validity",
            "Enables non-interactive Client Credentials authentication",
          ],
        },
        blueDetails: {
          summary: "Audit Entra ID AuditLogs for Add service principal credentials and Add owner to application operations.",
          telemetry: [
            {
              source: "Windows Security",
              eventId: "EntraAudit",
              description: "Entra ID Audit Log: Add service principal credentials",
              format: "json",
              rawSample: `{
  "activityDateTime": "2024-01-12T05:02:11Z",
  "activityDisplayName": "Add service principal credentials",
  "category": "ApplicationManagement",
  "initiatedBy": {
    "user": { "userPrincipalName": "legacy-test-admin@victim-corp.onmicrosoft.com" }
  },
  "targetResources": [
    {
      "displayName": "Legacy-Sync-ServiceApp",
      "type": "ServicePrincipal",
      "modifiedProperties": [
        { "displayName": "KeyDescription", "newValue": "Cert-2024-Auth" }
      ]
    }
  ]
}`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "New Credential Added to Existing OAuth Application",
              severity: "critical",
              mitreRef: "T1098.005",
              ruleContent: `title: New Credential Added to High-Privilege Service Principal
id: 9a7102b4-5182-4f11-92b1-419b48f1028a
status: production
logsource:
  service: entra_audit
detection:
  selection:
    activityDisplayName:
      - 'Add service principal credentials'
      - 'Update application – Certificates and secrets management'
  condition: selection
level: critical`,
            },
          ],
          detectionPitfalls: [
            "Developers frequently rotate app secrets in legitimate test tenants, producing high alert noise.",
          ],
        },
      },
    },

    // STAGE 2
    {
      id: "cb-node-graph-priv",
      type: "custom",
      position: { x: 860, y: 120 },
      data: {
        id: "cb-node-graph-priv",
        label: "Graph Role Assignment",
        subLabel: "full_access_as_app / Mail.Read",
        entityType: "registry",
        techniqueId: "T1078.004",
        techniqueName: "Valid Accounts: Cloud Accounts",
        stage: "persistence_evasion",
        redDetails: {
          summary: "Threat actors assigned the highly privileged Microsoft Graph API permission full_access_as_app (Exchange Web Services) to the service principal.",
          commandLine: "Graph API: POST /v1.0/servicePrincipals/{id}/appRoleAssignedTo [AppRoleId: 810e4a74-46e9-4089-9d96-5f42c85dd22e]",
          attackerIntent: "Grant the application read/write access to every mailbox across the entire enterprise organization.",
          mechanics: [
            "Assigns Office 365 Exchange Online full_access_as_app permission",
            "Bypasses per-user mailbox permission checks",
            "Does not require interactive user logon or session cookies",
          ],
        },
        blueDetails: {
          summary: "Alert on any app role assignment granting Mail.ReadWrite or full_access_as_app to application service principals.",
          telemetry: [
            {
              source: "EDR",
              eventId: "AppRoleGrant",
              description: "Entra ID Audit: AppRoleAssignmentGranted to Service Principal",
              format: "json",
              rawSample: `{
  "activityDateTime": "2024-01-12T05:30:44Z",
  "activityDisplayName": "Add app role assignment to service principal",
  "category": "ApplicationManagement",
  "result": "success",
  "targetResources": [
    {
      "displayName": "Office 365 Exchange Online",
      "modifiedProperties": [
        { "displayName": "AppRole.Value", "newValue": "full_access_as_app" }
      ]
    }
  ]
}`,
            },
          ],
          rules: [
            {
              format: "Splunk SPL",
              title: "High-Privilege App Role Granted to Service Principal",
              severity: "critical",
              mitreRef: "T1078.004",
              ruleContent: `index=azure_audit activityDisplayName="Add app role assignment to service principal"
| search "modifiedProperties{}.newValue"="full_access_as_app" OR "modifiedProperties{}.newValue"="Mail.ReadWrite"
| stats count by initiatedBy.user.userPrincipalName, targetResources{}.displayName, _time`,
            },
          ],
          detectionPitfalls: [
            "Once granted, API calls execute via application token without triggering individual mailbox logon security events.",
          ],
        },
      },
    },

    // STAGE 3
    {
      id: "cb-node-ews-harvest",
      type: "custom",
      position: { x: 1280, y: 120 },
      data: {
        id: "cb-node-ews-harvest",
        label: "Graph API Mailbox Query",
        subLabel: "GET /users/{id}/mailFolders",
        entityType: "process",
        techniqueId: "T1114.002",
        techniqueName: "Email Collection: Remote Email Collection",
        stage: "lateral_movement",
        redDetails: {
          summary: "Using the application token, Midnight Blizzard targeted specific executive and cybersecurity team mailboxes, searching for terms like 'APT29', 'Nobelium', 'Incident', and 'SourceCode'.",
          commandLine: "GET https://graph.microsoft.com/v1.0/users/ciso@victim-corp.com/messages?$search=\"APT29\"&$top=50",
          attackerIntent: "Harvest insight into how the victim organization is responding to the intrusion in real time.",
          mechanics: [
            "Queries Microsoft Graph API REST endpoints",
            "Filters messages by keyword, date ranges, and attachment presence",
            "Identifies high-value security incident response communications",
          ],
        },
        blueDetails: {
          summary: "Monitor Exchange Online MailItemsAccessed operations in Unified Audit Log (UAL) triggered by AppId tokens.",
          telemetry: [
            {
              source: "Windows Security",
              eventId: "MailItemsAccessed",
              description: "Unified Audit Log: MailItemsAccessed by Service Principal",
              format: "json",
              rawSample: `{
  "CreationTime": "2024-01-12T06:14:02",
  "Operation": "MailItemsAccessed",
  "Workload": "Exchange",
  "UserId": "Legacy-Sync-ServiceApp_AppId@victim-corp.onmicrosoft.com",
  "AppId": "8f31024b-1184-482a-99bb-419b184a2099",
  "ClientInfoString": "Client=REST;Client=Microsoft Graph",
  "MailAccessType": "Bind",
  "Folder": { "Path": "\\Inbox" },
  "ItemCount": 42
}`,
            },
          ],
          rules: [
            {
              format: "Sigma",
              title: "Bulk MailItemsAccessed by Service Principal Token",
              severity: "high",
              mitreRef: "T1114.002",
              ruleContent: `title: Abnormal Mail Access via Graph API Application Token
id: 5a819b02-410a-48f1-80a1-719b48a01499
status: production
logsource:
  service: m365_ual
detection:
  selection:
    Operation: 'MailItemsAccessed'
    ClientInfoString|contains: 'Microsoft Graph'
    MailAccessType: 'Bind'
  timeframe: 10m
  condition: selection | count(ItemCount) > 100 by AppId
level: high`,
            },
          ],
          detectionPitfalls: [
            "MailItemsAccessed throttling produces aggregated events that conceal single read queries.",
          ],
        },
      },
    },

    // STAGE 4
    {
      id: "cb-node-exfil",
      type: "custom",
      position: { x: 1700, y: 120 },
      data: {
        id: "cb-node-exfil",
        label: "Residential Proxy Exfil",
        subLabel: "Graph REST Payload Exfiltration",
        entityType: "network",
        techniqueId: "T1567.002",
        techniqueName: "Exfiltration Over Web Service: Cloud Storage",
        stage: "exfiltration",
        redDetails: {
          summary: "Automated extraction of selected email threads and raw attachments over TLS, proxying all egress through thousands of residential consumer IPs.",
          commandLine: "GET /v1.0/users/{id}/messages/{message_id}/$value -> Pipe to Encrypted Archive",
          attackerIntent: "Exfiltrate strategic cybersecurity planning documents and credentials without leaving anomalous geographic IOC footprints.",
          mechanics: [
            "Fetches raw MIME messages and file attachments via Graph API stream endpoints",
            "Distributes download requests across global residential proxy nodes",
            "Encrypts captured data with ephemeral public keys before egress to C2",
          ],
        },
        blueDetails: {
          summary: "Correlate Graph API token usage with network IP variety and egress bandwidth spikes in cloud tenant analytics.",
          telemetry: [
            {
              source: "EDR",
              eventId: "GraphActivityLog",
              description: "Microsoft Graph Activity Log: High-volume message download",
              format: "json",
              rawSample: `{
  "timestamp": "2024-01-12T07:22:15Z",
  "appId": "8f31024b-1184-482a-99bb-419b184a2099",
  "requestUri": "/v1.0/users/ciso@victim-corp.com/messages/AAMkAGEx...",
  "httpMethod": "GET",
  "responseSizeBytes": 1459200,
  "clientIp": "94.23.112.8"
}`,
            },
          ],
          rules: [
            {
              format: "Splunk SPL",
              title: "High-Volume Graph API Attachment Downloads",
              severity: "critical",
              mitreRef: "T1567.002",
              ruleContent: `index=ms_graph_logs httpMethod="GET" requestUri="*/messages/*/$value"
| stats sum(responseSizeBytes) as total_bytes, values(clientIp) as unique_ips by appId
| where total_bytes > 50000000 AND mvcount(unique_ips) > 5`,
            },
          ],
          detectionPitfalls: [
            "Residential IP rotation obscures the attacker's true C2 servers, making IP-based blocklists ineffective.",
          ],
        },
      },
    },
  ],
  edges: [
    {
      id: "cb-edge-1-2",
      source: "cb-node-spray",
      target: "cb-node-app-consent",
      animated: true,
      data: {
        relation: "Account Takeover",
        label: "Compromises Test Account",
        stage: "initial_access",
        isCausal: true,
      },
    },
    {
      id: "cb-edge-2-3",
      source: "cb-node-app-consent",
      target: "cb-node-graph-priv",
      animated: true,
      data: {
        relation: "Privilege Escalation",
        label: "Grants full_access_as_app",
        stage: "persistence_evasion",
        isCausal: true,
      },
    },
    {
      id: "cb-edge-3-4",
      source: "cb-node-graph-priv",
      target: "cb-node-ews-harvest",
      animated: true,
      data: {
        relation: "Graph API Pivot",
        label: "Accesses Production Mailboxes",
        stage: "lateral_movement",
        protocol: "Graph REST / HTTPS",
        isCausal: true,
      },
    },
    {
      id: "cb-edge-4-5",
      source: "cb-node-ews-harvest",
      target: "cb-node-exfil",
      animated: true,
      data: {
        relation: "Data Extraction",
        label: "Exfiltrates via Residential IPs",
        stage: "exfiltration",
        protocol: "HTTPS / REST",
        isCausal: true,
      },
    },
  ],
};
