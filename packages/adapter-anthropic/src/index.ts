import { Adapter, AdapterResponse } from "@gqlpt/adapter-base";

import Anthropic, { ClientOptions } from "@anthropic-ai/sdk";

export type MessageParam = Anthropic.MessageParam;
export const DEFAULT_MODEL = "claude-3-5-sonnet-20240620";
export interface AdapterAnthropicOptions extends ClientOptions {
  model?: string;
  systemPrompt?: string;
  maxTokensPerMessage?: number;
  temperature?: number;
  cacheControl?: {
    type?: string;
  };
}
export class AdapterAnthropic extends Adapter {
  private anthropic: Anthropic;

  private model: string;

  private systemPrompt?: string;

  private maxTokensPerMessage: number;

  private messageHistory: Map<string, Array<MessageParam>> = new Map();

  private temperature: number;

  private cacheControl?: { type?: string };

  constructor(options: AdapterAnthropicOptions) {
    super();
    this.anthropic = new Anthropic(options);
    this.model = options.model || DEFAULT_MODEL;
    this.systemPrompt = options.systemPrompt;
    this.maxTokensPerMessage = options.maxTokensPerMessage || 1024;
    this.temperature = options.temperature || 0.2;
    this.cacheControl = options.cacheControl;
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
    let beforeText: string | undefined;
    const splitPhrase = "And this plain text query:";

    let messages: Array<MessageParam>;

    if (text.includes(splitPhrase)) {
      const splitIndex = text.indexOf(splitPhrase);
      beforeText = text.substring(0, splitIndex);
      text = text.substring(splitIndex);

      const beforeTextContent: any = {
        type: "text",
        text: beforeText,
      };

      if (this.cacheControl) {
        beforeTextContent.cache_control = {
          type: this.cacheControl.type || "ephemeral",
        };
      }

      messages = [
        {
          role: "user",
          content: [
            beforeTextContent,
            {
              type: "text",
              text: text,
            },
          ],
        },
      ];
    } else {
      messages = [{ role: "user", content: text }];
    }

    if (conversationId && this.messageHistory.has(conversationId)) {
      messages = [...this.messageHistory.get(conversationId)!, ...messages];
    }

    const response = await this.anthropic.messages.create({
      ...(this.systemPrompt ? { system: this.systemPrompt } : {}),
      messages,
      model: this.model,
      max_tokens: this.maxTokensPerMessage,
      temperature: this.temperature,
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
