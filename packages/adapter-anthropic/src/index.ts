import { Adapter } from "@gqlpt/adapter-base";

import Anthropic, { ClientOptions } from "@anthropic-ai/sdk";

export type AdapterAnthropicOptions = ClientOptions;

export const model = "claude-3-5-sonnet-20240620";

export class AdapterAnthropic extends Adapter {
  private anthropic: Anthropic;

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

  async sendText(text: string): Promise<string> {
    const response = await this.anthropic.messages.create({
      messages: [{ role: "user", content: text }],
      model,
      max_tokens: 1024,
    });

    const content = (response.content[0] as any).text;

    return content;
  }
}
