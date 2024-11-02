export const QUERY_GENERATION_RULES = `
Rules for generating the GraphQL query:
1. Structure:
   - Start with the operation type (query, mutation, or subscription).
   - Do not include an operation name.
   - Declare all GraphQL variables at the top of the query.

2. Fields:
   - Only include fields that are explicitly requested or necessary for the query, however, if a 'id' field is available, it should be included.
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
- Ensure that if the input type is required in the schema, it is also required in the query.
`;

export const TYPE_GENERATION_RULES = `
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

export const JSON_RESPONSE_FORMAT = `
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

export const QUERY_JSON_RESPONSE_FORMAT = `
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
