export interface DocumentUploadResponse {
    filename: string;
    message: string;
    chunks_processed: number;
}

export interface Citation {
    filename: string;
    page: number;
    text_snippet: string;
    score: number;
}

export interface ChatResponse {
    answer: string;
    intent: "search" | "general";
    citations: Citation[];
}

export interface Message {
    role: 'user' | 'assistant';
    content: string;
    citations?: Citation[];
}