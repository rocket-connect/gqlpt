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

const QUERY_GENERATION_RULES = `
  Rules for generating the GraphQL query:
  - Declare all GraphQL variables in the query.
  - Only traverse nested objects if they are explicitly requested.
`;

const TYPE_GENERATION_RULES = `
  Rules for generating the TypeScript type definition:
  1. Use TypeScript syntax
  2. Nest types inline (don't use separate interface declarations)
  3. Use specific types (string, number, boolean) where appropriate
  4. Use arrays ([]) when a field can return multiple items, ensure the format is Type[] 'field: { id: string; name: string; }[]'
  5. Make properties optional (?) if they might not always be present
  6. Use 'any' only as a last resort for unknown types
  7. Include an optional 'errors' array of type 'any[]'
  8. Wrap the main query result in a 'data' property
  9. Do not include 'type QueryResponse =' or any other type alias in your response
  10. Provide the type definition as a plain object type
`;

const JSON_RESPONSE_FORMAT = `
  Provide your response in the following JSON format:
  {
    "query": "The generated GraphQL query",
    "variables": { "key": "value" },
    "typeDefinition": "The TypeScript type definition as a plain object type"
  }

  Example of the expected format for typeDefinition:
  "typeDefinition": "{ errors?: any[]; data: { user: { id: string; name: string; } } }"

  Do not include any additional text or formatting outside of this JSON object.
`;

const QUERY_JSON_RESPONSE_FORMAT = `
  Provide your response in the following JSON format:
  {
    "query": "The generated GraphQL query",
    "variables": { "key": "value" }
  }

  Do not include any additional text or formatting outside of this JSON object.
`;

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
      Given the following GraphQL schema:
      
      ${this.compressTypeDefs(this.options.typeDefs)}

      And this plain text query:
      "${plainText}"

      Please perform the following tasks:

      1. Generate a GraphQL query that answers the plain text query.
      2. Provide any necessary variables for the query.

      ${QUERY_GENERATION_RULES}

      ${QUERY_JSON_RESPONSE_FORMAT}
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

  async generateQueryAndTypeForBuild(plainText: string): Promise<{
    query: string;
    variables?: Record<string, unknown>;
    typeDefinition: string;
  }> {
    if (!this.options.typeDefs) {
      throw new Error("Missing typeDefs");
    }

    const query = `
      Given the following GraphQL schema:
      
      ${this.compressTypeDefs(this.options.typeDefs)}

      And this plain text query:
      "${plainText}"

      Please perform the following tasks:

      1. Generate a GraphQL query that answers the plain text query.
      2. Provide any necessary variables for the query.
      3. Based on the generated query, create a TypeScript type definition that represents the expected structure of the query result.

      ${QUERY_GENERATION_RULES}

      ${TYPE_GENERATION_RULES}

      ${JSON_RESPONSE_FORMAT}
    `;

    const response = await this.options.adapter.sendText(query);

    const result = JSON.parse(response) as {
      query: string;
      variables?: Record<string, unknown>;
      typeDefinition: string;
    };

    const queryAst = parse(result.query, { noLocation: true });
    const printedQuery = print(queryAst);

    return {
      query: printedQuery,
      variables: result.variables,
      typeDefinition: result.typeDefinition,
    };
  }

  private compressTypeDefs(typeDefs: string): string {
    return typeDefs
      .replace(/[\s\t]+/g, " ") // Replace multiple whitespaces and tabs with a single space
      .replace(/"\s+/g, '"') // Remove spaces after quotes
      .replace(/\s+"/g, '"') // Remove spaces before quotes
      .replace(/\\n/g, "") // Remove newline characters
      .replace(/\s*#.*$/gm, "") // Remove comments
      .trim(); // Trim leading and trailing whitespace
  }
}
