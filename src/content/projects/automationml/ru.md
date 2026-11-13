---
key: "automationml"
lang: "ru"
title: "AutomationML"
summary: "Библиотека моделей, ML-пайплайнов и подбора параметров."
contribution: "Разрабатывал Python-библиотеку с фабрикой моделей, конструктором пайплайнов и единым подходом к поиску гиперпараметров. В проекте есть валидация параметров, модульные тесты и конфигурация CI."
category: "library"
disclosure: "open"
order: 5
featured: false
stack: ["Python","scikit-learn","Optuna"]
---

## Технический подход

- Фабрика создаёт модели по имени и проверяет параметры.
- Конструктор собирает sklearn-пайплайны предобработки и обучения.
- Механизмы поиска параметров включают GridSearch, RandomizedSearch и Optuna.
