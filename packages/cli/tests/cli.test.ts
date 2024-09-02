import dotenv from "dotenv";
import { GQLPTClient } from "gqlpt";
import path from "path";

import { generate } from "../src/commands/generate";

dotenv.config();

const OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;

const adapters = [
  {
    name: "openai",
    apiKeyEnvKey: "OPENAI_API_KEY",
  },
  {
    name: "anthropic",
    apiKeyEnvKey: "ANTHROPIC_API_KEY",
  },
];

describe("generate", () => {
  const fixturePath = path.resolve(__dirname, "fixture/");
  const schemaPath = path.resolve(fixturePath, "schema.gql");

  adapters.forEach(({ name, apiKeyEnvKey }) => {
    test(`should throw missing ${apiKeyEnvKey}`, async () => {
      let oldEnv: string | undefined = undefined;
      oldEnv = process.env[apiKeyEnvKey];

      try {
        delete process.env[apiKeyEnvKey];
        await expect(async () => {
          await generate.parseAsync([
            "generate",
            "--source",
            fixturePath,
            "--adapter",
            name,
            "--typeDefs",
            schemaPath,
          ]);
        }).rejects.toThrow();
      } finally {
        process.env[apiKeyEnvKey] = oldEnv;
      }
    });
  });

  test("should with generate types with openai adapter", async () => {
    const stdMock = jest.spyOn(process.stdout, "write").mockImplementation();

    const connectionSpy = jest
      .spyOn(GQLPTClient.prototype, "connect")
      .mockImplementation(async () => {});

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

      expect(connectionSpy).toHaveBeenCalledTimes(1);
      const content = stdMock.mock.calls[0][0];
      expect(content).toMatchSnapshot("");
    } finally {
      stdMock.mockRestore();
      connectionSpy.mockRestore();
    }
  });
});
