# DocuMind Enterprise

**DocuMind** is a production-grade, containerized **RAG
(Retrieval-Augmented Generation)** Knowledge Management System. It
mimics a secure Azure Enterprise setup, featuring an agentic core that
intelligently routes user queries between general conversation and
strict document search.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.11%2B-blue?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![LangChain](https://img.shields.io/badge/LangGraph-Agentic-orange?style=for-the-badge)
![Tests](https://img.shields.io/badge/Tests-Passing-green?style=for-the-badge)

**DocuMind-Enterprise** is a production-grade **Reference Architecture** for building secure, compliant Retrieval-Augmented Generation (RAG) systems.

### Why this exists
Most RAG demos fail in enterprise production because they lack governance and cost control. This project implements a **strict "Citation-First" architecture** designed for regulated industries (Legal, Finance, GDPR-compliant sectors). It enforces:

1.  **Strict Source Attribution:** No answer is generated without a verified PDF page reference (Zero Hallucination Policy).
2.  **Agentic Routing:** Uses **LangGraph** to intelligently distinguish between "general chitchat" and "database queries," significantly reducing token costs and latency.
3.  **Asynchronous Ingestion:** Non-blocking FastAPI pipelines for high-throughput document processing.

## System Architecture

The application is built on a Microservices architecture using Docker
Compose:

1.  **Frontend (React + Vite):** A modern "Glassmorphism" UI with
    streaming chat support and file ingestion status tracking.
2.  **Backend (FastAPI):** Asynchronous Python service handling file
    parsing, chunking, and AI orchestration.
3.  **Database (PostgreSQL 16):** Uses `pgvector` for high-performance
    vector similarity search (1536 dimensions) alongside relational
    metadata.
4.  **AI Core (LangGraph):** A state-machine agent that routes intent
    (Search vs. Chitchat) and enforces citation governance.

## Key Features

-   **Agentic Routing:** Uses LangGraph to classify intent.
-   **Strict Governance:** No hallucinations; every answer includes
    **Citations**.
-   **Enterprise Ingestion:** Asynchronous pipeline for PDF/TXT
    files.
-   **Modern UX:** Responsive React interface with real-time
    feedback.

## 🛠 Tech Stack

-   **Backend:** Python 3.11, FastAPI 0.110, SQLAlchemy Async, Alembic
-   **AI:** LangChain, LangGraph, OpenAI, pgvector
-   **Frontend:** React 18, TypeScript, Tailwind
-   **Infra:** Docker Compose, Nginx

## Getting Started

### Prerequisites

-   Docker & Docker Compose
-   OpenAI API Key

### Installation

``` bash
git clone https://github.com/Nibir1/documind-enterprise.git
cd documind-enterprise
cp .env.example .env
# Add OPENAI_API_KEY
make build
```
### Testing & Validation

This project includes a comprehensive integration test suite covering 100% of the critical path logic. The tests run inside the Docker container to ensure environment consistency and use `AsyncMock` to simulate OpenAI and PostgreSQL, ensuring zero-cost, fast execution.

To run the test suite:

```bash
make test
```

### Access

-   Frontend: http://localhost:3000
-   API Docs: http://localhost:8000/docs

## How It Works

### Ingestion

-   PDF uploaded → Text extracted → 1000-token chunks
-   Embedded via `text-embedding-3-small` → Stored in Postgres

### Retrieval (RAG)

-   Router Node → Retriever Node → Generator Node

------------------------------------------------------------------------

## Features

### Governance

-   Mandatory citations (Filename + Page + Confidence)
-   Zero hallucination policy
-   Azure Monitor--ready audit logs

### Cost Optimization

-   Router decides if query should use search or chitchat

### Ingestion Pipeline

-   Recursive chunking & real-time status

## Project Structure

    documind-enterprise/
    ├── backend/
    │   ├── app/
    │   │   ├── api/v1/
    │   │   ├── core/
    │   │   ├── models/
    │   │   ├── schemas/
    │   │   └── services/
    ├── frontend/
    │   ├── src/
    │   │   ├── api/
    │   │   ├── features/
    │   │   └── components/
    ├── docker-compose.yml
    └── Makefile

## Roadmap

-   [x] Core RAG Architecture
-   [ ] Azure AD (Entra ID) SSO
-   [ ] Azure Container Apps deployment
-   [ ] RBAC for document sets

## MIT License

Author: **Nahasat Nibir** -- Senior Backend Engineer & AI Systems Architect
