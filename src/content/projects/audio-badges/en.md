---
key: "audio-badges"
lang: "en"
title: "Audio badge management system"
summary: "Access control, role hierarchy and work-shift management."
contribution: "Implemented resource and organisational-scope access checks, role hierarchy and a work-shift module. Moved API business logic into a service layer and replaced application-side hierarchy traversal with a recursive SQL query."
category: "commercial"
disclosure: "anonymised"
order: 0
featured: true
stack: ["Python","FastAPI","PostgreSQL"]
---

## Technical approach

- Permission checks account for user roles and access scope.
- The shift module includes models, migrations, API endpoints and service logic.
- Hierarchy traversal moved from application code to a recursive SQL query.
