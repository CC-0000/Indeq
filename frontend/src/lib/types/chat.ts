export interface Source {
    id: number;
    extension: string;
    filePath: string;
    fileUrl?: string;
    title: string;
    showTooltip: boolean;
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