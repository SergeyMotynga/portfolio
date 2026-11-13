---
key: "document-rag"
lang: "en"
title: "RAG document search"
summary: "An academic question-answering service for the Russian Constitution."
contribution: "An academic implementation of document preparation, ChromaDB vector search, result reranking and answer generation with Ollama. A FastAPI API and Streamlit interface provide answers with source references."
category: "academic"
disclosure: "open"
order: 6
featured: false
stack: ["FastAPI","ChromaDB","Ollama","Streamlit"]
---

## Technical approach

- Documents are prepared and stored in a vector database.
- Retrieved passages are reranked before answer generation.
- FastAPI and Streamlit provide answers with source references.
