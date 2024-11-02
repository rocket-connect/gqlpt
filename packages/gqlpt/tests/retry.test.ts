import { Adapter, AdapterResponse } from "@gqlpt/adapter-base";

import { describe, expect, test } from "@jest/globals";

import { GQLPTClient } from "../src";

function normalizeWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").replace(/\n/g, " ").trim();
}

class MockAdapter extends Adapter {
  private attempts = 0;
  private readonly prompts: string[] = [];
  private readonly conversationIds: string[] = [];

  async connect(): Promise<void> {}

  async sendText(
    text: string,
    conversationId?: string,
  ): Promise<AdapterResponse> {
    this.attempts++;
    this.prompts.push(text);
    this.conversationIds.push(conversationId || "");

    if (this.attempts <= 2) {
      return {
        content: JSON.stringify({
          query: "{ invalidField { id } }",
          variables: {},
        }),
        conversationId: "mock-conversation-id",
      };
    }

    return {
      content: JSON.stringify({
        query: "{ user { id name } }",
        variables: {},
      }),
      conversationId: "mock-conversation-id",
    };
  }

  getPrompts(): string[] {
    return this.prompts;
  }

  getConversationIds(): string[] {
    return this.conversationIds;
  }

  getAttempts(): number {
    return this.attempts;
  }
}

describe("GQLPTClient Retry Logic", () => {
  test("should send correct prompts and maintain conversation context during retries", async () => {
    const mockAdapter = new MockAdapter();

    const typeDefs = `
      type User {
        id: ID!
        name: String!
      }
      
      type Query {
        user: User!
      }
    `;

    const gqlpt = new GQLPTClient({
      adapter: mockAdapter,
      typeDefs,
      maxRetries: 5,
    });
    await gqlpt.connect();

    await gqlpt.generateQueryAndVariables("get user data");

    const prompts = mockAdapter.getPrompts();
    const conversationIds = mockAdapter.getConversationIds();

    const normalizedFirstPrompt = normalizeWhitespace(prompts[0]);
    expect(normalizedFirstPrompt).toContain(
      "Given the following GraphQL schema:",
    );
    expect(normalizedFirstPrompt).toContain("type User");
    expect(normalizedFirstPrompt).toContain("get user data");
    expect(conversationIds[0]).toBe("");

    const normalizedSecondPrompt = normalizeWhitespace(prompts[1]);
    expect(normalizedSecondPrompt).toContain(
      "The previous GraphQL query attempt:",
    );
    expect(normalizedSecondPrompt).toContain("{ invalidField { id } }");
    expect(normalizedSecondPrompt).toContain(
      "Failed with the following validation errors:",
    );
    expect(normalizedSecondPrompt).toContain(
      'Cannot query field "invalidField" on type "Query"',
    );
    expect(conversationIds[1]).toBe("mock-conversation-id");

    expect(mockAdapter.getAttempts()).toBe(3);
  });

  test("should throw error after max retries", async () => {
    const mockAdapter = new MockAdapter();
    const typeDefs = `
      type User {
        id: ID!
        name: String!
      }
      
      type Query {
        user: User!
      }
    `;

    const gqlpt = new GQLPTClient({
      adapter: mockAdapter,
      typeDefs,
      maxRetries: 1,
    });
    await gqlpt.connect();

    await expect(async () => {
      await gqlpt.generateQueryAndVariables("get user data");
    }).rejects.toThrow("Could not generate valid query after 1 attempts");

    expect(mockAdapter.getAttempts()).toBe(2);
    expect(mockAdapter.getConversationIds()).toEqual([
      "",
      "mock-conversation-id",
    ]);
  });

  test("should verify all inputs and outputs during retry sequence", async () => {
    const mockAdapter = new MockAdapter();
    const typeDefs = `
      type User {
        id: ID!
        name: String!
      }
      
      type Query {
        user: User!
      }
    `;

    const gqlpt = new GQLPTClient({
      adapter: mockAdapter,
      typeDefs,
      maxRetries: 5,
    });
    await gqlpt.connect();

    const result = await gqlpt.generateQueryAndVariables("get user data");

    expect(mockAdapter.getAttempts()).toBe(3);
    expect(normalizeWhitespace(result.query)).toBe(
      normalizeWhitespace("{ user { id name } }"),
    );
    expect(result.variables).toEqual({});

    const conversationIds = mockAdapter.getConversationIds();
    expect(conversationIds).toEqual([
      "",
      "mock-conversation-id",
      "mock-conversation-id",
    ]);

    const prompts = mockAdapter.getPrompts().map(normalizeWhitespace);
    expect(prompts[0]).toContain("Given the following GraphQL schema");
    expect(prompts[1]).toContain("Failed with the following validation errors");
    expect(prompts[2]).toContain("Failed with the following validation errors");
  });
});
