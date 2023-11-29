import { parse, print } from "graphql";
import OpenAI from "openai";

export interface GQLPTClientOptions {
  apiKey: string;
  typeDefs: string;
}

export class GQLPTClient {
  private options: GQLPTClientOptions;
  private openai: OpenAI;

  constructor(options: GQLPTClientOptions) {
    this.options = options;

    try {
      parse(options.typeDefs);
    } catch (error) {
      throw new Error(`Cannot parse typeDefs ${error}`);
    }

    if (!this.options.apiKey) {
      throw new Error("Missing OpenAI Key");
    }

    this.openai = new OpenAI({
      apiKey: this.options.apiKey,
    });
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

  async generate(plainText: string): Promise<{
    query: string;
    variables?: Record<string, unknown>;
  }> {
    const query = `
      With this graphql schema: '${this.options.typeDefs}',
      and this question: '${plainText}',  
      generate a JSON object, where 'query' is a GraphQL query
      and 'variables' is a object containing all the variables. 
      Dont add any more text or formating to your response, I will JSON parse the text.
    `;

    const response = await this.openai.chat.completions.create({
      messages: [{ role: "user", content: query }],
      model: "gpt-3.5-turbo-1106",
      response_format: { type: "json_object" },
    });
    const content = response.choices[0].message.content;

    const result = JSON.parse((content || "").replace(/`/g, "")) as {
      query: string;
      variables?: Record<string, unknown>;
    };
    const queryAst = parse(result.query, { noLocation: true });
    const printedQuery = print(queryAst);

    return {
      query: printedQuery,
      variables: result.variables,
    };
  }
}
