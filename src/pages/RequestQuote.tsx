import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Send } from "lucide-react";

const RequestQuote = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSubmitting(true);
    try {
      // We need an org id. For the public form, we'll use a default org or the first one.
      // In production, this page would be scoped to a specific org via URL param.
      const { data: orgs } = await supabase.from("organizations").select("id").limit(1);
      const orgId = orgs?.[0]?.id;
      if (!orgId) throw new Error("No organization found");

      const { error } = await supabase.from("leads").insert({
        name: form.name,
        email: form.email || null,
        phone: form.phone || null,
        notes: form.notes || null,
        organization_id: orgId,
        source: "website",
        status: "new",
      });
      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      console.error("Error submitting quote request:", err);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto" />
            <h2 className="text-2xl font-bold">Quote Request Received!</h2>
            <p className="text-muted-foreground">We'll get back to you within 24 hours with a detailed estimate.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="max-w-lg w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Request a Free Quote</CardTitle>
          <p className="text-muted-foreground">Tell us about your project and we'll provide a detailed estimate.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div><Label>Name *</Label><Input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" /></div>
            <div><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" /></div>
            <div><Label>Phone</Label><Input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="(555) 123-4567" /></div>
            <div><Label>Project Details</Label><Textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Describe the work you need done..." rows={4} /></div>
            <Button type="submit" className="w-full" disabled={submitting || !form.name.trim()}>
              <Send className="h-4 w-4 mr-2" />{submitting ? "Submitting..." : "Request Quote"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestQuote;
