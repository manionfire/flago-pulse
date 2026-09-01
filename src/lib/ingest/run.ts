import "dotenv/config";
import { ingestAllSources } from "./rss";
import { processUnclassifiedContent } from "./process";

async function main() {
  const fetchResults = await ingestAllSources();
  console.log("Fetch results:", fetchResults);

  const processResult = await processUnclassifiedContent(40);
  console.log("Process result:", processResult);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
