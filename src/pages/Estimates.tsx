import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const EstimatesPage = () => {
  const estimates = [
    {
      id: "EST-001",
      customer: "Sarah Johnson",
      project: "Kitchen Plumbing",
      amount: "$1,425",
      status: "approved",
      date: "2024-01-15"
    },
    {
      id: "EST-002",
      customer: "Mike Chen",
      project: "HVAC Installation",
      amount: "$3,200",
      status: "pending",
      date: "2024-01-14"
    },
    {
      id: "EST-003",
      customer: "Emma Davis",
      project: "Electrical Repair",
      amount: "$450",
      status: "sent",
      date: "2024-01-13"
    },
    {
      id: "EST-004",
      customer: "Tom Wilson",
      project: "Bathroom Renovation",
      amount: "$5,800",
      status: "draft",
      date: "2024-01-12"
    }
  ];

  const getStatusColor = (status: string) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Estimates</h1>
            <p className="text-muted-foreground mt-1">Create and manage customer estimates</p>
          </div>
          <Button variant="hero" size="lg" asChild>
            <Link to="/estimates/new">Create New Estimate</Link>
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground">Total Estimates</div>
              <div className="text-2xl font-bold mt-1">156</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground">Approved</div>
              <div className="text-2xl font-bold mt-1 text-green-600">89</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground">Pending</div>
              <div className="text-2xl font-bold mt-1 text-orange-600">34</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-sm font-medium text-muted-foreground">Total Value</div>
              <div className="text-2xl font-bold mt-1">$287K</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Estimates</CardTitle>
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {estimates.map((estimate) => (
                <div key={estimate.id} className="border rounded-lg p-4 hover:shadow-card transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{estimate.customer}</h3>
                        <Badge className={getStatusColor(estimate.status)}>
                          {estimate.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{estimate.project}</p>
                      <p className="text-xs text-muted-foreground mt-1">{estimate.id} • {estimate.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold">{estimate.amount}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button size="sm">Edit</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EstimatesPage;
