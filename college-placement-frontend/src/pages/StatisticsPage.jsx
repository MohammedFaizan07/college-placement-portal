import { useQuery } from "@tanstack/react-query";
import { Award, BarChart3, Briefcase, Building2, FileText, Users } from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { getStatistics } from "@/api/statistics.api";
import { toFriendlyMessage } from "@/api/axios";
import { PageShell } from "@/components/PageShell";
import { Card, ErrorState } from "@/components/ui-kit";
import { Skeleton } from "@/components/Loaders";

export default function StatisticsPage() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["statistics"],
    queryFn: getStatistics,
  });

  const cards = [
    { label: "Total Students", value: data?.totalStudents, icon: Users },
    { label: "Total Companies", value: data?.totalCompanies, icon: Building2 },
    { label: "Total Jobs", value: data?.totalJobs, icon: Briefcase },
    { label: "Total Applications", value: data?.totalApplications, icon: FileText },
    { label: "Total Selected Students", value: data?.totalSelectedStudents, icon: Award },
  ];

  const chartData = data
    ? [
        { name: "Students", value: data.totalStudents ?? 0 },
        { name: "Companies", value: data.totalCompanies ?? 0 },
        { name: "Jobs", value: data.totalJobs ?? 0 },
        { name: "Applications", value: data.totalApplications ?? 0 },
        { name: "Selected", value: data.totalSelectedStudents ?? 0 },
      ]
    : [];

  return (
    <PageShell
      title="Placement Statistics"
      description="Aggregated figures reported directly by the placement database."
    >
      {isError ? (
        <ErrorState
          message={toFriendlyMessage(error, "Unable to load statistics. Please try again.")}
          onRetry={() => refetch()}
        />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <Card key={card.label} className="flex items-center gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-accent text-primary">
                  <card.icon className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                  {isLoading ? (
                    <Skeleton className="mt-2 h-8 w-20" />
                  ) : (
                    <p className="text-3xl font-bold text-foreground">{card.value ?? 0}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Placement activity overview
              </h2>
            </div>
            <div className="mt-6 h-72 w-full">
              {isLoading ? (
                <Skeleton className="h-full w-full" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--secondary)" }}
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        fontSize: 12,
                      }}
                    />
                    <Bar
                      dataKey="value"
                      fill="var(--primary)"
                      radius={[6, 6, 0, 0]}
                      maxBarSize={64}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </>
      )}
    </PageShell>
  );
}
