import { describe, expect, it } from "vitest";
import { scoreSignal } from "./scoring";

describe("scoreSignal", () => {
  it("scores a highly relevant, fresh, credible item as a MAJOR SIGNAL", () => {
    const result = scoreSignal({
      sourceCredibility: 95,
      publishedAt: new Date(),
      tanzaniaRelevance: 90,
      flagoRelevance: 90,
      marketImpact: 90,
    });

    expect(result.classification).toBe("MAJOR SIGNAL");
    expect(result.signalStrength).toBeGreaterThanOrEqual(80);
  });

  it("scores a low-relevance item as BACKGROUND", () => {
    const result = scoreSignal({
      sourceCredibility: 45,
      publishedAt: new Date(),
      tanzaniaRelevance: 5,
      flagoRelevance: 5,
      marketImpact: 10,
    });

    expect(result.classification).toBe("BACKGROUND");
    expect(result.signalStrength).toBeLessThan(50);
  });

  it("decays recency to 0 for items older than a week", () => {
    const weekOld = new Date(Date.now() - 8 * 24 * 60 * 60 * 1000);
    const fresh = new Date();

    const old = scoreSignal({
      sourceCredibility: 80,
      publishedAt: weekOld,
      tanzaniaRelevance: 80,
      flagoRelevance: 80,
      marketImpact: 80,
    });
    const new_ = scoreSignal({
      sourceCredibility: 80,
      publishedAt: fresh,
      tanzaniaRelevance: 80,
      flagoRelevance: 80,
      marketImpact: 80,
    });

    expect(old.recency).toBe(0);
    expect(new_.recency).toBe(100);
    expect(old.signalStrength).toBeLessThan(new_.signalStrength);
  });

  it("treats an unknown publish date as moderate recency rather than 0 or 100", () => {
    const result = scoreSignal({
      sourceCredibility: 80,
      publishedAt: null,
      tanzaniaRelevance: 80,
      flagoRelevance: 80,
      marketImpact: 80,
    });

    expect(result.recency).toBe(40);
  });

  it("clamps signal strength to [0, 100]", () => {
    const result = scoreSignal({
      sourceCredibility: 100,
      publishedAt: new Date(),
      tanzaniaRelevance: 100,
      flagoRelevance: 100,
      marketImpact: 100,
    });

    expect(result.signalStrength).toBeLessThanOrEqual(100);
  });
});
