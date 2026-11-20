---
key: "git-sync"
lang: "en"
title: "Git repository synchronisation"
summary: "Git repository synchronisation with branch-state tracking and conflict handling."
contribution: "Rewrote a corporate synchronisation tool from Bash to Python. Worked on SQLite branch-state storage, closed-branch and conflict handling, bidirectional configuration and containerised execution."
category: "corporate"
disclosure: "anonymised"
order: 2
featured: true
stack: ["Python", "Git", "SQLite", "Docker"]
---

## Purpose

The tool transfers branches and tags between Git servers. It supports repositories maintained across separate environments, where main branches and feature branches need different transfer rules.

## My work

- Rewrote the Bash tool in Python and developed its synchronisation configuration.
- Added SQLite branch-state storage scoped by repository and transfer direction.
- Worked on closed-branch handling to avoid recreating completed branches.
- Developed conflict, reverse-transfer and automatic-merge policies.
- Added secret masking in messages, Docker configuration and setup documentation.

## Technical approach

Each transfer direction has its own configuration, defining repositories, branch-selection rules, tag synchronisation and destination-change policies. Stored state helps distinguish a new branch from one that was synchronised and later closed.

This case covers my work on the tool, excluding subsequent contributions by others. Corporate addresses and names are omitted.
