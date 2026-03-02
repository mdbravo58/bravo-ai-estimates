import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Phone, Mail, Calendar, UserPlus } from "lucide-react";
import { format } from "date-fns";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  notes: string | null;
  source: string | null;
  status: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-yellow-100 text-yellow-800",
  trial_scheduled: "bg-indigo-100 text-indigo-800",
  trial_completed: "bg-green-100 text-green-800",
  enrolled: "bg-purple-100 text-purple-800",
  lost: "bg-red-100 text-red-800",
};

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { fetchLeads(); }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setLeads(data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, status: "new" | "contacted" | "trial_scheduled" | "trial_completed" | "enrolled" | "lost") => {
    const { error } = await supabase.from("leads").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(`Status updated to ${status}`);
    fetchLeads();
  };

  const filtered = leads.filter(l =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  if (loading) {
    return <Layout><div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div></Layout>;
  }

  return (
    <Layout>
      <main role="main">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Leads</h1>
              <p className="text-muted-foreground">Manage inbound leads and quote requests</p>
            </div>
            <Badge variant="outline">{leads.length} total</Badge>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search leads..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-4">
            {["new", "contacted", "enrolled", "lost"].map(s => (
              <Card key={s}>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{leads.filter(l => l.status === s).length}</div>
                  <p className="text-xs text-muted-foreground capitalize">{s}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>Lead Pipeline</CardTitle></CardHeader>
            <CardContent>
              {filtered.length === 0 ? (
                <div className="text-center py-8">
                  <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No leads yet. Share your <a href="/request-quote" className="text-primary underline">/request-quote</a> page to start capturing leads.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filtered.map(lead => (
                    <div key={lead.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{lead.name}</h3>
                            <Badge className={statusColors[lead.status || "new"]}>{lead.status || "new"}</Badge>
                            {lead.source && <Badge variant="outline">{lead.source}</Badge>}
                          </div>
                          <div className="flex gap-3 text-sm text-muted-foreground">
                            {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                            {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{format(new Date(lead.created_at), "MMM d, yyyy")}</span>
                          </div>
                          {lead.notes && <p className="text-sm text-muted-foreground mt-1">{lead.notes}</p>}
                        </div>
                        <Select value={lead.status || "new"} onValueChange={(v) => updateStatus(lead.id, v as "new" | "contacted" | "trial_scheduled" | "trial_completed" | "enrolled" | "lost")}>
                          <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">New</SelectItem>
                            <SelectItem value="contacted">Contacted</SelectItem>
                            <SelectItem value="trial_scheduled">Trial Scheduled</SelectItem>
                            <SelectItem value="trial_completed">Trial Completed</SelectItem>
                            <SelectItem value="enrolled">Enrolled</SelectItem>
                            <SelectItem value="lost">Lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </Layout>
  );
};

export default LeadsPage;
