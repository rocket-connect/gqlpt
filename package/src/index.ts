import { ChatGPTAPI, ChatMessage } from "chatgpt";
import { parse, print } from "graphql";

export interface GQLPTClientOptions {
  apiKey: string;
  typeDefs: string;
}

export class GQLPTClient {
  private options: GQLPTClientOptions;
  private chatgpt?: ChatGPTAPI;
  private initMessage?: ChatMessage;

  constructor(options: GQLPTClientOptions) {
    this.options = options;

    try {
      parse(options.typeDefs);
    } catch (error) {
      throw new Error(`Cannot parse typeDefs ${error}`);
    }

    this.chatgpt = new ChatGPTAPI({
      apiKey: this.options.apiKey,
    });
  }

  async connect() {
    this.initMessage = await this.chatgpt.sendMessage(
      `When I say Ping, you say Pong. Ping.`
    );
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

    const message = await this.chatgpt.sendMessage(query, {
      conversationId: this?.initMessage?.conversationId,
    });

    if (!this.initMessage) {
      this.initMessage = message;
    }

    console.log(message.text);
    const result = JSON.parse(message.text.replace(/`/g, "")) as {
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
