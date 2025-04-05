export interface ConversationHeader {
  conversationId: string;
  title: string;
}

export interface ConversationMessage {
  sender: 'user' | 'model';
  text: string;
}

export interface Conversation {
  conversationId: string;
  title: string;
  fullMessages: ConversationMessage[];
} 