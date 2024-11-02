import { Adapter } from "@gqlpt/adapter-base";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import dotenv from "dotenv";
import { GQLPTClient } from "gqlpt";
import path from "path";

import { generate } from "../src/commands/generate";

dotenv.config();

const OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;

describe("generate", () => {
  const fixturePath = path.resolve(__dirname, "fixture/");
  const schemaPath = path.resolve(fixturePath, "schema.gql");

  test("should generate types and queries with openai adapter", async () => {
    const adapter = new AdapterOpenAI({
      apiKey: OPENAI_API_KEY,
    });

    const connectionSpy = jest
      .spyOn(GQLPTClient.prototype, "getAdapter")
      .mockReturnValue({
        messageHistory: new Map(),
        openai: adapter.openai,
        connect: jest.fn(),
        sendText: adapter.sendText,
      } as unknown as Adapter);

    const stdMock = jest.spyOn(process.stdout, "write").mockImplementation();

    try {
      await generate.parseAsync([
        "generate",
        "--source",
        fixturePath,
        "--typeDefs",
        schemaPath,
        "--adapter",
        "openai",
        "--key",
        OPENAI_API_KEY,
        "--raw",
      ]);

      expect(stdMock.mock.calls[0]?.[0]).toMatchSnapshot("First call output");

      // Without this the second mock call will be empty - could be a bug in jest
      stdMock.mockClear();

      await generate.parseAsync([
        "generate",
        "--source",
        fixturePath,
        "--typeDefs",
        schemaPath,
        "--adapter",
        "openai",
        "--key",
        OPENAI_API_KEY,
        "--rawgen",
      ]);

      expect(stdMock.mock.calls[1]?.[0]).toMatchSnapshot("Second call output");
    } finally {
      stdMock.mockRestore();
      connectionSpy.mockRestore();
    }
  });
});
