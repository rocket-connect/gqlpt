import { Adapter } from "@gqlpt/adapter-base";
import { introspection } from "@gqlpt/utils";

import { buildClientSchema, parse, print, printSchema } from "graphql";

export interface GQLPTClientOptions {
  url?: string;
  headers?: Record<string, string>;
  typeDefs?: string;
  adapter: Adapter;
}

export class GQLPTClient {
  private options: GQLPTClientOptions;

  constructor(options: GQLPTClientOptions) {
    this.options = options;

    if (!options.adapter) {
      throw new Error("Missing adapter");
    }

    if (!options.typeDefs && !options.url) {
      throw new Error("Missing typeDefs or url");
    }

    if (options.typeDefs) {
      try {
        parse(options.typeDefs);
      } catch (error) {
        throw new Error(`Cannot parse typeDefs ${error}`);
      }
    }
  }

  public getTypeDefs() {
    return this.options.typeDefs;
  }

  async connect() {
    await this.options.adapter.connect();

    if (this.options.url) {
      const response = await introspection({
        url: this.options.url,
        headers: this.options.headers,
      });

      const schema = buildClientSchema(response.data);

      this.options.typeDefs = printSchema(schema);
    }
  }

  async generateQueryAndVariables(plainText: string): Promise<{
    query: string;
    variables?: Record<string, unknown>;
  }> {
    if (!this.options.typeDefs) {
      throw new Error("Missing typeDefs");
    }

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
