import { Header } from "@/components/header";
import { NotConfigured, LoadError } from "@/components/setup-states";
import { getSourceRegistry } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  if (!process.env.DATABASE_URL) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10">
          <NotConfigured />
        </main>
      </>
    );
  }

  let sourceList: Awaited<ReturnType<typeof getSourceRegistry>>;

  try {
    sourceList = await getSourceRegistry();
  } catch (err) {
    return (
      <>
        <Header />
        <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10">
          <LoadError message={err instanceof Error ? err.message : String(err)} />
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="flex-1 mx-auto max-w-6xl w-full px-6 py-10 space-y-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">Source Registry</h1>
          <p className="text-sm text-flago-dark/60 mt-1">
            {sourceList.length} active sources feeding the ingestion pipeline. Add more by inserting
            rows into the <code className="bg-flago-light-gray px-1 rounded">sources</code> table.
          </p>
        </div>

        <div className="overflow-x-auto border border-flago-light-gray rounded-xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-flago-light-gray text-left text-xs uppercase tracking-wide text-flago-dark/60">
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Region</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3 font-semibold">Credibility</th>
                <th className="px-4 py-3 font-semibold">Last checked</th>
              </tr>
            </thead>
            <tbody>
              {sourceList.map((source) => (
                <tr key={source.id} className="border-t border-flago-light-gray">
                  <td className="px-4 py-3">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium hover:text-flago-red transition-colors"
                    >
                      {source.name}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-flago-dark/70">{source.region}</td>
                  <td className="px-4 py-3 text-flago-dark/70">{source.category}</td>
                  <td className="px-4 py-3 text-flago-dark/70 capitalize">{source.sourceType}</td>
                  <td className="px-4 py-3 text-flago-dark/70">{source.credibilityScore}</td>
                  <td className="px-4 py-3 text-flago-dark/50">
                    {source.lastCheckedAt ? new Date(source.lastCheckedAt).toLocaleString() : "never"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
