// Model abstraction: swap providers/models per task without touching call sites.
// A cheap/fast model classifies high volume; a stronger model is reserved for
// synthesis tasks (reports, Ask Pulse) once those ship.
export type AiTask = "classify" | "report" | "ask";

const DEFAULTS: Record<AiTask, string> = {
  classify: "claude-haiku-4-5-20251001",
  report: "claude-sonnet-5",
  ask: "claude-sonnet-5",
};

const ENV_OVERRIDES: Record<AiTask, string | undefined> = {
  classify: process.env.PULSE_CLASSIFY_MODEL,
  report: process.env.PULSE_REPORT_MODEL,
  ask: process.env.PULSE_ASK_MODEL,
};

export function getModel(task: AiTask): string {
  return ENV_OVERRIDES[task] || DEFAULTS[task];
}
