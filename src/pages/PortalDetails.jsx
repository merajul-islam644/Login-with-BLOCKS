// CI/CD results portal — static UI matching the reference screenshot.
// All data below is hardcoded; swap the `metrics` and `runs` arrays
// with real values (e.g. from the GitHub Actions API) when ready.

import AppLayout from "@/components/AppLayout";

const metrics = [
  {
    label: "Success rate",
    value: "96%",
    color: "text-green-600 dark:text-green-400",
  },
  { label: "Avg build time", value: "3m 42s" },
  { label: "Test coverage", value: "87%" },
  { label: "Runs today", value: "14" },
];

const STATUS_STYLES = {
  Passed: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-400",
    icon: "check",
  },
  Failed: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-400",
    icon: "x",
  },
  Running: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: "play",
  },
};

const runs = [
  {
    title: "Deploy to production",
    meta: "#248 · fix: auth token refresh · 4 min ago",
    status: "Passed",
  },
  {
    title: "Run unit tests",
    meta: "#247 · feat: add payment webhook · 22 min ago",
    status: "Failed",
  },
  {
    title: "Build docker image",
    meta: "#246 · chore: bump dependencies · 41 min ago",
    status: "Running",
  },
  {
    title: "Lint and typecheck",
    meta: "#245 · docs: update readme · 1 hr ago",
    status: "Passed",
  },
];

function StatusIcon({ status }) {
  const s = STATUS_STYLES[status];

  if (s.icon === "check") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="w-3.5 h-3.5"
      >
        <path
          d="M20 6L9 17l-5-5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (s.icon === "x") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        className="w-3.5 h-3.5"
      >
        <path
          d="M18 6L6 18M6 6l12 12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function MetricBlock({ label, value, color }) {
  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-normal">
        {label}
      </p>
      <p
        className={`text-2xl font-medium ${color || "text-gray-900 dark:text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

function RunRow({ run, isLast }) {
  const s = STATUS_STYLES[run.status];
  return (
    <div
      className={`flex items-center gap-3.5 px-5 py-4 ${!isLast ? "border-b border-gray-200 dark:border-gray-700" : ""}`}
    >
      <div
        className={`w-7 h-7 rounded-full ${s.bg} flex items-center justify-center shrink-0 ${s.text}`}
      >
        <StatusIcon status={run.status} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white">
          {run.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {run.meta}
        </p>
      </div>
      <span
        className={`text-xs font-medium ${s.bg} ${s.text} px-3.5 py-1 rounded-full shrink-0`}
      >
        {run.status}
      </span>
    </div>
  );
}

export default function CicdPortal() {
  return (
    <AppLayout>
      <div className="h-[86vh] bg-gray-50 dark:bg-black p-8 font-system">
        <div className="flex flex-wrap gap-14 mb-10">
          {metrics.map((m) => (
            <MetricBlock key={m.label} {...m} />
          ))}
        </div>

        <p className="text-sm text-gray-400 dark:text-gray-500 mb-3.5">
          Recent pipeline runs
        </p>

        <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden">
          {runs.map((run, i) => (
            <RunRow key={run.title} run={run} isLast={i === runs.length - 1} />
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
