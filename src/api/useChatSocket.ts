import type { Message } from "../types/common";
import { useEffect, useRef, useState } from "react";


// Chat socket hook
export function useChatSocket(chatId: string) {
  const socketRef = useRef<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [wsMessages, setWsMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!chatId) return;
    
    socketRef.current = new WebSocket(`ws://localhost:8000/api/ws/chat`);

    socketRef.current.onopen = () => {      
      setIsConnected(true);
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);       
      // console.log('🚀 ~ WebSocket message received:', data);
       // Add 'Z' to server timestamp if it doesn't have timezone info
       if (data.type === 'complete') {
       let serverTimestamp: Date;
       if (data.timestamp) {
           const timestampStr = data.timestamp.toString();
           const timestampWithZ = timestampStr.endsWith('Z') ? timestampStr : timestampStr + 'Z';
           serverTimestamp = new Date(timestampWithZ);
       } else {
           serverTimestamp = new Date();
       }      
       
       const assistantMessage: Message = {
           id: data.id,           
           answer: data.answer,        
           timestamp: serverTimestamp
       };       
      setWsMessages((prevMessages) => [...prevMessages, assistantMessage]);
      // Set loading to false when we receive the complete response
      setIsLoading(false);
       } else if (data.type === 'error') {
         // Handle error messages
         console.error('WebSocket error message:', data);
        const errorMessage: Message = {
          id: Date.now().toString(),          
          answer: 'Sorry, there was an error processing your message.',        
          timestamp: new Date()
        };
        setWsMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
       }
    };

    socketRef.current.onerror = (event) => {
      console.error('WebSocket error:', event);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    return () => {      
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
      socketRef.current = null; // optional: clear ref
    };
  }, [chatId]);


    // Send message to server
    const sendMessage = async (question: string) => {      
      setIsLoading(true);
        try {
          // const response = await client.post(`/api/chat`, { chat_id: chatId, question: question });          

          const payload = JSON.stringify({chat_id: chatId, question});
          const socket = socketRef.current;
          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(payload);
          } else {
            console.warn('❌ WebSocket not ready. Message not sent.');
            setIsLoading(false);
            return;
          }  
            
        } catch (error) {
          console.error('Error sending message:', error);
          setIsLoading(false);
          throw error;
        }        
    }    

  return { sendMessage, wsMessages, isConnected, isLoading };
}
