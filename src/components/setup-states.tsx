export function NotConfigured() {
  return (
    <div className="border border-dashed border-flago-light-gray rounded-xl p-10 text-center space-y-3 max-w-lg mx-auto">
      <p className="font-heading font-bold text-lg">Database not connected</p>
      <p className="text-sm text-flago-dark/60">
        Set <code className="bg-flago-light-gray px-1 rounded">DATABASE_URL</code> in your
        environment, then run:
      </p>
      <pre className="text-left text-xs bg-flago-dark text-white rounded-lg p-4 overflow-x-auto">
        {"npm run db:push\nnpm run db:seed\nnpm run ingest"}
      </pre>
    </div>
  );
}

export function LoadError({ message }: { message: string }) {
  return (
    <div className="border border-dashed border-flago-red/40 rounded-xl p-10 text-center space-y-3 max-w-lg mx-auto">
      <p className="font-heading font-bold text-lg text-flago-red">Couldn&apos;t load data</p>
      <p className="text-sm text-flago-dark/60">
        The database is configured but the query failed. This usually means the schema hasn&apos;t
        been pushed yet, or the connection string is wrong.
      </p>
      <pre className="text-left text-xs bg-flago-dark text-white rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
        {message}
      </pre>
    </div>
  );
}
