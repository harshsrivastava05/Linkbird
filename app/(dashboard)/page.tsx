// app/(dashboard)/page.tsx
import { getDashboardData } from "@/lib/data";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, Users, Activity } from "lucide-react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {

  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch dashboard data
  const { stats, recentCampaigns, recentLeads } = await getDashboardData();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Overview</h1>

      {/* Stat Cards Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          title="Total Campaigns"
          value={stats.totalCampaigns}
          icon={GitBranch}
        />
        <StatCard title="Total Leads" value={stats.totalLeads} icon={Users} />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={Activity}
        />
      </div>

      {/* Recent Activity Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentCampaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{campaign.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {campaign.status}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{lead.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.email}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">{lead.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
