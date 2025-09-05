"use client";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Define the type for a single campaign
type Campaign = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
};

// This function fetches the campaigns from our API
async function getCampaigns(): Promise<Campaign[]> {
  const res = await fetch("/api/campaigns");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
}

export default function CampaignsPage() {
  const { data, isLoading, error } = useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: getCampaigns,
  });

  if (isLoading) return <div>Loading campaigns...</div>;
  if (error) return <div>An error occurred: {error.message}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold">Campaigns</h1>
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((campaign) => (
            <TableRow key={campaign.id}>
              <TableCell>{campaign.name}</TableCell>
              <TableCell>
                {/* Use the Badge component here */}
                <Badge
                  variant={
                    campaign.status === "Active" ? "default" : "secondary"
                  }
                >
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell>
                {new Date(campaign.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>    
      </Table>
    </div>
  );
}
