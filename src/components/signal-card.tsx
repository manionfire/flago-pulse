const TIER_STYLES: Record<string, string> = {
  "MAJOR SIGNAL": "bg-flago-red text-white",
  IMPORTANT: "bg-flago-yellow text-flago-dark",
  WATCH: "bg-flago-light-gray text-flago-dark",
  BACKGROUND: "bg-flago-light-gray text-flago-dark/60",
};

export interface SignalCardData {
  id: string;
  title: string;
  summary: string;
  category: string;
  country: string;
  signalStrength: number;
  confidence: string;
  classification: string;
  whyItMatters: string;
  flagoImplication: string;
  recommendedAction: string;
  industries: string[];
  sources: { name: string; url: string }[];
  sourceUrl: string;
  publishedAt: Date | null;
}

export function SignalCard({ signal }: { signal: SignalCardData }) {
  const date = signal.publishedAt
    ? new Date(signal.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
    : null;

  return (
    <article className="border border-flago-light-gray rounded-xl p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`px-2 py-1 rounded-md font-bold tracking-wide ${
              TIER_STYLES[signal.classification] ?? TIER_STYLES.WATCH
            }`}
          >
            {signal.classification}
          </span>
          <span className="text-flago-dark/50">{signal.category}</span>
          <span className="text-flago-dark/30">·</span>
          <span className="text-flago-dark/50">{signal.country}</span>
          {date && (
            <>
              <span className="text-flago-dark/30">·</span>
              <span className="text-flago-dark/50">{date}</span>
            </>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="font-heading font-extrabold text-2xl leading-none">{signal.signalStrength}</p>
          <p className="text-[10px] uppercase tracking-wide text-flago-dark/40 mt-0.5">
            {signal.confidence} confidence
          </p>
        </div>
      </div>

      <h3 className="font-heading font-bold text-lg leading-snug">{signal.title}</h3>
      <p className="text-sm text-flago-dark/70 leading-relaxed">{signal.summary}</p>

      <div className="space-y-3 text-sm">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-flago-red">Why it matters</p>
          <p className="text-flago-dark/80 mt-1">{signal.whyItMatters}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-flago-red">Flago implication</p>
          <p className="text-flago-dark/80 mt-1">{signal.flagoImplication}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-flago-red">Recommended action</p>
          <p className="text-flago-dark/80 mt-1">{signal.recommendedAction}</p>
        </div>
      </div>

      {signal.industries.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {signal.industries.map((industry) => (
            <span
              key={industry}
              className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-flago-light-gray text-flago-dark/70"
            >
              {industry}
            </span>
          ))}
        </div>
      )}

      <div className="pt-3 border-t border-flago-light-gray flex items-center justify-between">
        <a
          href={signal.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-medium text-flago-dark/50 hover:text-flago-red transition-colors truncate"
        >
          {signal.sources[0]?.name ?? "Source"} ↗
        </a>
      </div>
    </article>
  );
}
