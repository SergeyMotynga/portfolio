---
key: "git-sync"
lang: "en"
title: "Git repository synchronisation"
summary: "A Bash-to-Python rewrite with state-aware branch synchronisation."
contribution: "Rewrote a corporate Git synchroniser from Bash to Python. Added SQLite branch-state tracking, closed-branch and conflict handling, back-sync and automatic merge policies. Implemented configuration validation and token masking in logs."
category: "corporate"
disclosure: "anonymised"
order: 2
featured: true
stack: ["Python","Git","SQLite","Docker"]
---

## Technical approach

- SQLite preserves branch state between synchronisation runs.
- Configuration defines conflict and closed-branch behaviour.
- The service supports one-shot execution and repeated runs in Docker.
