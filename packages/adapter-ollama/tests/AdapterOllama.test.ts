import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

import { AdapterOllama } from "../src";

dotenv.config();

describe("AdapterOllama", () => {
  test("should throw if baseUrl or model is not provided", async () => {
    expect(() => {
      new AdapterOllama();
    }).toThrow();
  });

  test("should be defined", async () => {
    expect(() => {
      new AdapterOllama({
        baseUrl: process.env.OLLAMA_BASE_URL,
        model: process.env.OLLAMA_MODEL,
      });
    }).toBeDefined();
  });
});
