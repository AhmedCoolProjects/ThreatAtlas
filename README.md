# 🛡️ Threat Atlas (APT Atlas)

> **Interactive Advanced Persistent Threat (APT) Attack & Detection Lifecycle Atlas**  
> An open-source, interactive cybersecurity visual lab inspired by the pedagogical design of Seeds Atlas, purpose-built for security researchers, SOC analysts, detection engineers, and students.

---

## ⚡ Overview

Instead of plant anatomy, **Threat Atlas** allows you to interactively explore the **causal provenance stages** of major APT campaigns, understand **adversary tradecraft**, and inspect real-world **telemetry artifacts (Sysmon XML, Windows Security Events, Zeek, EDR)** alongside **production-grade Sigma & YARA detection engineering rules**.

---

## 🚀 Key Features

1. **Interactive Causal Provenance Canvas (`@xyflow/react` / React Flow):**
   - Direct execution flows linking processes, memory injections, file drops, registry alterations, network sockets, and cloud APIs.
   - Smooth animations, directional causal edge labels, responsive pan/zoom, auto-focusing stage camera, and minimap.
   - Entity type color coding (`PROC`, `FILE`, `REG`, `NET`, `USER`, `HOST`).

2. **Dual Perspective Mode (Red vs. Blue):**
   - **Attack Mechanics (Red View):** Living-off-the-land techniques (LOLBINs), process hollowing, token impersonation, C2 payloads, and attacker intent.
   - **Detection Anatomy (Blue View):** Blue team telemetry footprint (Sysmon Event IDs, Windows Event Logs 4624/4688, Zeek logs), detection blind spots, and detection pitfalls.

3. **Stage Scrubber / State Progression:**
   - 4-Stage interactive timeline stepper:
     - `Stage 1: Initial Compromise & Infiltration`
     - `Stage 2: Defense Evasion & Persistence`
     - `Stage 3: Credential Access & Lateral Movement`
     - `Stage 4: C2 Communication & Exfiltration`
   - Active stage spotlighting with animated pulse rings; auto-play tour mode (`Space`).

4. **Dynamic Inspector Sidebar:**
   - **Anatomy & Mechanics:** MITRE ATT&CK ID link badges, command-line execution syntax, parent-child process chains, and step-by-step technical mechanics.
   - **Telemetry & Evidence:** Authentic raw log snippets (Sysmon Event IDs 1, 3, 7, 10, 11, 13, 22; Windows Security 4662, 4624; Zeek SSL/IEC-104; Entra ID Audit) with syntax highlighting.
   - **Detection Rules:** Production-grade Sigma rules, YARA patterns, Splunk SPL queries, and Suricata signatures with one-click copy.

5. **Campaign Library (Preloaded Datasets):**
   - 🌟 **UNC2452 / SolarWinds SUNBURST Supply Chain** (Nobelium / SVR)
   - ⚡ **Sandworm / Industroyer2 OT Grid Sabotage** (GRU Unit 74455)
   - ☁️ **APT29 / Midnight Blizzard Cloud Identity & OAuth Breach** (SVR)

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `←` / `→` | Step between attack lifecycle stages |
| `Space` | Play / pause automatic lifecycle tour |
| `R` | Switch to Red Team (Attack Mechanics) perspective |
| `B` | Switch to Blue Team (Detection Anatomy) perspective |
| `I` | Toggle right-hand Inspector Sidebar |
| `Esc` | Deselect active node or close open modal |
| `?` | Open interactive guide and keyboard shortcuts |

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 15 (App Router)](https://nextjs.org/) + TypeScript (100% strict type safety)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Interactive Graph Canvas:** [`@xyflow/react`](https://reactflow.dev/) (React Flow v12)
- **State Management:** [`zustand`](https://github.com/pmndrs/zustand)
- **Aesthetic:** High-contrast cybersecurity dark theme (`#050811` background, emerald/cyan Blue accents, rose/amber Red accents)

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to start exploring.

### 3. Build for Production
```bash
npm run build
npm start
```
