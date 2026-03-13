import { useState } from 'react';
import { ChangeSimulationForm } from './components/ChangeSimulationForm';
import { DependencyGraphView } from './components/DependencyGraphView';
import type { SimulationResponse } from './types';

function App() {
  const [result, setResult] = useState<SimulationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const riskClass = (level: string) => {
    if (level === 'High') return 'bg-red-900/60 text-red-300';
    if (level === 'Medium') return 'bg-amber-900/60 text-amber-300';
    return 'bg-emerald-900/60 text-emerald-300';
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-950">
      <header className="border-b border-slate-800 bg-slate-900/50 px-6 py-6">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Change Risk Simulator
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Visualize blast radius and dependency impact before deploying changes
        </p>
      </header>

      <main className="flex-1 px-6 py-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
            <ChangeSimulationForm
              onResult={(r) => {
                setResult(r);
                setError(null);
              }}
              onError={(e) => {
                setError(e.message);
                setResult(null);
              }}
            />
          </section>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-800 bg-red-950/60 px-4 py-3 text-sm text-red-300"
            >
              {error}
            </div>
          )}

          {result && (
            <div className="animate-fade-in space-y-6">
              <section className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/80 px-6 py-4 shadow-sm">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${riskClass(
                    result.riskLevel
                  )}`}
                >
                  {result.riskLevel}
                </span>
                <span className="text-sm font-semibold text-slate-200">
                  Score: {result.totalScore}
                </span>
                <span className="text-sm text-slate-400">
                  {result.impactedResources.length} impacted resource(s)
                </span>
              </section>

              {result.signals.length > 0 && (
                <section className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm">
                  <h3 className="mb-4 text-base font-semibold text-white">
                    Risk Signals
                  </h3>
                  <ul className="space-y-2">
                    {result.signals.map((s, i) => (
                      <li
                        key={i}
                        className="rounded-lg border-l-4 border-indigo-500 bg-slate-800/50 px-4 py-2 text-sm text-slate-200"
                      >
                        <strong>{s.name}</strong> ({s.score}): {s.explanation}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-sm">
                <h3 className="border-b border-slate-700 px-6 py-4 text-base font-semibold text-white">
                  Dependency Graph & Blast Radius
                </h3>
                <DependencyGraphView
                  graph={result.graph}
                  impactedResources={result.impactedResources}
                  rootResourceId={result.impactedResources[0]}
                />
              </section>
            </div>
          )}

          {!result && !error && (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 py-24 text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-indigo-900/60" />
              <h3 className="text-lg font-semibold text-slate-200">
                Ready to Simulate
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Select a resource and change type to visualize the impact
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
