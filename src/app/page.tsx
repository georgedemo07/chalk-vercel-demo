"use client";

import { useEffect, useState } from "react";

type BuildData = {
  repository: string;
  commit: string;
  branch: string;
  buildTimestamp: string;
  workflow: string;
  runId: string | null;
  runUrl: string | null;
};

type ChalkData = {
  chalkId: string | null;
  chalkVersion: string | null;
  metadataId: string | null;
  artifactType: string | null;
  artifactHash: string | null;
  signaturePresent: boolean;
  signatureValidated: boolean;
};

type HistoryItem = {
  commit: string;
  shortCommit: string;
  date: string;
  message: string;
};

export default function Home() {
  const [build, setBuild] = useState<BuildData | null>(null);
  const [chalk, setChalk] = useState<ChalkData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
  fetch("/provenance/build.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Build metadata unavailable");
      }

      return response.json();
    })
    .then(setBuild)
    .catch(console.error);

  fetch("/provenance/chalk.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Chalk metadata unavailable");
      }

      return response.json();
    })
    .then(setChalk)
    .catch(() => {
      // Chalk information will not exist until the CI build.
    });

  fetch("/provenance/history.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Provenance history unavailable");
      }

      return response.json();
    })
    .then(setHistory)
    .catch(console.error);
}, []);

  const shortCommit =
    build?.commit && build.commit !== "local-development"
      ? build.commit.substring(0, 12)
      : build?.commit;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* HERO */}

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-6 inline-block rounded-full border border-blue-500/40 bg-blue-500/10 px-4 py-2 text-sm text-blue-300">
          Software Supply-Chain Demonstration
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Software provenance with{" "}
          <span className="text-blue-400">
            Chalk + Vercel
          </span>
        </h1>

        <p className="mt-8 max-w-3xl text-xl leading-8 text-slate-400">
          A simple demonstration showing how source code,
          build information, software provenance and a live
          deployment can be connected together.
        </p>
      </section>

      {/* EXPLANATION */}

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-semibold">
            What is software provenance?
          </h2>

          <p className="mt-5 max-w-3xl leading-7 text-slate-400">
            Software provenance provides evidence about where
            software came from, how it was created and which
            source-code revision produced a particular software
            artefact.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <InfoCard
              title="Traceability"
              text="Connect software back to the repository, branch and commit that produced it."
            />

            <InfoCard
              title="Integrity"
              text="Help determine whether an artefact is still the artefact that was originally created."
            />

            <InfoCard
              title="Assurance"
              text="Provide useful evidence for security, audit, governance and compliance activities."
            />
          </div>
        </div>
      </section>

      {/* PIPELINE */}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold">
          Build pipeline
        </h2>

        <p className="mt-3 text-slate-400">
          How this deployment travelled from source code to the
          website you are viewing.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <PipelineBox
            title="GitHub"
            subtitle="Source"
          />

          <Arrow />

          <PipelineBox
            title="Build"
            subtitle="GitHub Actions"
          />

          <Arrow />

          <PipelineBox
            title="Chalk"
            subtitle="Provenance"
          />

          <Arrow />

          <PipelineBox
            title="Vercel"
            subtitle="Deployment"
          />

          <Arrow />

          <PipelineBox
            title="Live"
            subtitle="Website"
          />
        </div>
      </section>

      {/* DASHBOARD */}

      <section className="border-y border-slate-800 bg-slate-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <h2 className="text-3xl font-semibold">
                Provenance dashboard
              </h2>

              <p className="mt-3 text-slate-400">
                Information associated with this deployment.
              </p>
            </div>

            <span className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
              ● Live Deployment
            </span>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            
            <DataCard
              title="Branch"
              value={build?.branch}
            />

            <DataCard
              title="Commit"
              value={shortCommit}
              mono
            />

            <DataCard
              title="Build time"
              value={
                build
                  ? new Date(
                      build.buildTimestamp
                    ).toLocaleString()
                  : undefined
              }
            />

            <DataCard
              title="Workflow"
              value={build?.workflow}
            />

            <DataCard
              title="Chalk ID"
              value={
                chalk?.chalkId ??
                "Available after CI deployment"
              }
              mono
            />

            <DataCard
              title="Chalk version"
              value={
                chalk?.chalkVersion ??
                "Available after CI deployment"
              }
            />

            <DataCard
              title="Metadata ID"
              value={
                chalk?.metadataId ??
                "Available after CI deployment"
              }
              mono
            />

            <DataCard
              title="Artefact type"
              value={
                chalk?.artifactType ??
                "Available after CI deployment"
              }
            />

            <DataCard
              title="Artefact hash"
              value={
                chalk?.artifactHash ??
                "Available after CI deployment"
              }
              mono
            />

            <DataCard
              title="Signature"
              value={
                chalk
                  ? chalk.signaturePresent
                    ? "Present"
                    : "Not present"
                  : "Available after CI deployment"
              }
            />

            <DataCard
              title="Chalk verification"
              value={
                chalk
                  ? chalk.signatureValidated
                    ? "✓ Signature validated"
                    : "Verification failed"
                  : "Available after CI deployment"
              }
            />
          </div>
        </div>
      </section>

      {/* ABOUT CHALK */}

      {/* PROVENANCE TIMELINE */}

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div>
          <div className="mb-2 text-sm font-medium uppercase tracking-wider text-blue-400">
            Deployment history
          </div>

          <h2 className="text-3xl font-semibold">
            Provenance timeline
          </h2>

          <p className="mt-3 max-w-3xl text-slate-400">
            Recent source-code versions leading to the current
            deployment. The current deployment is the artefact
            verified by Chalk.
          </p>
        </div>

        <div className="mt-12 max-w-4xl">
          {history.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-400">
              Provenance history is not available yet.
            </div>
          ) : (
            history.map((item, index) => {
              const isCurrent =
                build?.commit === item.commit;

              return (
                <div
                  key={item.commit}
                  className="relative flex gap-6 pb-10"
                >
                  {/* Timeline line */}
                  {index !== history.length - 1 && (
                    <div className="absolute left-[11px] top-6 h-full w-px bg-slate-800" />
                  )}

                  {/* Timeline marker */}
                  <div
                    className={`relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-4 ${
                      isCurrent
                        ? "border-blue-400 bg-blue-400"
                        : "border-slate-700 bg-slate-950"
                    }`}
                  />

                  {/* Timeline content */}
                  <div
                    className={`w-full rounded-2xl border p-6 ${
                      isCurrent
                        ? "border-blue-500/40 bg-blue-500/5"
                        : "border-slate-800 bg-slate-900"
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <div
                          className={`text-xs font-medium uppercase tracking-wider ${
                            isCurrent
                              ? "text-blue-400"
                              : "text-slate-500"
                          }`}
                        >
                          {isCurrent
                            ? "Current deployment"
                            : "Previous source version"}
                        </div>

                        <h3 className="mt-2 font-semibold text-slate-100">
                          {item.message}
                        </h3>
                      </div>

                      {isCurrent &&
                        chalk?.signatureValidated && (
                          <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-xs text-green-400">
                            ✓ Chalk verified
                          </span>
                        )}
                    </div>

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">
                          Commit
                        </div>

                        <div className="mt-1 font-mono text-sm text-blue-300">
                          {item.shortCommit}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs uppercase tracking-wider text-slate-500">
                          Date
                        </div>

                        <div className="mt-1 text-sm text-slate-300">
                          {new Date(item.date).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>        

      <section className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold">
          About Chalk
        </h2>

        <p className="mt-5 max-w-3xl leading-7 text-slate-400">
          Chalk adds identifying provenance information to
          software artefacts. This allows information about
          software to travel with the artefact rather than
          existing only inside an external build platform.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <InfoCard
            title="Embedded provenance"
            text="Chalk places identifying metadata inside supported software artefacts."
          />

          <InfoCard
            title="Build metadata"
            text="Build and environmental information can be associated with the resulting software."
          />

          <InfoCard
            title="Verification"
            text="Signed Chalk marks can later be extracted and their signatures validated."
          />

          <InfoCard
            title="Supply-chain security"
            text="Provenance improves traceability between source code, builds and deployed software."
          />
        </div>
      </section>

      <footer className="border-t border-slate-800 px-6 py-10 text-center text-sm text-slate-500">
        Chalk + Vercel Software Provenance Demonstration - DEMO change
      </footer>
    </main>
  );
}

function InfoCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="font-semibold text-slate-100">
        {title}
      </h3>

      <p className="mt-3 leading-6 text-slate-400">
        {text}
      </p>
    </div>
  );
}

function PipelineBox({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="w-full rounded-xl border border-slate-700 bg-slate-900 p-5 text-center md:w-40">
      <div className="font-semibold">
        {title}
      </div>

      <div className="mt-1 text-sm text-slate-500">
        {subtitle}
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div className="text-xl text-blue-400">
      →
    </div>
  );
}

function DataCard({
  title,
  value,
  mono = false,
}: {
  title: string;
  value?: string | null;
  mono?: boolean;
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
      <div className="text-xs uppercase tracking-wider text-slate-500">
        {title}
      </div>

      <div
        className={`mt-2 break-all text-sm ${
          mono
            ? "font-mono text-blue-300"
            : "text-slate-200"
        }`}
      >
        {value ?? "Loading..."}
      </div>
    </div>
  );
}