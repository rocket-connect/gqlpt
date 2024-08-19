import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

import { AdapterOpenAI } from "../src";

dotenv.config();

describe("AdapterOpenAI", () => {
  test("should be defined", async () => {
    expect(() => {
      new AdapterOpenAI({
        apiKey: "123",
      });
    }).toBeDefined();
  });
});
