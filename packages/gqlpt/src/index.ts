import { Adapter } from "@gqlpt/adapter-base";
import { introspection, postGeneratedQuery } from "@gqlpt/utils";

import { buildClientSchema, parse, print, printSchema } from "graphql";

import { DefaultTypeMap, GeneratedTypeMap } from "./types";

export interface GQLPTClientOptions {
  url?: string;
  headers?: Record<string, string>;
  typeDefs?: string;
  adapter: Adapter;
}

type MergedTypeMap = GeneratedTypeMap & DefaultTypeMap;

export class GQLPTClient<T extends MergedTypeMap = MergedTypeMap> {
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
      Make sure you declare all the graphql variables in the query.
      Only traverse nested objects if they are explicitly requested.
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

  async generateAndSend<Q extends string>(
    plainText: Q,
    {
      urlOverride,
      headersOverride,
    }: {
      urlOverride?: string;
      headersOverride?: Record<string, string>;
    } = {},
  ): Promise<Q extends keyof T ? T[Q] : any> {
    if (!this.options.url && !urlOverride) {
      throw new Error("Missing url");
    }

    const { query, variables } =
      await this.generateQueryAndVariables(plainText);

    const response = await postGeneratedQuery({
      query,
      variables,
      url: (urlOverride || this.options.url) as string,
      headers: headersOverride || this.options.headers,
    });

    return response as Q extends keyof T ? T[Q] : any;
  }
}
