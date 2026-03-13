import { useState } from "react";
import type { ChangeRequest } from "../types";
import { simulateChange } from "../api";

function BracesIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5a2 2 0 0 0 2 2h1" />
      <path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1" />
    </svg>
  );
}

interface ChangeSimulationFormProps {
  onResult: (result: Awaited<ReturnType<typeof simulateChange>>) => void;
  onError: (err: Error) => void;
}

const DEFAULT_FORM: ChangeRequest = {
  resourceId: "app-service-plan-eastus",
  resourceType: "AppServicePlan",
  changeType: "Resize",
  region: "eastus",
  environment: "production",
  region: "eastus",
  environment: "production",
};

export function ChangeSimulationForm({
  onResult,
  onError,
}: ChangeSimulationFormProps) {
  const [loading, setLoading] = useState(false);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [form, setForm] = useState<ChangeRequest>(DEFAULT_FORM);

  function toggleJsonMode() {
    if (jsonMode) {
      try {
        const parsed = JSON.parse(jsonInput) as ChangeRequest;
        if (
          typeof parsed.resourceId === "string" &&
          typeof parsed.resourceType === "string" &&
          typeof parsed.changeType === "string" &&
          typeof parsed.region === "string" &&
          typeof parsed.environment === "string"
        ) {
          setForm(parsed);
        }
      } catch {
        /* keep form as-is on invalid JSON */
      }
    } else {
      setJsonInput(JSON.stringify(form, null, 2));
    }
    setJsonMode((m) => !m);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = jsonMode
      ? (() => {
          try {
            return JSON.parse(jsonInput) as ChangeRequest;
          } catch {
            onError(new Error("Invalid JSON"));
            return null;
          }
        })()
      : form;

    if (!payload) return;

    const required = ["resourceId", "resourceType", "changeType", "region", "environment"] as const;
    if (!required.every((k) => typeof payload[k] === "string")) {
      onError(new Error("JSON must include: resourceId, resourceType, changeType, region, environment"));
      return;
    }

    setLoading(true);
    try {
      const result = await simulateChange(payload);
      onResult(result);
    } catch (err) {
      onError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-white">Simulate Change</h2>
        <button
          type="button"
          onClick={toggleJsonMode}
          title={jsonMode ? "Switch to form" : "Switch to JSON"}
          className={`rounded-lg border p-2 transition-colors ${
            jsonMode
              ? "border-indigo-500 bg-indigo-500/20 text-indigo-400"
              : "border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
          }`}
        >
          <BracesIcon className="size-5" />
        </button>
      </div>
      {jsonMode ? (
        <textarea
          value={jsonInput}
          onChange={(e) => setJsonInput(e.target.value)}
          placeholder='{"resourceId":"vm-app-01","resourceType":"VirtualMachine",...}'
          rows={8}
          className="w-full resize-y rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          spellCheck={false}
        />
      ) : (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">
            Resource ID
          </span>
          <input
            type="text"
            value={form.resourceId}
            onChange={(e) =>
              setForm((f) => ({ ...f, resourceId: e.target.value }))
            }
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">
            Resource Type
          </span>
          <input
            type="text"
            value={form.resourceType}
            onChange={(e) =>
              setForm((f) => ({ ...f, resourceType: e.target.value }))
            }
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">
            Change Type
          </span>
          <input
            type="text"
            value={form.changeType}
            onChange={(e) =>
              setForm((f) => ({ ...f, changeType: e.target.value }))
            }
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">Region</span>
          <input
            type="text"
            value={form.region}
            onChange={(e) => setForm((f) => ({ ...f, region: e.target.value }))}
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-300">
            Environment
          </span>
          <input
            type="text"
            value={form.environment}
            onChange={(e) =>
              setForm((f) => ({ ...f, environment: e.target.value }))
            }
            className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-100 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </label>
      </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Simulating…" : "Simulate"}
      </button>
    </form>
  );
}
