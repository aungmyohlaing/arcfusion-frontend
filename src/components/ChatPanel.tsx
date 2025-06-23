import React, { useEffect, useState } from 'react';
import { RefreshCcw, Send, User, Bot, Database, Loader } from 'lucide-react';
import { apiClient } from '../api/index';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store/store';
import { clearChatId, setChatId, setChatHistory } from '../store/chatSession';
import WarningModal from './WarningModal';
import { useChatSocket } from '../api/useChatSocket';
import type { Message, ChatMemory } from '../types/common';


const ChatPanel: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatMemory, setChatMemory] = useState<ChatMemory>({
    hasStoredData: false,
    messageCount: 0,
    lastUpdated: null
  });
  const [isLoadingMemory, setIsLoadingMemory] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModal] = useState<boolean>(false);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  
  // Redux state
  const dispatch = useDispatch();
  const chatId = useSelector((state: RootState) => state.chatSession.chatId);
  const chatHistory = useSelector((state: RootState) => state.chatSession.chatHistory);
  const { sendMessage, wsMessages, isLoading } = useChatSocket(chatId);

  // Format timestamp  
  const formatTimestamp = (timestamp: any) => {        
    let date: Date;
    if (timestamp instanceof Date) {
      date = timestamp;
    } else if (timestamp) {
      const timestampStr = timestamp.toString();
      const timestampWithZ = timestampStr.endsWith('Z') ? timestampStr : timestampStr + 'Z';
      date = new Date(timestampWithZ);
    } else {
      date = new Date();
    }
    return date.toLocaleString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  // Send message to server
  const handleSendMessage = async () => {
    if (!message.trim()) return;
        
    try {
      // Add user message immediately
      const userMessage: Message = {
        id: `user_${Date.now()}`,
        chat_id: chatId,        
        question: message,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setMessage('');
      
      // Send to server
      await sendMessage(message);    
    } catch (error) {
      console.error('Error sending message:', error);     
    } 
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }

  // Show warning modal
  const handleResetChat = () => {
    setShowWarningModal(true);
  };

  // Reset chat session
  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      await apiClient.resetChat();        
      setChatMemory({
        hasStoredData: false,
        messageCount: 0,
        lastUpdated: null
      });      
      setMessages([]);
      dispatch(clearChatId());

      const response = await apiClient.startChat();     
      dispatch(setChatId(response.chat_id)); 
    } catch (error) {
      console.error('Error resetting chat:', error);
    } finally {
      setIsResetting(false);
      setShowWarningModal(false);
    }
  };

  // Check chat memory from server
  const checkChatMemory = async () => {
    if (!chatId) return;
    
    try {
      const response = await apiClient.getChatHistory(chatId);
      const hasData = response.messages && response.message_count > 0;
      
      setChatMemory({
        hasStoredData: hasData,
        messageCount: hasData ? response.message_count : 0,
        lastUpdated: hasData ? new Date() : null
      });

      dispatch(setChatHistory(response));
      
      return hasData;
    } catch (error) {
      console.error('Error checking chat memory:', error);
      return false;
    }
  }

  // Load chat memory
  const loadChatMemory = async () => {
    if (!chatId) return;
    
    setIsLoadingMemory(true);
    try {       
      // Add history messages to current messages
      const historyMessages = chatHistory.messages || [];
      setMessages(prev => [...historyMessages, ...prev]);
      
      setChatMemory(prev => ({
        ...prev,
        hasStoredData: false,
        messageCount: 0
      }));
    } catch (error) {
      console.error('Error loading chat memory:', error);
    } finally {
      setIsLoadingMemory(false);
    }
  }

  // Add WebSocket messages to display
  useEffect(() => {
    if (wsMessages.length > 0) {
      const lastWsMessage = wsMessages[wsMessages.length - 1];
      setMessages(prev => {
        // Check if this message is already displayed
        const exists = prev.some(msg => msg.id === lastWsMessage.id);
        if (!exists) {
          return [...prev, lastWsMessage];
        }
        return prev;
      });
    }
  }, [wsMessages]);

  useEffect(() => {
    const initializeChat = async () => {
      if (chatId) {
        await checkChatMemory();
      }
    };
    
    initializeChat();
  }, [chatId]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-800 border border-gray-100 dark:border-gray-700 flex flex-col min-h-[500px] max-h-[800px] w-full" role="application" aria-label="Chat interface">
      {/* Header */}
      <header className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
        <h2 className="font-semibold text-base sm:text-lg">Chat Q&A</h2>
        <div className="flex flex-row gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400 items-center">
          {/* Chat Memory Indicator */}
          {chatMemory.hasStoredData && (
            <div className="flex items-center gap-1 sm:gap-2 bg-blue-50 dark:bg-blue-900 px-2 sm:px-3 py-1 rounded-lg border border-blue-200 dark:border-blue-800" role="status" aria-live="polite">
              <Database className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
              <span className="text-blue-700 dark:text-blue-300 text-xs hidden sm:inline">
                {chatMemory.messageCount} messages stored
              </span>
              <span className="text-blue-700 dark:text-blue-300 text-xs sm:hidden">
                {chatMemory.messageCount}
              </span>
              <button
                onClick={loadChatMemory}
                disabled={isLoadingMemory}
                className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-600 text-xs font-medium disabled:opacity-50"
                aria-label={`Load ${chatMemory.messageCount} stored messages`}
                aria-describedby="memory-load-description"
              >
                {isLoadingMemory ? (
                  <Loader className="w-3 h-3 animate-spin" aria-hidden="true" />
                ) : (
                  <RefreshCcw className="w-3 h-3" aria-hidden="true" />
                )}
                <span className="hidden sm:inline">Load</span>
              </button>
              <span id="memory-load-description" className="sr-only">Click to load previously stored chat messages</span>
            </div>
          )}
          
          <div className="text-xs sm:text-sm" aria-label="Chat session identifier">Chat ID: {chatId}</div>
        </div>
      </header>
      
      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4" 
        role="log" 
        aria-label="Chat messages"
        aria-live="polite"
        aria-atomic="false"
      >
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center mt-16" role="status" aria-live="polite">
            No messages yet. Start by asking a question!
          </div>
        ) : (
          messages.map((msg) => (
            <React.Fragment key={msg.id}>
              {/* User Question */}
              {msg.question && (
                <div className="flex justify-end items-end gap-2" role="article" aria-label="User message">
                  <div className="bg-primary dark:bg-primary-dark text-white rounded-lg rounded-br-md px-4 py-2 max-w-[80%]" role="textbox" aria-label="User message">
                    <div className="text-sm">{msg.question}</div>
                    <div className="text-xs mt-1 text-gray-300" aria-label="Message timestamp">{formatTimestamp(msg.timestamp)}</div>
                  </div>
                  <div className="w-8 h-8 bg-primary dark:bg-primary-dark rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <User className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              {/* Assistant Answer */}
              {msg.answer && (
                <div className="flex justify-start items-end gap-2" role="article" aria-label="Assistant response">
                  <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
                    <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-md px-4 py-2 max-w-[80%]" role="textbox" aria-label="Assistant response">
                    <div className="text-sm">{msg.answer}</div>
                    <div className="text-xs mt-1 text-gray-500" aria-label="Message timestamp">{formatTimestamp(msg.timestamp)}</div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start items-end gap-2" role="status" aria-live="polite" aria-label="Assistant is thinking">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0" aria-hidden="true">
              <Bot className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg rounded-bl-md px-4 py-2">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 dark:border-gray-400" aria-hidden="true"></div>
                <span className="text-sm">Thinking...</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Input */}
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-row gap-2" role="form" aria-label="Message input">
        <input
          type="text"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question..."
          disabled={isLoading}
          aria-label="Type your question"
          aria-describedby="send-button"
        />
        <button 
          id="send-button"
          className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-md w-32 flex flex-row gap-2 items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          aria-label="Send message"
          aria-describedby={isLoading ? "sending-status" : undefined}
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          Send
        </button>
        {isLoading && <span id="sending-status" className="sr-only">Message is being sent</span>}
      </div>
      
      <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 flex flex-row gap-2 items-center justify-center">
        <div className="flex flex-col gap-2 sm:flex-row w-full sm:w-auto">
        <button 
          className="bg-primary dark:bg-primary-dark text-white px-4 py-2 rounded-md w-full sm:w-52 flex flex-row gap-2 items-center justify-center hover:bg-primary-600 dark:hover:bg-primary-500 dark:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleResetChat}
          aria-label="Reset chat session"
          aria-describedby="reset-description"
          disabled={!chatMemory.hasStoredData && messages.length === 0}
        >
          <RefreshCcw className="w-4 h-4" aria-hidden="true" />
          Reset Chat
        </button> 
        <span id="reset-description" className="sr-only">Clear all messages and start a new chat session</span>
        </div>
      </div>

      {/* Warning Modal */}
      <WarningModal
        isOpen={showWarningModal}
        onClose={() => setShowWarningModal(false)}
        onConfirm={handleConfirmReset}
        title="Reset Chat Session"
        message="This action will clear all messages and create a new chat session. This cannot be undone. Are you sure you want to continue?"
        confirmText="Reset Chat"
        cancelText="Cancel"
        isLoading={isResetting}
      />
    </div>
  );
};

export default ChatPanel; 