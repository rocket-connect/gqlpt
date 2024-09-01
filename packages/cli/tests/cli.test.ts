import { AdapterAnthropic } from "@gqlpt/adapter-anthropic";
import { AdapterOpenAI } from "@gqlpt/adapter-openai";

import dotenv from "dotenv";

import { generate } from "../src/commands/generate";

dotenv.config();

const TEST_OPENAI_API_KEY = process.env.TEST_OPENAI_API_KEY as string;
const TEST_ANTHROPIC_API_KEY = process.env.TEST_ANTHROPIC_API_KEY as string;

const adapters = [
  {
    name: "openai",
    apiKeyEnvKey: "OPENAI_API_KEY",
    adapter: new AdapterOpenAI({ apiKey: TEST_OPENAI_API_KEY }),
  },
  {
    name: "anthropic",
    apiKeyEnvKey: "ANTHROPIC_API_KEY",
    adapter: new AdapterAnthropic({ apiKey: TEST_ANTHROPIC_API_KEY }),
  },
];

adapters.forEach(({ name, apiKeyEnvKey }) => {
  describe(`generate with ${name} Adapter`, () => {
    test(`should throw missing ${apiKeyEnvKey}`, async () => {
      let oldEnv: string | undefined = undefined;
      oldEnv = process.env[apiKeyEnvKey];

      try {
        delete process.env.OPENAI_API_KEY;
        await expect(async () => {
          await generate.parseAsync([
            "generate",
            "--source",
            "test",
            "--adapter",
            name,
          ]);
        }).rejects.toThrow(`process.env.${apiKeyEnvKey} is required`);
      } finally {
        process.env[apiKeyEnvKey] = oldEnv;
      }
    });
  });
});
