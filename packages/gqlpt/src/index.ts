import { Adapter } from "@gqlpt/adapter-base";
import {
  clearOperationNames,
  compressTypeDefs,
  hashTypeDefs,
  introspection,
  postGeneratedQuery,
} from "@gqlpt/utils";

import { promises } from "fs";
import {
  GraphQLSchema,
  buildClientSchema,
  buildSchema,
  graphql,
  lexicographicSortSchema,
  parse,
  print,
  printSchema,
} from "graphql";
import path from "path";

import { DefaultTypeMap, GeneratedTypeMap } from "./types";

export interface GQLPTClientOptions {
  url?: string;
  headers?: Record<string, string>;
  typeDefs?: string;
  schema?: GraphQLSchema;
  adapter: Adapter;
  generatedPath?: string;
}

type MergedTypeMap = GeneratedTypeMap & DefaultTypeMap;

const QUERY_GENERATION_RULES = `
Rules for generating the GraphQL query:
1. Structure:
   - Start with the operation type (query, mutation, or subscription).
   - Do not include an operation name.
   - Declare all GraphQL variables at the top of the query.

2. Fields:
   - Only include fields that are explicitly requested or necessary for the query.
   - For nested objects, only traverse if specifically asked or crucial for the query.

3. Arguments and Input Types:
   - Always check if there's a defined input type for arguments.
   - If an input type exists (e.g., UserWhereInput), use it as the variable type and in the query.
   - Use the exact field and argument names as defined in the schema.
   - For variable arguments, use $variableName syntax.
   - Examples:
     - If schema defines: users(where: UserWhereInput): [User]
       Use: query($where: UserWhereInput) { users(where: $where) { ... } }
     - If no input type is defined: user(id: ID!): User
       Use: query($id: ID!) { user(id: $id) { ... } }

4. Variables:
   - Define all variables used in the query with their correct types.
   - For input types, declare the variable as the input type, not as an inline object.

5. Formatting:
   - Use consistent indentation (2 spaces) for nested fields.
   - Place each field and argument on a new line.

6. Fragments:
   - Only use fragments if explicitly requested or if it significantly improves query readability.

7. Always prefer input types when available:
- Correct:   query($where: UserWhereInput) { users(where: $where) { id name } }
- Incorrect: query($name: String) { users(where: { name: $name }) { id name } }
`;

const TYPE_GENERATION_RULES = `
Rules for generating the TypeScript type definition:
1. Structure:
   - Use TypeScript syntax.
   - Provide the type definition as a plain object type.
   - Wrap the main query result in a 'data' property.
   - Include an optional 'errors' array of type 'any[]'.
2. Nesting:
   - Nest types inline (don't use separate interface declarations).
3. Types:
   - Use specific types (string, number, boolean) where appropriate.
   - Use 'any' only as a last resort for unknown types.
4. Arrays:
   - Use Type[] syntax for arrays, e.g., 'field: { id: string; name: string; }[]'.
5. Optionality:
   - Make properties optional (?) if the schema field does not have a !.
   - If the operation return type is required (annotated with !), make the 'data' property required.
   - If the operation return type is optional, make the 'data' property optional using ?.
6. Ordering:
   - Place the 'data' type before the 'errors' type.
7. Example formats:
   - Required data: { data: { user: { id: string; name: string; } }; errors?: any[]; }
   - Optional data: { data?: { user: { id: string; name: string; } }; errors?: any[]; }
8. Do not include:
   - Type aliases (e.g., 'type QueryResponse =').
   - Separate interface declarations.
`;

const JSON_RESPONSE_FORMAT = `
Provide your response in the following JSON format:
{
  "query": "The generated GraphQL query",
  "variables": { "key": "value" },
  "typeDefinition": "The TypeScript type definition as a plain object type"
}

Examples:
{
  "query": "query($where: UserWhereInput) { users(where: $where) { id name email } }",
  "variables": { "where": { "name": "John" } },
  "typeDefinition": "{ data: { users: { id: string; name: string; email: string; }[] }; errors?: any[]; }"
}

{
  "query": "query($where: PostWhereUniqueInput!, $data: PostUpdateInput!) { updatePost(where: $where, data: $data) { id title content } }",
  "variables": { 
    "where": { "id": "123" },
    "data": { "title": "Updated Title", "content": "New content" }
  },
  "typeDefinition": "{ data: { updatePost: { id: string; title: string; content: string; } }; errors?: any[]; }"
}

{
  "query": "query($id: ID!) { user(id: $id) { name posts { id title } } }",
  "variables": { "id": "456" },
  "typeDefinition": "{ data: { user: { name: string; posts: { id: string; title: string; }[] } }; errors?: any[]; }"
}

Do not include any additional text or formatting outside of this JSON object.
`;

const QUERY_JSON_RESPONSE_FORMAT = `
Provide your response in the following JSON format:
{
  "query": "The generated GraphQL query",
  "variables": { "key": "value" }
}

Example:
{
  "query": "query($id: ID!) { user(id: $id) { id name email } }",
  "variables": { "id": "123" }
}

Do not include any additional text or formatting outside of this JSON object.
`;

