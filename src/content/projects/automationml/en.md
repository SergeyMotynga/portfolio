---
key: "automationml"
lang: "en"
title: "AutomationML"
summary: "A library for models, ML pipelines and parameter search."
contribution: "Developed a Python library with a model factory, a pipeline builder and a unified hyperparameter-search interface. The project includes parameter validation, unit tests and CI configuration."
category: "library"
disclosure: "open"
order: 5
featured: false
stack: ["Python","scikit-learn","Optuna"]
---

## Technical approach

- A factory creates models by name and validates parameters.
- A builder assembles sklearn preprocessing and training pipelines.
- Parameter search supports GridSearch, RandomizedSearch and Optuna.
