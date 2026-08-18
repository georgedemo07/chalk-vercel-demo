import { mkdir, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

const repository =
  process.env.GITHUB_REPOSITORY ?? "local-development";

const commit =
  process.env.GITHUB_SHA ?? "local-development";

const branch =
  process.env.GITHUB_REF_NAME ?? "local";

const workflow =
  process.env.GITHUB_WORKFLOW ?? "Local Development";

const runId =
  process.env.GITHUB_RUN_ID ?? null;

const serverUrl =
  process.env.GITHUB_SERVER_URL ?? null;

const runUrl =
  serverUrl && runId
    ? `${serverUrl}/${repository}/actions/runs/${runId}`
    : null;

const metadata = {
  repository,
  commit,
  branch,
  buildTimestamp: new Date().toISOString(),
  workflow,
  runId,
  runUrl,
};

await mkdir("public/provenance", {
  recursive: true,
});

await writeFile(
  "public/provenance/build.json",
  JSON.stringify(metadata, null, 2),
  "utf8"
);

await writeFile(
  "public/provenance/marker.js",
  `#!/usr/bin/env node\nglobalThis.__BUILD_PROVENANCE__ = ${JSON.stringify(metadata)};\n`,
  "utf8"
);

// Create a history of the five most recent Git commits.
let history = [];

try {
  const gitLog = execFileSync(
    "git",
    [
      "log",
      "-5",
      "--pretty=format:%H%x1f%h%x1f%cI%x1f%s",
    ],
    {
      encoding: "utf8",
    }
  );

  history = gitLog
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [
        fullCommit,
        shortCommit,
        date,
        message,
      ] = line.split("\x1f");

      return {
        commit: fullCommit,
        shortCommit,
        date,
        message,
      };
    });
} catch (error) {
  console.warn(
    "Could not generate Git history:",
    error.message
  );
}

await writeFile(
  "public/provenance/history.json",
  JSON.stringify(history, null, 2),
  "utf8"
);

console.log("Build provenance information created.");
console.log(
  `Provenance timeline created with ${history.length} commits.`
);