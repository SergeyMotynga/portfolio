---
key: "audio-badges"
lang: "en"
title: "Audio badge management system"
summary: "Resource access and work shifts for an audio-badge platform."
contribution: "Contributed to a team backend: role- and hierarchy-aware access checks and work-shift management. Moved business rules from API handlers into services and worked on hierarchical SQL queries."
category: "commercial"
disclosure: "anonymised"
order: 0
featured: true
stack: ["Python", "FastAPI", "PostgreSQL", "SQLAlchemy", "Redis", "Alembic", "Docker"]
---

## Purpose

The backend manages organisational data and workflows for an audio-badge platform. Users access resources within their roles and organisational scope and open or close work shifts.

## My work

- Separated HTTP request handling from business rules by moving logic into services.
- Built shared resource-access checks that account for roles and organisational scope.
- Refined role-level restrictions in registration and user management.
- Implemented shift management across models, migrations, services and API endpoints.
- Moved organisational hierarchy traversal into recursive SQL queries.

## Technical approach

FastAPI handles requests, services execute domain operations, and SQLAlchemy accesses PostgreSQL. Access checks account for each resource's position in the hierarchy. Alembic manages schema changes; the project infrastructure also uses Redis and Docker.

This commercial case omits the client and confidential materials.
