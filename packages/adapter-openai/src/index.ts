import { Adapter } from "@gqlpt/adapter-base";

import OpenAI, { ClientOptions } from "openai";

export type AdapterOpenAIOptions = ClientOptions;

export class AdapterOpenAI extends Adapter {
  private openai: OpenAI;

  constructor(options: AdapterOpenAIOptions) {
    super();

    this.openai = new OpenAI(options);
  }

  async connect() {
    const response = await this.openai.chat.completions.create({
      messages: [
        { role: "user", content: "When I say Ping, return exactly Pong" },
        {
          role: "user",
          content: "Ping",
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const content = response.choices[0].message.content;
    if (content !== "Pong") {
      throw new Error("Cannot connect to OpenAI");
    }
  }

  async sendText(text: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: text }],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });

    const content = response?.choices[0]?.message?.content || "";

    return content;
  }
}
