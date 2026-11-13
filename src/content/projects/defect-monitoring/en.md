---
key: "defect-monitoring"
lang: "en"
title: "Defect monitoring system"
summary: "ML result integration and real-time data updates."
contribution: "Integrated ML results and extended APIs and data models. Improved product-composition checks, transactional result processing and sequential WebSocket updates. Fixed asynchronous cleanup scheduling."
category: "commercial"
disclosure: "anonymised"
order: 1
featured: true
stack: ["Python","FastAPI","SQLAlchemy","WebSocket"]
---

## Technical approach

- The backend receives recognition results and turns them into application data.
- Transactional processing is separated from sending interface updates.
- The work covers background tasks and WebSocket delivery.
