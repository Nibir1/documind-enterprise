# File: documind-enterprise/backend/app/services/llm_agent.py 
# Purpose: Implements the Router -> Retriever -> Generator workflow.

"""
LLM Agent Service (LangGraph)
-----------------------------
Orchestrates the RAG flow:
1. Router: Decides if query needs documents.
2. Retriever: Fetches data if needed.
3. Generator: Synthesizes answer.
"""

from typing import TypedDict, List
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langgraph.graph import StateGraph, END
from app.services.vector_store import VectorStoreService

# --- State Definition ---
class AgentState(TypedDict):
    question: str
    intent: str          # "general" or "search"
    documents: List[dict] # Retrieved chunks
    answer: str

class RAGAgent:
    def __init__(self, vector_store: VectorStoreService):
        self.vector_store = vector_store
        # Temperature 0 ensures deterministic output (crucial for routing)
        self.llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

    async def run(self, question: str):
        """Builds and runs the LangGraph state machine."""
        
        # 1. Define Workflow
        workflow = StateGraph(AgentState)

        # 2. Add Nodes
        workflow.add_node("router_node", self.router_node)
        workflow.add_node("search_node", self.search_node)
        workflow.add_node("generate_rag", self.generate_rag_node)
        workflow.add_node("generate_general", self.generate_general_node)

        # 3. Define Edges (Routing Logic)
        workflow.set_entry_point("router_node")
        
        workflow.add_conditional_edges(
            "router_node",
            self.route_decision,
            {
                "search": "search_node",
                "general": "generate_general"
            }
        )
        
        workflow.add_edge("search_node", "generate_rag")
        workflow.add_edge("generate_rag", END)
        workflow.add_edge("generate_general", END)

        # 4. Compile & Run
        app = workflow.compile()
        inputs = {"question": question, "documents": [], "intent": "", "answer": ""}
        
        result = await app.ainvoke(inputs)
        return result

    # --- Node Logic ---

    async def router_node(self, state: AgentState):
        """Classifies the user query."""
        prompt = ChatPromptTemplate.from_template(
            """
            You are a router. Your task is to classify the query into 'search' or 'general'.
            
            - 'search': Requires looking up information, facts, or documents.
            - 'general': Casual chat, greetings, or compliments.

            Return ONLY the word 'search' or 'general'. Do not add labels or punctuation.
            
            Query: {question}
            """
        )
        chain = prompt | self.llm | StrOutputParser()
        intent = await chain.ainvoke({"question": state["question"]})
        
        # --- FIX: Strict Cleaning Logic ---
        # Even if LLM says "Result: General", we extract just the keyword.
        intent_lower = intent.strip().lower()
        if "search" in intent_lower:
            final_intent = "search"
        else:
            final_intent = "general"
            
        return {"intent": final_intent}

    def route_decision(self, state: AgentState):
        """Returns the next node based on intent."""
        return state["intent"]

    async def search_node(self, state: AgentState):
        """Queries the Vector Database."""
        results = await self.vector_store.search(state["question"])
        
        docs = []
        for chunk, score in results:
            docs.append({
                "content": chunk.content,
                "source": chunk.filename,
                "page": chunk.doc_metadata.get("page", 1),
                "score": score
            })
        return {"documents": docs}

    async def generate_rag_node(self, state: AgentState):
        """Generates answer using retrieved documents."""
        context = "\n\n".join([f"Source: {d['source']}\nContent: {d['content']}" for d in state["documents"]])
        
        prompt = ChatPromptTemplate.from_template(
            """
            You are an enterprise assistant. Answer the question using ONLY the context provided below.
            If the answer is not in the context, say "I cannot find that information in the documents."
            
            Context:
            {context}
            
            Question: {question}
            """
        )
        chain = prompt | self.llm | StrOutputParser()
        answer = await chain.ainvoke({"context": context, "question": state["question"]})
        return {"answer": answer}

    async def generate_general_node(self, state: AgentState):
        """Handles casual chat."""
        prompt = ChatPromptTemplate.from_template("You are a helpful assistant. Respond kindly to: {question}")
        chain = prompt | self.llm | StrOutputParser()
        answer = await chain.ainvoke({"question": state["question"]})
        return {"answer": answer}