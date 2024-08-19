import { describe, expect, test } from "@jest/globals";
import dotenv from "dotenv";
import { Adapter } from "../src";

dotenv.config();

describe("Adapter", () => {
  test("should be defined", async () => {
    expect(Adapter).toBeDefined();
  });
});
