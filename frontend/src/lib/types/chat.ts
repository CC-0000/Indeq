export interface Source {
    id: number;
    extension: string;
    filePath: string;
    title: string;
}

export interface BotMessage {
    text: string;
    sender: string;
    reasoning: {text: string; collapsed: boolean}[];
    reasoningSectionCollapsed: boolean;
    sources: Source[];
    sourcesScrollAtEnd?: boolean;
    isScrollable?: boolean;
}

export interface ChatState {
    messages: BotMessage[];
    isReasoning: boolean;
}