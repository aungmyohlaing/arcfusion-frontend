import client from "./client";
import type { Message } from "../types/common";


// Chat socket hook
export function useChatSocket(chatId: string) {


    // Send message to server
    const sendMessage = async (question: string): Promise<Message> => {
        try {
          const response = await client.post(`/api/chat`, { chat_id: chatId, question: question });          
              
            // Add 'Z' to server timestamp if it doesn't have timezone info
            let serverTimestamp: Date;
            if (response.data.timestamp) {
                const timestampStr = response.data.timestamp.toString();
                const timestampWithZ = timestampStr.endsWith('Z') ? timestampStr : timestampStr + 'Z';
                serverTimestamp = new Date(timestampWithZ);
            } else {
                serverTimestamp = new Date();
            }      
            
            const assistantMessage: Message = {
                id: response.data.id.toString(),
                answer: response.data.answer,        
                timestamp: serverTimestamp
            };

            return assistantMessage;
        } catch (error) {
          console.error('Error sending message:', error);
          throw error;
        }
    }    

  return { sendMessage };
}
