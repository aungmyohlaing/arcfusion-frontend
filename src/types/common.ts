interface File {
    id: string;
    name: string;
    size: number;
    type: string;
}

interface Message {
  id: string;
  chat_id?: string;
  question?: string;
  answer?: string;
  source?: string;
  timestamp: Date;
}

interface ChatHistory {
  chat_id: string;
  messages: Message[];
  message_count: number;
}

interface ChatSessionState {
  chatId: string;
  chatHistory: ChatHistory;
  isLoading: boolean;
}

interface ChatMemory {
  hasStoredData: boolean;
  messageCount: number;
  lastUpdated: Date | null;
}


export type { File, Message, ChatHistory, ChatSessionState, ChatMemory };