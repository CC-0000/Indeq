export interface BotMessage {
    text: string;
    sender: string;
    reasoning: {text: string; collapsed: boolean}[];
    reasoningSectionCollapsed: boolean;
}

export interface ChatState {
    messages: BotMessage[];
    isReasoning: boolean;
}