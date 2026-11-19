---
key: "project-release-tracker"
lang: "en"
title: "Project and release management system"
summary: "An internal tool for managing projects, planning releases and assigning team roles."
contribution: "Built the entire application independently, including the API, database and web interface. Implemented project records, team membership and roles, and release planning with dates, statuses and owners."
category: "corporate"
disclosure: "anonymised"
order: 12
stack: ["FastAPI", "PostgreSQL", "React", "TypeScript", "SQLAlchemy", "Alembic", "Docker"]
---

## Purpose

Users can create a project, assemble a team and assign each member a role within that project. They can set a version, planned date and owners for each release. A separate view lists upcoming releases across projects.

## My work

- Designed the data model and built the API for projects, members, roles and releases.
- Built the web interface for managing projects, teams and releases, including task lists within a release.
- Implemented sign-in with a company account and an admin area for managing access.
- Wrote database migrations and configured containerised deployment.

## Technical approach

A member's role belongs to their project assignment, so the same person can hold different roles across teams. Release owners are assigned separately. The API uses FastAPI, data is stored in PostgreSQL, and the web interface uses React and TypeScript.
