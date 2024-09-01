import { generate } from "../src/commands/generate";

describe("generate", () => {
  const consoleErrorSpy = jest
    .spyOn(console, "error")
    .mockImplementation(() => {});

  const processExitSpy = jest
    .spyOn(process, "exit")
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    .mockImplementation(() => {});

  afterEach(() => {
    consoleErrorSpy.mockClear();
    processExitSpy.mockClear();
  });

  test("should throw missing OPENAI_AI_KEY ", async () => {
    const oldEnv = process.env.OPENAI_AI_KEY;

    try {
      delete process.env.OPENAI_AI_KEY;
      await expect(async () => {
        await generate.parseAsync(["generate"]);
      }).rejects.toThrow("process.env.OPENAI_API_KEY is required");
    } finally {
      process.env.OPENAI_AI_KEY = oldEnv;
    }
  });
});
