interface BotMessage {
    text: string;
    sender: string;
    reasoning: {text: string; collapsed: boolean}[];
}

interface ChatState {
    messages: BotMessage[];
    isReasoning: boolean;
}

export function processReasoningMessage(data: string, botMessage: BotMessage, state: ChatState) {
    // Handle reasoning paragraph break
    if (/\n\n/.test(data) && botMessage.reasoning.length > 0) {
        botMessage.reasoning[botMessage.reasoning.length - 1].collapsed = true;
        botMessage.reasoning.push({text: '', collapsed: false});
        return;
    }

    // Skip <think> tag or reasoning paragraph break
    if (/\u003cthink\u003e/.test(data) || /\n\n/.test(data)) {
        return;
    }

    // Handle </think> tag
    if (/\u003c\/think\u003e/.test(data)) {
        state.isReasoning = false;
        return;
    }

    // Add or update reasoning text
    if (botMessage.reasoning.length > 0) {
        botMessage.reasoning[botMessage.reasoning.length - 1].text += data;
    } else {
        botMessage.reasoning.push({text: data, collapsed: false});
    }

    // Update messages array
    if (state.messages[state.messages.length - 1].sender === "bot") {
        state.messages[state.messages.length - 1].reasoning = botMessage.reasoning;
    } else {
        state.messages = [...state.messages, botMessage];
    }
}

export function processOutputMessage(data: string, botMessage: BotMessage, state: ChatState) {
    botMessage.text += data;
    state.messages = [...state.messages.slice(0, -1), botMessage];
}

export function toggleReasoning(messageIndex: number, reasoningIndex: number, state: ChatState) {
    const lastMessage = state.messages[messageIndex];
    if (lastMessage.sender === "bot") {
        lastMessage.reasoning[reasoningIndex].collapsed = !lastMessage.reasoning[reasoningIndex].collapsed;
        state.messages = [...state.messages]; // Trigger reactivity
    }
}