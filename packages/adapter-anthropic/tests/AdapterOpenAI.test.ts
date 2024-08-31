import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";

import { AdapterAnthropic } from "../src";

dotenv.config();

describe("AdapterAnthropic", () => {
  test("should be defined", async () => {
    expect(() => {
      new AdapterAnthropic({
        apiKey: "123",
      });
    }).toBeDefined();
  });
});
