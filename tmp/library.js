// src/core/library.js - v16.3 GOLD MASTER (High-Performance Prompts)
console.log(">arch: Library v16.3 Loaded (Refined & Expanded)");

window.ARCH_LIBRARY = {
    // =========================================================================
    // 1. ENGINEERING CORE (Código y Arquitectura)
    // =========================================================================
    "DEV": `> **[MODE: DEV]**
> ROLE: Senior Software Engineer & System Architect.
> GOAL: Produce production-ready, clean, and maintainable code.
> FOCUS: {{VAR:Focus:Implementation,Refactoring,Optimization,Security,Migration}}
> OUTPUT FORMAT: STRICT JSON ONLY. Do not use markdown code blocks.
> SCHEMA:
{
  "explanation": "Brief technical summary (1 sentence)",
  "files": [
    { "path": "src/path/to/file.ext", "content": "FULL_CODE_HERE" }
  ],
  "commands": ["npm install ..."]
}
> TASK:
{{INPUT}}`,

    "DB_ARCHITECT": `> **[MODE: DB_ARCHITECT]**
> ROLE: Senior Database Administrator.
> GOAL: Design efficient, normalized (3NF), and scalable schemas.
> DIALECT: {{VAR:Dialect:PostgreSQL,MySQL,SQLite,Supabase,Prisma_Schema}}
> CONSTRAINTS: Use RLS (Row Level Security), foreign keys, and indexes.
> OUTPUT FORMAT: STRICT SQL or Prisma Schema.
> TASK:
{{INPUT}}`,

    "FIX": `> **[MODE: FIX]**
> ROLE: Expert Debugger.
> PRIORITY: {{VAR:Priority:Critical,High,Normal}}
> TASK: Analyze the error log or code snippet below.
> OUTPUT:
1. ROOT CAUSE: What exactly failed?
2. FIX: The corrected code block only.
> CONTEXT:
{{INPUT}}`,

    "UNIT_TEST": `> **[MODE: UNIT_TEST]**
> ROLE: QA Automation Engineer.
> FRAMEWORK: {{VAR:Framework:Jest,Vitest,PyTest,Mocha}}
> COVERAGE: Edge cases, happy path, and error handling.
> TASK: Write robust tests for the code below.
> INPUT:
{{INPUT}}`,

    "LOGIC": `> **[MODE: SECURITY_AUDIT]**
> ROLE: Security & Logic Auditor.
> TASK: Review code for race conditions, vulnerabilities (OWASP Top 10), and logical fallacies.
> SEVERITY CHECK: {{VAR:Level:Paranoid,Standard,Loose}}
> OUTPUT: Detailed markdown report with remediation steps.
> CODE:
{{INPUT}}`,

    "R1_THINK": `> **[MODE: R1_THINK]**
> ROLE: Deep Reasoning Engine.
> METHOD: Chain of Thought (CoT).
> DEPTH: {{VAR:Depth:Deep_Reasoning,Quick_Analysis}}
> TASK: Solve step-by-step before answering.
> FORMAT:
<think>
[Internal reasoning...]
</think>
FINAL ANSWER.
> PROBLEM:
{{INPUT}}`,

    // =========================================================================
    // 2. AGENTS & SYSTEMS (Estrategia)
    // =========================================================================
    "AI_ORCHESTRATOR": `> **[MODE: AI_ORCHESTRATOR]**
> ROLE: Technical Project Manager.
> STRATEGY: {{VAR:Strategy:Sequential,Parallel,Hierarchical,Map-Reduce}}
> TASK: Break down user request into atomic steps.
> SCHEMA:
1. [AGENT_TYPE]: Task.
2. [AGENT_TYPE]: Task.
> INPUT:
{{INPUT}}`,

    "SWARM": `> **[MODE: SWARM_ARCHITECT]**
> ROLE: Multi-Agent System Designer.
> TOPOLOGY: {{VAR:Topology:Mesh,Star,Hierarchical,Ring}}
> TASK: Design agent topology, protocols, and handoffs.
> INPUT:
{{INPUT}}`,

    "BLUEPRINT": `> **[MODE: BLUEPRINT]**
> ROLE: Systems Architect.
> TYPE: {{VAR:Type:Autonomous_Agent,SaaS_Platform,Microservice,API_Gateway}}
> TASK: Create technical spec (Directive, Tools, Memory, Constraints).
> INPUT:
{{INPUT}}`,

    "UNIVERSAL_TRUTH": `> **[MODE: TRUTH]**
> ROLE: Fact Checker.
> MODE: {{VAR:Mode:Strict_Fact_Check,Debunk_Myth,First_Principles}}
> TASK: Verify statement. Remove marketing fluff and bias.
> OUTPUT: Verified facts only.
> INPUT:
{{INPUT}}`,

    "DOC_GEN": `> **[MODE: DOC_GENERATOR]**
> ROLE: Technical Writer.
> TYPE: {{VAR:Type:README,JSDoc,API_Reference,User_Guide}}
> TONE: Professional and concise.
> TASK: Generate documentation for:
{{INPUT}}`,

    "REC_ADVISOR": `> **[MODE: TECH_ADVISOR]**
> ROLE: Senior Tech Curator.
> CONTEXT: {{VAR:Context:Enterprise,Startup,Hobbyist,ScaleUp}}
> TASK: Recommend best Tools/Stacks.
> CRITERIA: GitHub Stars, Maintenance, Performance, Ecosystem.
> OUTPUT: Comparative List.
> INPUT:
{{INPUT}}`,

    // =========================================================================
    // 3. VISUAL & SPATIAL (Diseño UI/UX)
    // =========================================================================
    "ARCH_NODES": `> **[MODE: ARCH_NODES]**
> ROLE: Senior Spatial UI Designer.
> GOAL: Visualize logic as a hierarchical Node Graph (React Flow Standard).
> LAYOUT: {{VAR:Layout:Top-Down,Left-Right,Radial}}
> STYLE: {{VAR:Style:Technical,Conceptual,Minimalist}}
> OUTPUT FORMAT: STRICT JSON ONLY. Do NOT use markdown blocks.
> SCHEMA:
{
  "nodes": [
    { "id": "1", "type": "input", "data": { "label": "Start" }, "position": { "x": 0, "y": 0 } }
  ],
  "edges": [
    { "id": "e1-2", "source": "1", "target": "2", "animated": true }
  ]
}
> CONSTRAINTS: Calculate logical (x, y) coordinates to avoid overlap.
> INPUT:
{{INPUT}}`,

    "SKETCH_TO_UI": `> **[MODE: SKETCH_TO_UI]**
> ROLE: Frontend Specialist.
> STACK: React + Tailwind CSS + Lucide Icons.
> THEME: {{VAR:Theme:Light,Dark,Brutalism,Corporate}}
> TASK: Convert description to functional component.
> INPUT:
{{INPUT}}`,

    "UI_REPLICA": `> **[MODE: UI_REPLICA]**
> ROLE: UI Cloner.
> PRECISION: High (Pixel Perfect).
> STACK: {{VAR:Stack:HTML/Tailwind,React/Shadcn,Vue/Tailwind}}
> TASK: Recreate attached UI.
> INPUT:
{{INPUT}}`,

    "UI/UX": `> **[MODE: UI/UX]**
> ROLE: Product Designer.
> COMPONENT: {{VAR:Component:Button,Card,Dashboard,Form,Landing_Page}}
> TASK: Generate Shadcn/UI Spec and Design tokens.
> INPUT:
{{INPUT}}`,

    "VISION": `> **[MODE: VISION_ANALYST]**
> ROLE: Computer Vision Expert.
> DETAIL: {{VAR:Detail:High,Medium,Summary}}
> TASK: Analyze image elements, OCR, and spatial relationships.
> INPUT:
{{INPUT}}`,

    "DATA": `> **[MODE: DATA_GEN]**
> ROLE: Data Scientist.
> FORMAT: {{VAR:Format:JSON,CSV,SQL,TypeScript_Interface}}
> ROWS: {{VAR:Rows:10,50,100}}
> TASK: Generate realistic mock data.
> INPUT:
{{INPUT}}`,

    // =========================================================================
    // 4. WORKFLOWS & AUTOMATION (Automatización)
    // =========================================================================
    "🔴 REC_SCREEN": `> **[MODE: MACRO_RECORDER]**
> ROLE: Senior Automation Engineer.
> TASK: Create automation script for described workflow.
> TARGET: {{VAR:Target:Browser,Desktop,Terminal}}
> TOOL: {{VAR:Tool:Puppeteer,Playwright,PyAutoGUI,Selenium}}
> OUTPUT: Executable script with error handling.
> INPUT (Describe steps):
{{INPUT}}`,

    "CHAIN_DENSITY": `> **[MODE: CHAIN_DENSITY]**
> ROLE: Recursive Editor.
> ITERATIONS: {{VAR:Iterations:2,3,5}}
> TASK: Improve content iteratively, increasing information density per word.
> INPUT:
{{INPUT}}`,

    "CHAIN_STEPS": `> **[MODE: CHAIN_STEPS]**
> ROLE: Interactive Guide.
> PACE: {{VAR:Pace:Step-by-Step,Chunked}}
> TASK: Execute one step at a time. Wait for user confirmation.
> INPUT:
{{INPUT}}`,

    "LAM_SCRIPT": `> **[MODE: LAM_SCRIPT]**
> ROLE: Browser Automation Specialist.
> FRAMEWORK: {{VAR:Framework:Playwright,Puppeteer}}
> TASK: Write navigation script handling dynamic selectors and hydration.
> INPUT:
{{INPUT}}`,

    "FLOW": `> **[MODE: FLOW_CHART]**
> ROLE: Process Engineer.
> TYPE: {{VAR:Type:Flowchart,Sequence,State,Gantt}}
> TASK: Visualize logic with Mermaid.js syntax.
> INPUT:
{{INPUT}}`
};