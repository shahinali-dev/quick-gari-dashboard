interface PlaceholderPageProps {
  title: string;
}

const stats = [
  { label: "Total Rides", value: "2,840" },
  { label: "Active Drivers", value: "134" },
  { label: "Revenue", value: "৳48,920" },
  { label: "Pending", value: "26" },
];

export default function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
        {title}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-emerald-600 font-medium">
              ↑ 12% this week
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm min-h-64 flex items-center justify-center">
        <p className="text-gray-400 text-sm">
          Content for <strong>{title}</strong> goes here
        </p>
      </div>
    </div>
  );
}
