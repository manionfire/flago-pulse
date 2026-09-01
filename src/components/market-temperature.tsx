const STATUS_STYLES: Record<string, string> = {
  QUIET: "bg-flago-light-gray text-flago-dark/60",
  STEADY: "bg-flago-yellow/20 text-flago-dark",
  ACTIVE: "bg-flago-yellow text-flago-dark",
  "HIGH ACTIVITY": "bg-flago-red text-white",
};

interface TemperatureRow {
  level: string;
  count: number;
  avgStrength: number;
  status: string;
}

export function MarketTemperature({ rows }: { rows: TemperatureRow[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {rows.map((row) => (
        <div key={row.level} className="border border-flago-light-gray rounded-lg p-4">
          <p className="text-xs uppercase tracking-wide text-flago-dark/50 font-medium">{row.level}</p>
          <span
            className={`inline-block mt-2 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide ${
              STATUS_STYLES[row.status] ?? STATUS_STYLES.QUIET
            }`}
          >
            {row.status}
          </span>
          <p className="mt-2 text-xs text-flago-dark/50">
            {row.count} signal{row.count === 1 ? "" : "s"} · last 48h
          </p>
        </div>
      ))}
    </div>
  );
}
