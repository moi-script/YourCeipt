import React, { useEffect, useMemo, useState } from "react";
import { RefreshCw, Check, ChevronDown, Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/Toaster.jsx";
import { BASE_API_URL } from "@/api/getKeys";

const STATUS = {
  active: { label: "Working", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-400" },
  degraded: { label: "Unreliable", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  unknown: { label: "Not checked yet", dot: "bg-stone-300 dark:bg-stone-600", text: "text-stone-500" },
  busy: { label: "Busy", dot: "bg-amber-500", text: "text-amber-700 dark:text-amber-400" },
  paused: { label: "Paused", dot: "bg-stone-400", text: "text-stone-500" },
  down: { label: "Unavailable", dot: "bg-red-500", text: "text-red-700 dark:text-red-400" },
};

const USABLE = ["active", "degraded", "unknown"];

const formatLatency = (ms) => (ms == null ? "—" : ms < 1000 ? `${ms} ms` : `${(ms / 1000).toFixed(1)} s`);

const timeAgo = (iso) => {
  if (!iso) return null;
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  return hours < 24 ? `${hours} h ago` : `${Math.round(hours / 24)} d ago`;
};

function StatusPill({ status }) {
  const s = STATUS[status] || STATUS.unknown;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
}

function ModelRow({ model, selected, disabled, onSelect }) {
  const usable = USABLE.includes(model.status) || model.builtIn;
  return (
    <li className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-4 sm:px-5 py-4">
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-medium text-stone-900 dark:text-stone-100">{model.name}</p>
          {model.recommended && model.status === "active" && (
            <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
              Fastest
            </span>
          )}
        </div>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5 truncate">
          {model.provider} · <span className="font-mono">{model.id.replace(/^google-ai\//, "")}</span>
        </p>
        {model.error && <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">{model.error}</p>}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-6 shrink-0">
        <div className="text-left sm:text-right min-w-[92px]">
          <StatusPill status={model.status} />
          <p className="text-xs text-stone-500 tabular-nums mt-0.5">
            {formatLatency(model.latency)}
            {model.extractions > 0 && ` · ${Math.round((model.successRate ?? 0) * 100)}% of ${model.extractions}`}
          </p>
        </div>
        {selected ? (
          <span className="inline-flex items-center gap-1 h-9 px-4 text-sm font-medium text-emerald-800 dark:text-emerald-300">
            <Check className="w-4 h-4" /> In use
          </span>
        ) : (
          <Button
            size="sm"
            variant="outline"
            disabled={disabled || !usable}
            onClick={() => onSelect(model.id)}
            className="h-9 rounded-full px-4 border-stone-300 dark:border-stone-700"
          >
            Use this
          </Button>
        )}
      </div>
    </li>
  );
}

export default function AIModelDashboard() {
  const { isModelLoading, models, setModels, user, activeModelName, setActiveModelName } = useAuth();
  const toast = useToast();
  const [meta, setMeta] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showUnavailable, setShowUnavailable] = useState(false);

  const list = Array.isArray(models) ? models : [];
  const selected = activeModelName || "auto";

  const { builtIn, community, unavailable } = useMemo(() => {
    const builtIn = list.filter((m) => m.builtIn);
    const others = list.filter((m) => !m.builtIn);
    return {
      builtIn,
      community: others.filter((m) => USABLE.includes(m.status)),
      unavailable: others.filter((m) => !USABLE.includes(m.status)),
    };
  }, [list]);

  const selectedModel = list.find((m) => m.id === selected);
  const selectedGone = selected !== "auto" && list.length > 0 && (!selectedModel || !USABLE.includes(selectedModel.status));

  // The list itself is cached server-side, so this is cheap; it brings the
  // "last tested" time and whether a re-test is allowed yet.
  useEffect(() => {
    fetch(BASE_API_URL + "/extract/getModels")
      .then((r) => r.json())
      .then((data) => {
        setMeta(data);
        if (Array.isArray(data.models)) setModels(data.models);
      })
      .catch(() => {});
  }, [setModels]);

  const refresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(BASE_API_URL + "/extract/getModels?refresh=1");
      const data = await res.json();
      setModels(data.models);
      setMeta(data);
    } catch {
      toast.error("Couldn't check the models", "Check your connection and try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const select = async (modelId) => {
    if (!user?._id) return;
    setIsSaving(true);
    try {
      const res = await fetch(BASE_API_URL + "/extract/postModel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, modelName: modelId }),
      });
      if (!res.ok) throw new Error();
      setActiveModelName(modelId);
      const name = modelId === "auto" ? "Auto" : list.find((m) => m.id === modelId)?.name || modelId;
      toast.success("Model updated", `${name} will read your next receipt.`);
    } catch {
      toast.error("Couldn't change the model", "Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const anyPaused = list.some((m) => m.status === "paused");
  const pausedUntil = meta?.openrouterPausedUntil;
  const canRefresh = meta ? meta.canRefresh : true;

  return (
    <div className="min-h-screen bg-[#f7f6f2] dark:bg-stone-950 font-sans text-stone-800 dark:text-stone-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-stone-900 dark:text-stone-50">AI models</h1>
            <p className="text-sm text-stone-600 dark:text-stone-400 mt-2 max-w-lg">
              Choose which model reads your receipts. If it fails or takes too long, Recepta hands the job to the next working model, so an upload never gets stuck on one.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={refresh}
            disabled={isRefreshing || !canRefresh}
            title={canRefresh ? "Test the free models again" : "Checked recently. Try again in a few minutes."}
            className="rounded-full h-10 px-5 border-stone-300 dark:border-stone-700 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Checking…" : "Check again"}
          </Button>
        </header>

        {selectedGone && (
          <div className="flex gap-3 items-start rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-950/30 p-4 mb-6 text-sm">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-amber-900 dark:text-amber-200">
              The model you picked ({selected.split("/").pop()}) isn't available right now, so your receipts are going to the fallback models. Switch to Auto to stop seeing this.
            </p>
          </div>
        )}

        {/* Auto */}
        <section className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 px-4 sm:px-5 py-4">
            <div className="flex-1">
              <p className="font-medium text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700 dark:text-emerald-400" /> Auto
                <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">Recommended</span>
              </p>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Starts with Gemini, which reads most receipts in 2 to 8 seconds, then moves down the list if a model is busy.
              </p>
            </div>
            {selected === "auto" ? (
              <span className="inline-flex items-center gap-1 h-9 px-4 text-sm font-medium text-emerald-800 dark:text-emerald-300 shrink-0">
                <Check className="w-4 h-4" /> In use
              </span>
            ) : (
              <Button size="sm" onClick={() => select("auto")} disabled={isSaving} className="h-9 rounded-full px-4 bg-emerald-700 hover:bg-emerald-800 text-white shrink-0">
                Use Auto
              </Button>
            )}
          </div>
        </section>

        {isModelLoading && !list.length ? (
          <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-8 text-center text-sm text-stone-500">
            <RefreshCw className="w-4 h-4 animate-spin mx-auto mb-2" />
            Loading models…
          </div>
        ) : (
          <>
            <section className="mb-6">
              <h2 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-1">Built in</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">Google Gemini on Recepta's own key. Fast and accurate on receipts.</p>
              <ul className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800">
                {builtIn.map((m) => (
                  <ModelRow key={m.id} model={m} selected={selected === m.id} disabled={isSaving} onSelect={select} />
                ))}
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-sm font-medium text-stone-900 dark:text-stone-100 mb-1">Free community models</h2>
              <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                Pulled live from OpenRouter's free list and tested with a sample receipt. Expect 20 to 60 seconds per receipt; these change often.
                {meta?.checkedAt && ` Last tested ${timeAgo(meta.checkedAt)}.`}
              </p>

              {anyPaused && (
                <p className="text-xs text-stone-600 dark:text-stone-400 mb-3 rounded-lg bg-stone-100 dark:bg-stone-900 px-3 py-2">
                  The free daily limit for these models has been reached. They come back
                  {pausedUntil ? ` at ${new Date(pausedUntil).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}` : " tomorrow"}. Gemini keeps working in the meantime.
                </p>
              )}

              {community.length > 0 ? (
                <ul className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 divide-y divide-stone-100 dark:divide-stone-800">
                  {community.map((m) => (
                    <ModelRow key={m.id} model={m} selected={selected === m.id} disabled={isSaving} onSelect={select} />
                  ))}
                </ul>
              ) : (
                !anyPaused && (
                  <p className="text-sm text-stone-500 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-6 text-center">
                    None of the free models passed the test right now.
                  </p>
                )
              )}

              {unavailable.length > 0 && (
                <div className="mt-3">
                  <button
                    onClick={() => setShowUnavailable((v) => !v)}
                    className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-800 dark:hover:text-stone-200"
                  >
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showUnavailable ? "rotate-180" : ""}`} />
                    {unavailable.length} unavailable right now
                  </button>
                  {showUnavailable && (
                    <ul className="mt-2 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 divide-y divide-stone-100 dark:divide-stone-800">
                      {unavailable.map((m) => (
                        <ModelRow key={m.id} model={m} selected={selected === m.id} disabled onSelect={select} />
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
