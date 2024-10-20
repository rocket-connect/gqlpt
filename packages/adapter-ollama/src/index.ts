import { Adapter } from "@gqlpt/adapter-base";

import { Ollama } from "ollama";

interface AdapterOllamaOptions {
  baseUrl?: string;
  model?: string;
}

export class AdapterOllama implements Adapter {
  private ollama: Ollama;
  private model: string;
  public didPrime = false;

  constructor(options: AdapterOllamaOptions = {}) {
    if (!options.baseUrl || !options.model) {
      throw new Error(
        "AdapterOllama requires a baseUrl and model to be provided.",
      );
    }

    this.ollama = new Ollama({ host: options.baseUrl });
    this.model = options.model || "llama2";
  }

  async connect({
    typeDefs,
    shouldSkipPrime,
  }: {
    typeDefs?: string;
    shouldSkipPrime?: boolean;
  }): Promise<void> {
    if (shouldSkipPrime) {
      return;
    }

    const primePrompt = `
      You are a GraphQL query generator. Your task is to generate valid GraphQL queries based on natural language inputs.
      Here is the GraphQL schema you should use:

      ${typeDefs}

      Remember this schema for all future queries. Do not output the schema in your responses.
    `;

    await this.ollama.generate({
      model: this.model,
      prompt: primePrompt,
      system: "You are a helpful GraphQL query generator assistant.",
    });

    console.log("Ollama primed!");
    this.didPrime = true;
  }

  async sendText(prompt: string): Promise<string> {
    const fullPrompt = this.didPrime
      ? `Based on the GraphQL schema I provided earlier, ${prompt}`
      : prompt;

    const response = await this.ollama.generate({
      model: this.model,
      prompt: fullPrompt,
      system: "You are a helpful GraphQL query generator assistant.",
    });

    console.log("Ollama response", response.response);

    return response.response;
  }

  setModel(model: string): void {
    this.model = model;
  }
}
