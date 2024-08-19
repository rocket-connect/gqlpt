import { parse, print } from "graphql";
import { Adapter } from "@gqlpt/adapter-base";

export interface GQLPTClientOptions {
  typeDefs: string;
  adapter: Adapter;
}

export class GQLPTClient {
  private options: GQLPTClientOptions;

  constructor(options: GQLPTClientOptions) {
    this.options = options;

    if(!options.adapter) {
      throw new Error("Missing adapter");
    }

    try {
      parse(options.typeDefs);
    } catch (error) {
      throw new Error(`Cannot parse typeDefs ${error}`);
    }
  }

  async connect() {
    await this.options.adapter.connect();
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

    const response = await this.options.adapter.sendText(query);

    const result = JSON.parse((response || "").replace(/`/g, "")) as {
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
