import type { BotMessage, ChatState, Source } from "$lib/types/chat";

export function processSource(payload: any, botMessage: BotMessage) {
    const sourceId = payload.excerpt_number;
    const sourceExtension = payload.extension;
    const sourceFilePath = payload.file_path;
    const sourceTitle = payload.title;

    const source : Source = {
        id: sourceId,
        extension: sourceExtension.toLowerCase(),
        filePath: sourceFilePath,
        title: sourceTitle,
        showTooltip: true,
    }

    botMessage.sources.push(source);
}

// Function to process reasoning messages and update message state
export function processReasoningMessage(data: string, botMessage: BotMessage, state: ChatState) {
  // Handle reasoning paragraph break
  if (/\n\n/.test(data) && botMessage.reasoning.length > 0) {
    botMessage.reasoning[botMessage.reasoning.length - 1].collapsed = true;
    botMessage.reasoning.push({ text: '', collapsed: false });
    return;
  }

  // Skip <think> tag or reasoning paragraph break
  if (/\u003cthink\u003e/.test(data) || /\n\n/.test(data)) {
    return;
  }

  // Handle </think> tag
  if (/\u003c\/think\u003e/.test(data)) {
    state.isReasoning = false;

    // Auto-collapse reasoning section when reasoning is complete
    botMessage.reasoningSectionCollapsed = true;

    if (botMessage.reasoning.length > 0) {
      botMessage.reasoning[botMessage.reasoning.length - 1].collapsed = true;
    }
    state.messages = [...state.messages.slice(0, -1), botMessage];

    return;
  }

  // Add or update reasoning text
  if (botMessage.reasoning.length > 0) {
    botMessage.reasoning[botMessage.reasoning.length - 1].text += data;
  } else {
    botMessage.reasoning.push({ text: data, collapsed: false });
  }

  preserveReasoningSectionState(botMessage, state);

  // Update messages array
  if (state.messages[state.messages.length - 1].sender === 'bot') {
    state.messages[state.messages.length - 1].reasoning = botMessage.reasoning;
    state.messages[state.messages.length - 1].reasoningSectionCollapsed =
      botMessage.reasoningSectionCollapsed;
  } else {
    state.messages = [...state.messages, botMessage];
  }
}

// Function to process output message and update message state
export function processOutputMessage(data: string, botMessage: BotMessage, state: ChatState) {
  botMessage.text += data;
  preserveReasoningSectionState(botMessage, state);
  state.messages = [...state.messages.slice(0, -1), botMessage];
}

// Function to preserve reasoningSectionCollapsed property
function preserveReasoningSectionState(botMessage: BotMessage, state: ChatState): void {
  if (state.messages.length > 0 && state.messages[state.messages.length - 1].sender === 'bot') {
    const currentBotMessage = state.messages[state.messages.length - 1];
    botMessage.reasoningSectionCollapsed = currentBotMessage.reasoningSectionCollapsed;
  }
}

// Function to toggle reasoning visibility
export function toggleReasoning(messageIndex: number, reasoningIndex: number, state: ChatState) {
  const lastMessage = state.messages[messageIndex];
  if (lastMessage.sender === 'bot') {
    lastMessage.reasoning[reasoningIndex].collapsed =
      !lastMessage.reasoning[reasoningIndex].collapsed;
    state.messages = [...state.messages]; // Trigger reactivity
  }
}
