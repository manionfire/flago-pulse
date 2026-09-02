import { describe, expect, it } from "vitest";
import { classifySignalStrength } from "./taxonomy";

describe("classifySignalStrength", () => {
  it.each([
    [100, "MAJOR SIGNAL"],
    [80, "MAJOR SIGNAL"],
    [79, "IMPORTANT"],
    [65, "IMPORTANT"],
    [64, "WATCH"],
    [50, "WATCH"],
    [49, "BACKGROUND"],
    [0, "BACKGROUND"],
  ])("scores %i as %s", (score, expected) => {
    expect(classifySignalStrength(score)).toBe(expected);
  });
});
