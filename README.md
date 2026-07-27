# Winn Cook

Building with Claude Code, Codex, and Grok. Open to collaboration.

I work mainly in Python, TypeScript, SQL, and DuckDB. My current focus is workflow and loop automation, public-data systems, and separating deterministic checks from AI judgment.

## Current projects

### Grant Nexus

A protected federal grant-discovery pilot organized around 40 generic academic department profiles.

Deterministic retrieval and reranking narrow the candidates; bounded AI judgment scores relevance against source evidence; release gates control what becomes accepted output.

[Project overview](https://grantnexus.ai/)

### Ask Durango

A private civic-data system that combines La Plata County assessor records, ArcGIS layers, Colorado business entities, and other public sources in DuckDB.

The Next.js interface uses LLM-to-SQL for open-ended questions and deterministic paths for property lookups, while retaining source, freshness, and uncertainty.

### Durango Mini

A source-backed 3D browser simulation of the Main Avenue–Fort Lewis corridor built with TypeScript, React Three Fiber, Three.js, Rapier, and Python/GDAL.

Official roads, trails, rail, buildings, and hydrology feed a bounded, full-preload world; source facts and deterministic playability fallbacks are tracked separately.

### Brick CLI

A private library of composable Python CLIs for sources including Grants.gov, IPEDS, Census ACS, USASpending, OpenStreetMap, NOAA, and Colorado public data.

Each brick declares its own manifest, writes structured JSON to stdout, keeps logs and errors on stderr, and runs through offline contract checks and live-source smokes.

## How I build

- Build workflows as explicit loops with known inputs, bounded steps, verification, and recoverable state.
- Use deterministic code for facts and rules that can be tested. Treat AI ranking, interpretation, and generation as candidate output until it passes the relevant gate.
- Use agents for bounded tasks, but require test output and independent review before treating the work as complete.
- Keep source provenance, freshness, and uncertainty visible when working with public data.
- Keep practices current by following a curated group of agentic engineers and maintainers, reviewing their published work, and testing recommendations before adopting them.

## Source access

Most project repositories are private because they include internal systems, client data, or active product work. I can discuss architecture, test strategy, and design tradeoffs without exposing protected data.

Professional profile: [LinkedIn](https://www.linkedin.com/in/winn-cook/)
