---
key: "document-rag"
lang: "en"
title: "RAG document search"
summary: "An academic RAG service for document questions with retrieved source passages."
contribution: "Built an academic question-answering system over the Russian Constitution: text preparation and indexing, passage retrieval, reranking and Ollama generation. Connected the RAG pipeline to FastAPI and a Streamlit interface."
category: "academic"
disclosure: "open"
order: 6
featured: false
stack: ["Python", "ChromaDB", "Ollama", "FastAPI", "Streamlit", "LangChain", "sentence-transformers"]
repository: "https://github.com/SergeyMotynga/NLP_project"
---

## Purpose

The academic service answers questions using passages retrieved from a document. This project uses the Russian Constitution as its source. The interface displays source passages alongside the generated answer.

## My work

- Prepared and chunked the text and built a ChromaDB index.
- Connected passage retrieval to cross-encoder reranking.
- Integrated answer generation through Ollama.
- Exposed the pipeline through FastAPI and connected a Streamlit interface.

## Technical approach

Retrieval-augmented generation connects document search with answer generation. The system retrieves passages, reranks them and passes the context to a language model. LangChain and sentence-transformers support the processing stages.

This academic project integrates existing models and tools. Answers need to be checked against the original document.