export class GQLPTClient<T extends MergedTypeMap = MergedTypeMap> {
  options: GQLPTClientOptions;
  schema?: GraphQLSchema;
  typeDefs?: string;
  schemaHash?: string;

  private queryMap: Record<
    string,
    {
      query: string;
      variables?: Record<string, unknown>;
    }
  > = {};

  constructor(options: GQLPTClientOptions) {
    this.options = options;

    if (!options.adapter) {
      throw new Error("Missing adapter");
    }

    if (!options.typeDefs && !options.url && !options.schema) {
      throw new Error("Missing typeDefs, url or schema");
    }

    if (options.typeDefs) {
      try {
        parse(options.typeDefs);
      } catch (error) {
        throw new Error(`Cannot parse typeDefs ${error}`);
      }
    }
  }

  getAdapter() {
    return this.options.adapter;
  }

  public getTypeDefs() {
    return this.typeDefs;
  }

  async connect() {
    await this.getAdapter().connect();

    if (this.options.typeDefs) {
      const schema = buildSchema(this.options.typeDefs);
      this.typeDefs = printSchema(schema);
      this.schema = lexicographicSortSchema(schema);
      this.schemaHash = await hashTypeDefs(this.options.typeDefs);
    } else if (this.options.url) {
      const response = await introspection({
        url: this.options.url,
        headers: this.options.headers,
      });

      const schema = buildClientSchema(response.data);
      this.schema = lexicographicSortSchema(schema);
      this.typeDefs = printSchema(this.schema);
      this.schemaHash = await hashTypeDefs(this.typeDefs);
    } else if (this.options.schema) {
      this.schema = lexicographicSortSchema(this.options.schema);
      this.typeDefs = printSchema(this.schema);
      this.schemaHash = await hashTypeDefs(this.typeDefs);
    }

    const generatedPath =
      this.options.generatedPath || "node_modules/gqlpt/build/generated.json";
    const resolvedGeneratedPath = path.resolve(process.cwd(), generatedPath);

    if (generatedPath) {
      try {
        const content = await promises.readFile(resolvedGeneratedPath, "utf-8");
        const jsonObj = JSON.parse(content);
        const schemaHashEntry = jsonObj[
          this.schemaHash || ("" as string)
        ] as any;

        if (schemaHashEntry) {
          Object.entries(schemaHashEntry).forEach(([key, value]) => {
            const v = value as {
              query: string;
              variables?: Record<string, unknown>;
            };

            this.queryMap[key] = {
              query: v.query,
              variables: v.variables,
            };
          });
        }
      } catch {
        // Do nothing
      }
    }
  }

  async generateQueryAndVariables(plainText: string): Promise<{
    query: string;
    variables?: Record<string, unknown>;
  }> {
    const typeDefs = this.getTypeDefs();
    if (!typeDefs) {
      throw new Error(
        "Missing typeDefs, url or schema - have you called connect?",
      );
    }

    const generated = this.queryMap[plainText];
    if (generated) {
      return {
        query: generated.query,
        variables: generated.variables,
      };
    }

    const query = `
      Given the following GraphQL schema:
      
      ${compressTypeDefs(typeDefs)}

      And this plain text query:
      "${plainText}"

      Please perform the following tasks:

      1. Generate a GraphQL query that answers the plain text query.
      2. Provide any necessary variables for the query.

      ${QUERY_GENERATION_RULES}

      ${QUERY_JSON_RESPONSE_FORMAT}
    `;

    const response = await this.getAdapter().sendText(query);

    const result = JSON.parse((response || "").replace(/`/g, "")) as {
      query: string;
      variables?: Record<string, unknown>;
    };
    const queryAst = parse(result.query, { noLocation: true });
    const newAst = clearOperationNames(queryAst);
    const printedQuery = print(newAst);

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
    if (!this.options.url && !urlOverride && !this.options.schema) {
      throw new Error("Missing url or schema to query");
    }

    const { query, variables } =
      await this.generateQueryAndVariables(plainText);

    let response: any;

    if (this.options.schema && this.schema) {
      const gqlResponse = await graphql({
        schema: this.schema as GraphQLSchema,
        source: query,
        variableValues: variables,
      });

      response = {
        data: gqlResponse.data,
        errors: gqlResponse.errors,
      };
    } else {
      response = await postGeneratedQuery({
        query,
        variables,
        url: (urlOverride || this.options.url) as string,
        headers: headersOverride || this.options.headers,
      });
    }

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
      
      ${compressTypeDefs(this.options.typeDefs)}

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

    const response = await this.getAdapter().sendText(query);

    const result = JSON.parse(response) as {
      query: string;
      variables?: Record<string, unknown>;
      typeDefinition: string;
    };

    const queryAst = parse(result.query, { noLocation: true });
    const newAst = clearOperationNames(queryAst);
    const printedQuery = print(newAst);

    return {
      query: printedQuery,
      variables: result.variables,
      typeDefinition: result.typeDefinition,
    };
  }
}
