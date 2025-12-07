# DocuMind Enterprise 🚀

**DocuMind** is a production-grade, containerized **RAG (Retrieval-Augmented Generation)** Knowledge Management System. It mimics a secure Azure Enterprise setup, featuring an agentic core that intelligently routes user queries between general conversation and strict document search.

![Status](https://img.shields.io/badge/Status-Production%20Ready-success)
![Stack](https://img.shields.io/badge/Stack-FastAPI%20%7C%20React%20%7C%20LangGraph%20%7C%20Postgres-blue)

## 🏗 System Architecture

The application is built on a Microservices architecture using Docker Compose:

1.  **Frontend (React + Vite):** A modern "Glassmorphism" UI with streaming chat support and file ingestion status tracking.
2.  **Backend (FastAPI):** Asynchronous Python service handling file parsing, chunking, and AI orchestration.
3.  **Database (PostgreSQL 16):** Uses `pgvector` for high-performance vector similarity search (1536 dimensions) alongside relational metadata.
4.  **AI Core (LangGraph):** A state-machine agent that routes intent (Search vs. Chit-chat) and enforces citation governance.

## ⚡ Key Features

* **🤖 Agentic Routing:** Uses LangGraph to classify intent. It won't waste database resources on "Hello", but instantly retrieves data for "What is the budget?".
* **⚖️ Strict Governance:** No hallucinations. Every answer includes **Citations** (Filename, Page Number, Confidence Score).
* **📂 Enterprise Ingestion:** Asynchronous pipeline for processing PDF/TXT files using Recursive Character Splitting.
* **🎨 Modern UX:** Responsive React interface with Tailwind CSS, Drag & Drop uploads, and real-time feedback.

## 🛠 Tech Stack

* **Backend:** Python 3.11, FastAPI, Pydantic V2, SQLAlchemy (Async), Alembic.
* **AI/ML:** LangChain, LangGraph, OpenAI (Embeddings + Chat), PgVector.
* **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Axios.
* **Infra:** Docker Compose, Nginx (Proxy strategy), Multi-stage builds.

## 🚀 Getting Started

### Prerequisites
* Docker & Docker Compose
* OpenAI API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Nibir1/documind-enterprise.git](https://github.com/Nibir1/documind-enterprise.git)
    cd documind-enterprise
    ```

2.  **Configure Environment:**
    Copy the example env file and add your API key.
    ```bash
    cp .env.example .env
    # Edit .env and add OPENAI_API_KEY
    ```

3.  **Run the Application:**
    Use the Makefile shortcut for a clean build.
    ```bash
    make build
    ```

4.  **Access the Dashboard:**
    * Frontend: `http://localhost:3000`
    * API Docs: `http://localhost:8000/docs`

## 🧠 How It Works (The "Brain")

1.  **Ingestion:**
    * User uploads PDF -> Text Extracted -> Split into 1000-token chunks.
    * Chunks are embedded using `text-embedding-3-small` -> Stored in Postgres.

2.  **Retrieval (RAG):**
    * User Query -> **Router Node** (Is this search?) -> Yes.
    * **Retriever Node** fetches Top-3 chunks using Cosine Similarity.
    * **Generator Node** synthesizes answer using *only* retrieved context.

## 📜 MIT License
