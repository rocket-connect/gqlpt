import dotenv from "dotenv";
import { GQLPTClient } from "gqlpt";
import path from "path";

import { generate } from "../src/commands/generate";

dotenv.config();

const OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;

describe("generate", () => {
  const fixturePath = path.resolve(__dirname, "fixture/");
  const schemaPath = path.resolve(fixturePath, "schema.gql");

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
