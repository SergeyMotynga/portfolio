---
key: "automationml"
lang: "en"
title: "AutomationML"
summary: "A library for assembling ML pipelines and searching hyperparameters."
contribution: "Developing shared model interfaces, a registry and factory, parameter validation and scikit-learn pipeline assembly. Adding GridSearch, RandomizedSearch and Optuna search wrappers, tests and CI configuration."
category: "library"
disclosure: "open"
order: 5
featured: false
stack: ["Python", "scikit-learn", "Optuna"]
repository: "https://github.com/SergeyMotynga/AutomationML/tree/develop"
---

## Purpose

The package is available on [TestPyPI](https://test.pypi.org/project/AutomationML/).

AutomationML brings recurring machine-learning steps together: model creation, configuration validation, pipeline assembly and hyperparameter search. It exposes these operations through shared interfaces.

## My work

- Develop base interfaces, a model registry and a factory.
- Add lazy dependency loading and parameter validation.
- Combine preprocessing and models into scikit-learn pipelines.
- Implement search wrappers for GridSearch, RandomizedSearch and Optuna.
- Maintain tests and automated-check configuration.

## Technical approach

The library provides a common layer over existing ML tools. External libraries supply the models and algorithms; my work covers their interfaces, integration and configuration checks. The project is licensed under Apache 2.0.
