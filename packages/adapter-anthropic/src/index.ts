import { Adapter, AdapterResponse } from "@gqlpt/adapter-base";
import Anthropic, { ClientOptions } from "@anthropic-ai/sdk";

export type MessageParam = {
  role: "user" | "assistant";
  content: string;
};

export const DEFAULT_MODEL = "claude-3-5-sonnet-20240620";

export interface AdapterAnthropicOptions extends ClientOptions {
  /** The Anthropic model to use (defaults to Claude 3.5 Sonnet) */
  model?: string;

  /** The system prompt to use */
  systemPrompt?: string;

  /** The max tokens to use per message (defaults to 1024) */
  maxTokensPerMessage?: number;
}

export class AdapterAnthropic extends Adapter {
  private anthropic: Anthropic;

  private model: string;

  private systemPrompt?: string;

  private maxTokensPerMessage: number;

  private messageHistory: Map<string, Array<MessageParam>> = new Map();

  constructor(options: AdapterAnthropicOptions) {
    super();
    this.anthropic = new Anthropic(options);
    this.model = options.model || DEFAULT_MODEL;
    this.systemPrompt = options.systemPrompt;
    this.maxTokensPerMessage = options.maxTokensPerMessage || 1024;
  }

  async connect(): Promise<void> {
    const response = await this.anthropic.messages.create({
      system:
        "You are to test the connection to the Anthropic API. Respond with 'Pong' when you see 'Ping'.",
      messages: [{ role: "user", content: "Ping" }],
      model: this.model,
      max_tokens: this.maxTokensPerMessage,
    });

    if ((response.content[0] as any).text !== "Pong") {
      throw new Error("Cannot connect to Anthropic");
    }
  }

  async sendText(
    text: string,
    conversationId?: string,
  ): Promise<AdapterResponse> {
    let messages: Array<MessageParam> = [{ role: "user", content: text }];

    if (conversationId && this.messageHistory.has(conversationId)) {
      messages = [...this.messageHistory.get(conversationId)!, ...messages];
    }

    const response = await this.anthropic.messages.create({
      ...(this.systemPrompt ? { system: this.systemPrompt } : {}),
      messages,
      model: this.model,
      max_tokens: this.maxTokensPerMessage,
    });

    const content = (response.content[0] as any).text;
    const newId = response.id;

    this.messageHistory.set(newId, [
      ...(conversationId ? this.messageHistory.get(conversationId) || [] : []),
      { role: "user", content: text },
      { role: "assistant", content },
    ]);

    return {
      content,
      conversationId: newId,
    };
  }
}
