import { Adapter, AdapterResponse } from "@gqlpt/adapter-base";

import Anthropic, { ClientOptions } from "@anthropic-ai/sdk";
import { MessageParam } from "@anthropic-ai/sdk/src/resources/messages";

export type AdapterAnthropicOptions = ClientOptions;
export const model = "claude-3-5-sonnet-20240620";

export class AdapterAnthropic extends Adapter {
  private anthropic: Anthropic;
  private messageHistory: Map<string, MessageParam[]> = new Map();

  constructor(options: AdapterAnthropicOptions) {
    super();
    this.anthropic = new Anthropic(options);
  }

  async connect() {
    const response = await this.anthropic.messages.create({
      system:
        "You are to test the connection to the Anthropic API. Respond with 'Pong' when you see 'Ping'.",
      messages: [{ role: "user", content: "Ping" }],
      model,
      max_tokens: 1024,
    });

    if ((response.content[0] as any).text !== "Pong") {
      throw new Error("Cannot connect to Anthropic");
    }
  }

  async sendText(
    text: string,
    conversationId?: string,
  ): Promise<AdapterResponse> {
    let messages: MessageParam[] = [{ role: "user", content: text }];

    if (conversationId && this.messageHistory.has(conversationId)) {
      messages = [...this.messageHistory.get(conversationId)!, ...messages];
    }

    const response = await this.anthropic.messages.create({
      messages,
      model,
      max_tokens: 1024,
    });

    const content = (response.content[0] as any).text;
    const newId = response.id;

    this.messageHistory.set(newId, [
      ...(conversationId ? this.messageHistory.get(conversationId) || [] : []),
      { role: "user" as const, content: text },
      { role: "assistant" as const, content },
    ]);

    return {
      content,
      conversationId: newId,
    };
  }
}
