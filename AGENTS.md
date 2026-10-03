# AGENTS.md — Harvey Development Guidelines

This file provides architectural context and operational constraints for AI agents working in this repository.

## Architecture & System Overview

Harvey is an autonomous AI sales agent that drives the `claude` CLI in headless mode without incurring per-token API bills.
It executes the continuous loop: `discover -> profile -> scout -> write_campaign -> outbox -> reply`.

### Core Layers

- `harvey/collectors/`: Deterministic data gathering (OpenStreetMap Nominatim/Overpass, website metadata, email pattern finding).
- `harvey/models/`: Pydantic models and database schemas for prospects, signals, cohorts, and outbox messages.
- `harvey/cli.py`: Click/CLI command surface (`run`, `train`, `signals`, `serve`, `export`).
- `harvey/web/`: Embedded web dashboard (`index.html`, `app.css`, `app.js`, vendored offline fonts) served via FastAPI.
- `prompts/`: Role-specific agent prompts (`scout.md`, `writer.md`, `handler.md`, `system.md`).
- `skills/`: Tactical sales skills for cold outreach, account navigation, objection handling, and offer strategy.

## Key Invariants

1. **Deterministic Discovery First**: Do not invoke LLM inference when data can be obtained via plain code or structured APIs.
2. **Deterministic Pre-Send Gate**: No email is ever dispatched without passing domain health, MX checks, and user approval.
3. **No Fabrication**: Cold emails and prospect qualifications must reference actual observed signals, not fabricated facts.
4. **Attribution**: Project is authored and maintained by **Abdullah Formuli** (`authrain-cloud-abdullahformuli` / `authrainmedia@gmail.com`).
