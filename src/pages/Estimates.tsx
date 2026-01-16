import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Plus, Search } from "lucide-react";

interface Estimate {
  id: string;
  estimate_number: string;
  customer_name: string | null;
  description: string | null;
  service_type: string | null;
  total: number | null;
  status: string | null;
  created_at: string;
}

interface EstimateStats {
  total: number;
  approved: number;
  pending: number;
  totalValue: number;
}

const EstimatesPage = () => {
  const navigate = useNavigate();
  const [estimates, setEstimates] = useState<Estimate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<EstimateStats>({
    total: 0,
    approved: 0,
    pending: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchEstimates();
  }, []);

  const fetchEstimates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('estimates')
        .select('id, estimate_number, customer_name, description, service_type, total, status, created_at')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const estimatesData = data || [];
      setEstimates(estimatesData);

      // Calculate stats
      const approved = estimatesData.filter(e => e.status === 'approved').length;
      const pending = estimatesData.filter(e => e.status === 'pending').length;
      const totalValue = estimatesData.reduce((sum, e) => sum + (e.total || 0), 0);

      setStats({
        total: estimatesData.length,
        approved,
        pending,
        totalValue
      });

    } catch (error) {
      console.error('Error fetching estimates:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string | null) => {
    switch(status) {
      case "approved": return "bg-green-100 text-green-800";
      case "pending": return "bg-orange-100 text-orange-800";
      case "sent": return "bg-blue-100 text-blue-800";
      case "draft": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toLocaleString()}`;
  };

  const filteredEstimates = estimates.filter(estimate => {
    const query = searchQuery.toLowerCase();
    return (
      (estimate.customer_name?.toLowerCase().includes(query)) ||
      (estimate.description?.toLowerCase().includes(query)) ||
      (estimate.estimate_number?.toLowerCase().includes(query)) ||
      (estimate.service_type?.toLowerCase().includes(query))
    );
  });

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-heading font-bold">Estimates</h1>
            <p className="text-muted-foreground mt-1">Create and manage customer estimates</p>
          </div>
          <Button variant="hero" size="lg" asChild>
            <Link to="/estimates/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Estimate
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </CardContent>
              </Card>
            ))
          ) : (
            <>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">Total Estimates</div>
                  <div className="text-2xl font-bold mt-1">{stats.total}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">Approved</div>
                  <div className="text-2xl font-bold mt-1 text-green-600">{stats.approved}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">Pending</div>
                  <div className="text-2xl font-bold mt-1 text-orange-600">{stats.pending}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                  <div className="text-2xl font-bold mt-1">{formatCurrency(stats.totalValue)}</div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Estimates List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>All Estimates</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search estimates..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-5 w-40 mb-2" />
                        <Skeleton className="h-4 w-32 mb-1" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-6 w-20 mb-2" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredEstimates.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                {searchQuery ? (
                  <>
                    <p className="text-muted-foreground mb-2">No estimates match your search</p>
                    <Button variant="outline" onClick={() => setSearchQuery("")}>
                      Clear Search
                    </Button>
                  </>
                ) : (
                  <>
                    <p className="text-muted-foreground mb-4">No estimates yet. Create your first estimate to get started!</p>
                    <Button variant="hero" asChild>
                      <Link to="/estimates/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Estimate
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEstimates.map((estimate) => (
                  <div 
                    key={estimate.id} 
                    className="border rounded-lg p-4 hover:shadow-card transition-shadow cursor-pointer"
                    onClick={() => navigate(`/estimates/${estimate.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{estimate.customer_name || 'No Customer'}</h3>
                          <Badge className={getStatusColor(estimate.status)}>
                            {estimate.status || 'draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {estimate.description || estimate.service_type || 'No description'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {estimate.estimate_number} • {formatDate(estimate.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold">
                          {estimate.total ? `$${estimate.total.toLocaleString()}` : '$0'}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/estimates/${estimate.id}`);
                            }}
                          >
                            View
                          </Button>
                          <Button 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/estimates/${estimate.id}/edit`);
                            }}
                          >
                            Edit
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EstimatesPage;
