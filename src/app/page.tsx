import { Header } from "@/components/header";
import { MarketTemperature } from "@/components/market-temperature";
import { SignalCard } from "@/components/signal-card";
import { getMarketTemperature, getSignalCounts, getTopSignals } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [temperature, signalList, totalSignals] = await Promise.all([
    getMarketTemperature(),
    getTopSignals(20),
    getSignalCounts(),
  ]);

  const topFive = signalList.slice(0, 5);
  const rest = signalList.slice(5);

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10 space-y-12">
        <section className="space-y-4">
          <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-flago-dark/50">
            Market Temperature
          </h2>
          <MarketTemperature rows={temperature} />
        </section>

        {signalList.length === 0 ? (
          <EmptyState totalSignals={totalSignals} />
        ) : (
          <>
            <section className="space-y-4">
              <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-flago-dark/50">
                Today&apos;s Pulse — Top {topFive.length} Signals
              </h2>
              <div className="grid md:grid-cols-2 gap-5">
                {topFive.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>
            </section>

            {rest.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-heading font-bold text-sm uppercase tracking-wide text-flago-dark/50">
                  More Signals
                </h2>
                <div className="grid md:grid-cols-2 gap-5">
                  {rest.map((signal) => (
                    <SignalCard key={signal.id} signal={signal} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}

function EmptyState({ totalSignals }: { totalSignals: number }) {
  return (
    <div className="border border-dashed border-flago-light-gray rounded-xl p-10 text-center space-y-2">
      <p className="font-heading font-bold text-lg">No signals yet</p>
      <p className="text-sm text-flago-dark/60 max-w-md mx-auto">
        {totalSignals === 0
          ? "Run ingestion to fetch and classify the first batch of intelligence: POST /api/ingest."
          : "Signals exist but none matched the current view."}
      </p>
    </div>
  );
}
