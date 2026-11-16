---
key: "defect-monitoring"
lang: "en"
title: "Defect monitoring system"
summary: "ML result processing and live defect-monitoring updates."
contribution: "Worked on backend ML integration: recognition-result processing, composition checks and shift state. Coordinated database commits with WebSocket updates and fixed asynchronous background cleanup scheduling."
category: "commercial"
disclosure: "anonymised"
order: 1
featured: true
stack: ["Python", "FastAPI", "WebSocket", "SQLAlchemy", "Alembic", "Docker"]
---

## Purpose

The team system receives automated recognition results to help check product composition. Its backend associates detected objects with the current shift, compares them with the expected composition and sends updates to clients.

## My work

- Integrated recognition results with current-shift data.
- Refined composition checks and expected-object counts.
- Coordinated concurrent updates to shift state.
- Established the operation order: commit the transaction before notifying clients.
- Refined sequential WebSocket delivery and asynchronous cleanup scheduling.

## Technical approach

FastAPI receives results from the ML component. The server validates them, updates data through SQLAlchemy and broadcasts the new state after saving it. Notifications therefore refer to committed data.

My work covered backend processing and integration. Recognition models and the interface were team contributions. The client and confidential materials are omitted.
