---
key: "time-series"
lang: "en"
title: "Time Series Task"
summary: "An interface for time-series preparation, forecasting and result comparison."
contribution: "Developed the data interface for a team time-series project: upload and editing, dataset preparation and charts. Integrated it with the forecasting API and refined the application structure."
category: "team"
disclosure: "open"
order: 7
featured: false
stack: ["Streamlit", "pandas", "FastAPI", "Python", "NumPy", "statsmodels", "Docker"]
repository: "https://github.com/SergeyMotynga/Time_series_task"
---

## Purpose

The application helps prepare time series, build forecasts and compare model results. Users upload and inspect datasets, configure parameters and explore forecasts and metrics through charts.

## My work

- Built Streamlit pages and organised them around user workflows.
- Added data upload with delimiter selection and duplicate-row handling.
- Refined dataset preparation and editing.
- Connected the interface to the API and displayed analysis and forecast results.
- Worked on charts and application structure.

## Technical approach

Streamlit, pandas and NumPy support data preparation and the interface. The team solution includes a FastAPI service and forecasting methods such as SARIMA, ETS and Prophet, with manual and automatic parameter selection.

My contribution covered interface-side data work and server integration. This forecasting project is separate from SPAS System, which focuses on anomaly detection.
